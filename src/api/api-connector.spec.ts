import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from "vitest";
import { apiRoute } from "../config/config";
import { ApiConnector } from "./api-connector";
import { client } from "./mock-client";

let fetch: Mock<(typeof global)["fetch"]>;
let apiConnector: ApiConnector;

beforeEach(() => {
  fetch = vi.fn();
  global.fetch = fetch;

  apiConnector = new ApiConnector(apiRoute);
  apiConnector.init();
});

afterEach(() => {
  apiConnector.destroy();
});

describe("status 401", () => {
  test("refreshes token", async () => {
    let isTokenValid = false;

    fetch.mockImplementation(async (request: Request) => {
      if (request.url.endsWith("/auth/refresh")) {
        isTokenValid = true;
        return new Response(null, { status: 200 });
      } else if (isTokenValid) {
        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 401 });
      }
    });

    await expect(
      client.post({
        url: "/some-endpoint",
        body: { hello: "world" },
      }),
    ).resolves.toBeTruthy();
  });

  test("does not retry when refresh fails", async () => {
    fetch.mockImplementation(async () => {
      return new Response(null, { status: 401 });
    });

    await expect(
      client.post({
        url: "/some-endpoint",
        body: { hello: "world" },
      }),
    ).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(3); // First call fails with 401 and refresh fails too
    expect((fetch.mock.lastCall[0] as Request).url).toContain("/auth/logout");
  });

  test("tries the refresh only once", async () => {
    fetch.mockImplementation(async (request: Request) => {
      if (request.url.endsWith("/auth/refresh")) {
        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 401 });
      }
    });

    await expect(
      client.post({
        url: "/some-endpoint",
        body: { hello: "world" },
      }),
    ).rejects.toThrow();
    expect(fetch).toHaveBeenCalledTimes(4); // First 401, refresh with 200, retry fails with 401 again
    expect((fetch.mock.lastCall[0] as Request).url).toContain("/auth/logout");
  });
});

describe("status 428", () => {
  test("prompts for password", async () => {
    fetch.mockResolvedValue(new Response(null, { status: 428 }));

    void client.post({ url: "/some-endpoint", body: { hello: "world" } });

    await expect.poll(() => apiConnector.promptPassword).toBe(true);
  });

  test("resolves request after relogin", async () => {
    let loggedIn = false;
    let requestFinished = false;

    fetch.mockImplementation(async (request: Request) => {
      if (request.url.endsWith("/auth/login")) {
        loggedIn = true;
        return new Response(null, { status: 200 });
      } else if (loggedIn) {
        return new Response(null, { status: 200 });
      } else {
        return new Response(null, { status: 428 });
      }
    });

    void client
      .post({ url: "/some-endpoint", body: { hello: "world" } })
      .then(() => {
        requestFinished = true;
      });

    // Prompt shown
    await expect.poll(() => apiConnector.promptPassword).toBe(true);
    expect(requestFinished).toBe(false);

    // Relogin, request finishes
    await apiConnector.relogin("secretpassword");
    await expect.poll(() => requestFinished).toBe(true);
  });

  test("prompts for password when 428 is received on refreshed token", async () => {
    let tokenRefreshed = false;

    fetch.mockImplementation(async (request: Request) => {
      if (request.url.endsWith("/auth/refresh")) {
        tokenRefreshed = true;
        return new Response(null, { status: 200 });
      } else if (tokenRefreshed) {
        return new Response(null, { status: 428 });
      } else {
        return new Response(null, { status: 401 });
      }
    });

    void client.post({
      url: "/some-endpoint",
      body: { hello: "world" },
    });

    await expect.poll(() => apiConnector.promptPassword).toBe(true);
  });
});
