import { reactive } from "@vue/reactivity";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ApiConnector } from "../api/api-connector";
import { apiRoute } from "../config/config";
import { AppModel } from "./app-model";
import { initGlobalErrorHandling } from "./errors";
import { createRouter } from "./router";

function main() {
  initGlobalErrorHandling();

  const seerlinqApi = reactive(new ApiConnector(apiRoute));
  seerlinqApi.init();

  const app = reactive(new AppModel(seerlinqApi));
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const router = createRouter(app);
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);

  app.init();
}

main();
