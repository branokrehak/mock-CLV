import { RequestError } from "../api/api-connector";
import { showToast } from "../components/ui-kit/toasts";

export function initGlobalErrorHandling() {
  window.addEventListener("error", (event) => {
    handleError(event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    handleError(event.reason);
  });

  window.handleError = handleError;
}

function isProbablyNetworkError(error: unknown) {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

export function handleError(error: unknown) {
  if (isProbablyNetworkError(error)) {
    showToast({ message: "Network error" });
  } else if (error instanceof RequestError) {
    if (error.response?.status === 401) {
      // No need to show an alert, just log out
      return;
    }

    const errorMessage = `Calling ${error.request.method} ${error.request.url} returned status: ${error.response.status}`;
    const errorDetails = JSON.stringify(error.data);
    const formattedMessage = `API error\n ${errorMessage}\nDetails: ${errorDetails}`;
    alert(formattedMessage);
  } else {
    console.error(error);
  }
}
