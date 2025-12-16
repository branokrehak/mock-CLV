import autosize from "autosize";
import React, { useEffect, useRef } from "react";
import { reacter } from "../../../utils/react";
import styles from "./text-field.module.css";
import { useField } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const TextField = reacter(function TextField<T extends object>({
  model,
  type = "text",
  value: propsValue,
  onChange: propsOnChange,
  attr,
  width,
  multiline,
  required,
  disabled,
  autofocus,
  placeholder,
  className,
}: {
  model?: T;
  type?: "text" | "password" | "number";
  value?: string;
  onChange?: (newValue: string) => void;
  attr?: keyof T;
  width?: number;
  multiline?: boolean | "autosize";
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const elementRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { showErrors, tooltip } = useField(elementRef);

  // Get value from props or model - parent will re-render when model changes
  const value =
    (propsValue !== undefined
      ? propsValue
      : model && attr
        ? (model[attr] as string)
        : undefined) ?? "";

  const onChange = (newValue: string) => {
    if (model && attr) {
      model[attr] = newValue as any;
    }
    propsOnChange?.(newValue);
  };

  useEffect(() => {
    if (multiline === "autosize" && elementRef.current) {
      autosize(elementRef.current);
      return () => {
        if (elementRef.current) {
          autosize.destroy(elementRef.current);
        }
      };
    }
  }, [multiline]);

  useEffect(() => {
    if (multiline === "autosize" && elementRef.current) {
      autosize.update(elementRef.current);
    }
  }, [value, multiline]);

  return (
    <ValidationTooltip model={tooltip}>
      {!multiline ? (
        <input
          type={type}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          style={{ width: width ? `${width}px` : undefined }}
          required={required}
          ref={elementRef as React.RefObject<HTMLInputElement>}
          className={`${styles.root} ${showErrors ? styles.showErrors : ""} ${className || ""}`}
          disabled={disabled}
          autoFocus={autofocus}
          placeholder={placeholder}
        />
      ) : (
        <textarea
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          style={{ width: width ? `${width}px` : undefined }}
          required={required}
          ref={elementRef as React.RefObject<HTMLTextAreaElement>}
          className={`${styles.root} ${styles.textarea} ${
            showErrors ? styles.showErrors : ""
          } ${multiline === "autosize" ? "autosize" : ""} ${className || ""}`}
          rows={multiline === "autosize" ? 1 : undefined}
          disabled={disabled}
          autoFocus={autofocus}
          placeholder={placeholder}
        />
      )}
    </ValidationTooltip>
  );
});
