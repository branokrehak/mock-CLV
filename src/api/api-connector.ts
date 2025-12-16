import {
  apiGetAuthLogout,
  apiGetAuthRefresh,
  apiGetInfo,
  apiGetLimiters,
  apiGetUsersMe,
  APIInfoResponse,
  apiPostAuthLogin,
  apiPutPatientsPatientIdApproveConsentPaper,
  apiPutPatientsPatientIdApproveConsentTelemonitoring,
  apiPutPatientsPatientIdRevokeConsentPaper,
  apiPutPatientsPatientIdRevokeConsentTelemonitoring,
  client,
  DefaultMedicationSchemaResponse,
  DefaultPatientResponse,
  FullUserResponse,
  Level3PatientResponse,
  UserPatientRoleResponse,
  UserResponseManaging,
} from ".";
import { countriesRegistry } from "../app/countries-registry";
import { apiRoute } from "../config/config";
import { SearchParam } from "../constants/constants";
import { userLevel } from "../constants/roles";
import { Deferral } from "../utils/utils";

export class ApiConnector {
  apiRoute: string;
  apiVersion: string;
  loggedIn: boolean;
  username: string | null;
  userUUID: string | null;
  userLevel: number | null;
  apiInfo: APIInfoResponse;
  canIAddPatients: boolean;
  isProdEnv: boolean;
  canViewWaitingOrAuditRoom: boolean;
  promptPassword = false;

  private deferralOn428: Deferral;
  private loggingOut = false;
  private refreshPromise?: Promise<boolean>;
  private preClonedRequests = new Map<Request, Request>();
  private responseCache = new Map<string, Response>();
  private requestOptionsMap = new Map<Request, RequestOptionsWithMeta>();

  constructor(apiRoute: string, apiVersion: string = "v1") {
    this.apiRoute = apiRoute;
    this.apiVersion = apiVersion;
    this.loggedIn = false;
    this.username = null;
    this.apiInfo = null;
    this.canIAddPatients = false;
    this.isProdEnv = false;
    this.canViewWaitingOrAuditRoom = false;
    console.log("Initialized with route", apiRoute);
  }

  init() {
    client.setConfig({
      baseUrl: apiRoute,
      credentials: "include",
      // Wrapped `fetch` impl for cache
      fetch: async (request) => {
        const options = this.requestOptionsMap.get(request);

        if (options?.meta?.useSessionCache) {
          const cachedResponse = this.responseCache.get(request.url);
          if (cachedResponse) {
            return cachedResponse.clone();
          }
        }

        const response = await fetch(request);

        if (options?.meta?.useSessionCache !== undefined) {
          this.responseCache.set(request.url, response.clone());
        }

        return response;
      },
    });

    // Normally we could just use arrow functions instead of `bind`, but we can't do that within a `reactive` object. :/
    this.interceptRequest = this.interceptRequest.bind(this);
    this.interceptResponse = this.interceptResponse.bind(this);
    this.interceptError = this.interceptError.bind(this);

    client.interceptors.request.use(this.interceptRequest);
    client.interceptors.response.use(this.interceptResponse);
    client.interceptors.error.use(this.interceptError);
  }

  destroy() {
    client.interceptors.request.eject(this.interceptRequest);
    client.interceptors.response.eject(this.interceptResponse);
    client.interceptors.error.eject(this.interceptError);
  }

  versionedRoute() {
    return `${this.apiRoute}/api/${this.apiVersion}`;
  }

  // headers

  private refreshHeaders() {
    const csrfToken = this.getCSRFToken("csrf_refresh_token");
    return { "X-CSRF-TOKEN": csrfToken };
  }

