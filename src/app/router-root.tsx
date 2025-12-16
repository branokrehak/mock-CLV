import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ToastsProvider } from "../components/ui-kit/toasts";

declare global {
  interface Window {
    navigate: (path: string) => void;
  }
}

export function RouterRoot() {
  const navigate = useNavigate();

  useEffect(() => {
    window.navigate = (path: string) => {
      navigate(path);
    };

    return () => {
      delete window.navigate;
    };
  }, [navigate]);

  return (
    <ToastsProvider>
      <Outlet />
    </ToastsProvider>
  );
}
