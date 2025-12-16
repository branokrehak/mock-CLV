import React, { createContext, useContext, useState } from "react";

export interface FormState {
  pending: boolean;
}

const FormContext = createContext<FormState | undefined>(undefined);

export function useFormContext() {
  return useContext(FormContext);
}

export function Form({
  children,
  onSubmit,
  className,
}: {
  children?: React.ReactNode;
  onSubmit?: () => void | Promise<unknown>;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <FormContext.Provider value={{ pending }}>
      <form
        className={className}
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();

          if (pending) {
            return;
          }

          if (event.currentTarget.checkValidity()) {
            try {
              setPending(true);
              await onSubmit?.();
            } finally {
              setPending(false);
            }
          }
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