  private getCSRFToken(token: string) {
    let csrfToken = null;
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === token) {
        csrfToken = decodeURIComponent(value);
      }
    });
    return csrfToken !== null ? csrfToken : null;
  }

  // auth flow

  async login(username: string, password: string) {
    await apiPostAuthLogin({
      body: {
        username: username,
        password: password,
      },
    });

    let redirect = "/";
    const redirectParam =
      new URL(location.href).searchParams.get(SearchParam.redirect) || "/";

    if (redirectParam) {
      // Simple validation to disallow redirect to other origins
      if (/^\/[^\s]*$/.test(redirect)) {
        redirect = redirectParam;
      } else {
        console.error("Invalid redirect param");
      }
    }

    console.log("Logged in");
    window.location.href = redirect;
  }

  async relogin(password: string) {
    await apiPostAuthLogin({
      body: {
        username: this.username,
        password: password,
      },
      meta: { ignore401: true, ignore428: true } satisfies RequestMeta,
    });

    this.deferralOn428?.resolve();
    this.deferralOn428 = undefined;
    this.promptPassword = false;
  }

  cancelPasswordPrompt() {
    this.deferralOn428?.reject();
    this.deferralOn428 = undefined;
    this.promptPassword = false;
  }

  private async checkWaitingOrAuditRoomAccess(
    data: UserPatientRoleResponse | UserResponseManaging | FullUserResponse,
  ) {
    if (this.userLevel === 4) {
      // admin see everything
      return true;
    } else if (this.userLevel === 2) {
      // temp. change -> do not show for level 2
      return false;
    } else if (this.userLevel === 3) {
      // Level 3 users with active monitoring access policy can view
      if (
        data.hasOwnProperty("access_policy") &&
        data["access_policy"]?.monitoring_active === true
      ) {
        return true;
      }
    }
    return false;
  }

  private async checkCanAddPatients(
    data: UserPatientRoleResponse | UserResponseManaging | FullUserResponse,
  ) {
    // when admin or seerlinq-user -> yes
    const instantTrue = ["seerlinq-user", "admin"];
    if (instantTrue.includes(data.role)) {
      return true;
    }
    // when study-physician or physician with active monitoring access policy -> yes
    const monitoringRoles = ["study-physician", "physician"];
    if (
      monitoringRoles.includes(data.role) &&
      data.hasOwnProperty("access_policy") &&
      data["access_policy"]?.monitoring_active === true
    ) {
      return true;
    }
    return false;
  }

  async assumeLoggedIn() {
    await Promise.all([
      this.fetchMyInfo(),
      this.fetchApiInfo(),
      countriesRegistry.load(),
    ]);
  }

  private async fetchMyInfo() {
    const { data } = await apiGetUsersMe();
    this.username = data.username;
    this.userUUID = data.uuid;
    this.userLevel = userLevel[data.role];
    this.canViewWaitingOrAuditRoom =
      await this.checkWaitingOrAuditRoomAccess(data);
    this.canIAddPatients = await this.checkCanAddPatients(data);

    this.loggedIn = true;
  }

  private async fetchApiInfo() {
    const info = await apiGetInfo();
    this.apiInfo = info.data;
    this.isProdEnv = this.apiInfo.environment === "prod";
  }

  async logout(returnAfterLogin = false) {
    if (this.loggingOut) {
      return; // Prevent re-entry
    }

    this.loggingOut = true;
    await apiGetAuthLogout({
      throwOnError: false,
      meta: { ignore401: true, ignore428: true } satisfies RequestMeta,
    });
    console.log("Logged out");

    window.location.href =
      "/login" +
      (returnAfterLogin
        ? `?${SearchParam.redirect}=${encodeURIComponent(location.pathname)}`
        : "");
  }

  private async tryRefresh() {
    // This trick with storing the Promise prevents multiple simultaneous calls
    if (!this.refreshPromise) {
      const headers = this.refreshHeaders();
      this.refreshPromise = apiGetAuthRefresh({
        headers,
        meta: { ignore401: true, ignore428: true } satisfies RequestMeta,
      })
        .then(() => true)
        .catch((error) => {
          if (error instanceof RequestError && error.response?.status === 401) {
            // 401 means the refresh token is probably expired
            return false;
          } else {
            // Rethrow any other error. This shouldn't log out
            throw error;
          }
        })
        .finally(() => {
          this.refreshPromise = undefined;
        });
    }
    return this.refreshPromise;
  }

  // API operations

  async getLimiters() {
    const limiters = await apiGetLimiters();
    return limiters.data;
  }

  async revokePaperConsent(patId: number) {
    await apiPutPatientsPatientIdRevokeConsentPaper({
      path: { patient_id: patId },
    });
    window.location.reload();
  }

  async revokeTeleConsent(patId: number) {
    await apiPutPatientsPatientIdRevokeConsentTelemonitoring({
      path: { patient_id: patId },
    });
    window.location.reload();
  }

  async approvePaperConsent(patId: number) {
    await apiPutPatientsPatientIdApproveConsentPaper({
      path: { patient_id: patId },
    });
    window.location.reload();
  }

  async approveTeleConsent(patId: number) {
    await apiPutPatientsPatientIdApproveConsentTelemonitoring({
      path: { patient_id: patId },
    });
    window.location.reload();
  }

  clearResponseCache() {
    this.responseCache.clear();
  }

  private attachCSRFToken(request: Request) {
    // Add CSRF token for POST/PUT
    if (
      request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "DELETE"
    ) {
      const token = this.getCSRFToken("csrf_access_token");
      if (token) {
        request.headers.set(
          "X-CSRF-TOKEN",
          this.getCSRFToken("csrf_access_token"),
        );
      }
    }
  }

  private interceptRequest(request: Request, options: RequestOptionsWithMeta) {
    // Prepare a clone of the request in case we need to retry it (we cannot clone it after it has been used anymore)
    this.preClonedRequests.set(request, request.clone());
    this.requestOptionsMap.set(request, options);
    this.attachCSRFToken(request);
    return request;
  }

  private async interceptResponse(
    response: Response,
    request: Request,
    options: RequestOptionsWithMeta,
  ) {
    const clonedRequest = this.preClonedRequests.get(request);
    this.preClonedRequests.delete(request);
    this.requestOptionsMap.delete(request);

    if (response.status === 401 && !options.meta?.ignore401) {
      return this.handle401(clonedRequest, response);
    } else if (response.status === 428 && !options.meta?.ignore428) {
      return this.handle428(clonedRequest, response);
    } else {
      return response;
    }
  }

  private async handle401(request: Request, response: Response) {
    // Try refresh once
    const refreshSuccess = await this.tryRefresh();

    if (!refreshSuccess) {
      void this.logout(true);
      return response;
    }

    // Retry fetch if refresh was successful
    response = await this.refetch(request);
    if (response.status === 401) {
      void this.logout(true);
    }

    if (response.status === 428) {
      return this.handle428(request, response);
    }

    return response;
  }

  private async handle428(request: Request, response: Response) {
    this.promptPassword = true;

    if (!this.deferralOn428) {
      this.deferralOn428 = new Deferral();
    }

    try {
      await this.deferralOn428.promise;
    } catch (error) {
      // Prompt cancelled => return the original response
      return response;
    }

    // Retry fetch
    return this.refetch(request);
  }

  private refetch(request: Request) {
    request = request.clone();
    this.attachCSRFToken(request);
    return fetch(request);
  }

  private interceptError(error: unknown, response: Response, request: Request) {
    this.requestOptionsMap.delete(request);
    return new RequestError(error, response, request);
  }
}

export class RequestError extends Error {
  name = "RequestError";

  constructor(
    readonly data: unknown,
    readonly response: Response,
    readonly request: Request,
  ) {
    super(`Status ${response.status} from ${request.method} ${request.url}`);
  }
}

/** This is the type we get from the `/patients` endpoint when we use `load_type: basic`. */
export type PatientDto = Level3PatientResponse | DefaultPatientResponse;

export type MedicationDto = DefaultMedicationSchemaResponse;

// RequestOptions type - simplified for mocks
type RequestOptions = {
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
  meta?: RequestMeta;
  throwOnError?: boolean;
};

interface RequestOptionsWithMeta extends RequestOptions {
  meta?: RequestMeta;
}

interface RequestMeta {
  ignore401?: boolean;
  ignore428?: boolean;
  useSessionCache?: boolean;
}
