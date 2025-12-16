import clsx from "clsx";
import React, { useMemo, useState } from "react";
import styles from "./button.module.css";
import { useFormContext } from "./form/form";
import { Spinner } from "./spinner";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "subtle" | "large";
  pending?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<unknown>;
}

export function Button({
  variant,
  pending: propsPending,
  onClick,
  className,
  children,
  type = "button",
  disabled,
  ...props
}: Props) {
  const formContext = useFormContext();
  const [localPending, setLocalPending] = useState(false);

  const pending = useMemo(() => {
    if (propsPending || localPending) {
      return true;
    }

    if (type === "submit" && formContext?.pending) {
      return true;
    }

    return false;
  }, [propsPending, localPending, type, formContext?.pending]);

  return (
    <button
      {...props}
      type={type}
      className={clsx(
        styles.button,
        className,
        variant === "subtle" && styles.subtle,
      )}
      disabled={disabled || pending}
      onClick={(event) => {
        const returnValue = onClick?.(event);

        if (returnValue instanceof Promise) {
          setLocalPending(true);
          returnValue.finally(() => {
            setLocalPending(false);
          });
        }
      }}
    >
      <span className={pending ? "invisible" : ""}>{children}</span>

      {pending && (
        <span className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
          <Spinner size={variant === "large" ? 25 : 20} />
        </span>
      )}
    </button>
  );
}
