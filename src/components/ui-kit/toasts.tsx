import * as ToastPrimitive from "@radix-ui/react-toast";
import React, { createContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./toasts.module.css";

interface Toast {
  id: string;
  message: string;
}

interface ToastContextValue {
  showToast: (params: { message: string }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToastFn = ({ message }: { message: string }) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message }]);
  };

  // Connect the global toast function
  useEffect(() => {
    setGlobalToast(showToastFn);
    return () => {
      setGlobalToast(() => {});
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: showToastFn }}>
      {children}
      <ToastPrimitive.Provider>
        {createPortal(
          <ToastPrimitive.Viewport className={styles.list} />,
          document.body,
        )}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className={styles.toast}
            onOpenChange={(open) => {
              if (!open) removeToast(toast.id);
            }}
          >
            <ToastPrimitive.Title>{toast.message}</ToastPrimitive.Title>
            <div className="grow" />
            <ToastPrimitive.Close className={styles.closeBtn}>
              X
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

// Global toast function for backwards compatibility
let globalShowToast: ((params: { message: string }) => void) | null = null;

function setGlobalToast(fn: (params: { message: string }) => void) {
  globalShowToast = fn;
}

export function showToast(params: { message: string }) {
  if (globalShowToast) {
    globalShowToast(params);
  } else {
    console.warn("Toast provider not initialized. Wrap app in ToastsProvider.");
  }
}
