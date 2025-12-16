import { useEffect, useRef, useState } from "react";

export function useField(
  elementRef: React.RefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  >,
) {
  const [showErrors, setShowErrors] = useState(false);
  const [forceOpenTooltip, setForceOpenTooltip] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>();
  const hideTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleSubmit = () => {
      if (hideTooltipTimeoutRef.current) {
        clearTimeout(hideTooltipTimeoutRef.current);
      }

      setShowErrors(true);
      setForceOpenTooltip(true);
      checkValidationMessage();

      hideTooltipTimeoutRef.current = setTimeout(() => {
        setForceOpenTooltip(false);
      }, 3000);
    };

    const checkValidationMessage = () => {
      // This `setTimeout` is ugly, but necessary, because we're using native listeners, yet we change React state based on that.
      // Without the timeout it interferes with typing.
      setTimeout(() => {
        setValidationMessage(element.validationMessage);
      });
    };

    const form = element.form;
    form?.addEventListener("submit", handleSubmit);
    element.addEventListener("input", checkValidationMessage);
    element.addEventListener("blur", checkValidationMessage);

    return () => {
      form?.removeEventListener("submit", handleSubmit);
      element.removeEventListener("input", checkValidationMessage);
      element.removeEventListener("blur", checkValidationMessage);
    };
  }, [elementRef.current]);

  return {
    showErrors,
    tooltip: {
      forceOpen: forceOpenTooltip,
      message: validationMessage,
    },
  };
}

export interface TooltipModel {
  forceOpen: boolean;
  message?: string;
}

export function valuesToMap<T extends string | number>(
  values: T[] | Record<string, string>,
) {
  const res = new Map<T, string>();

  if (Array.isArray(values)) {
    for (const item of values) {
      res.set(item, String(item));
    }
  } else {
    const allKeysAreNumbers = Object.keys(values).every(
      (v) => !isNaN(v as any),
    );

    for (const key of Object.keys(values)) {
      res.set((allKeysAreNumbers ? parseInt(key) : key) as T, values[key]);
    }
  }

  return res;
}
