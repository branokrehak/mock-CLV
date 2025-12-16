import { useMemo, useRef } from "react";
import { reacter } from "../../../utils/react";
import { parseDatetimeToLocal } from "../../../utils/utils";
import styles from "./date-field.module.css";
import { useField } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const DateField = reacter(function DateField<T extends object>({
  model,
  attr,
  type,
  value: propsValue,
  onChange,
  required,
  disabled,
}: {
  model?: T;
  attr?: keyof T;
  type: "datetime-local" | "date";
  value?: string;
  onChange?: (newValue: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  const elementRef = useRef<HTMLInputElement>(null);
  const { showErrors, tooltip } = useField(elementRef);

  // Get value from props or model - parent will re-render when model changes
  const value =
    propsValue !== undefined
      ? propsValue
      : model && attr
        ? (model[attr] as string)
        : undefined;

  const displayValue = useMemo(() => {
    if (value && !isLocal(value)) {
      return parseDatetimeToLocal(value);
    }
    return value ?? "";
  }, [value]);

  return (
    <ValidationTooltip model={tooltip}>
      <input
        type={type}
        step="1"
        value={displayValue}
        onChange={(event) => {
          const newValue =
            type === "datetime-local" && !!event.target.value
              ? new Date(event.target.value).toISOString()
              : event.target.value;

          if (model && attr) {
            model[attr] = newValue as any;
          }

          onChange?.(newValue);
        }}
        required={required}
        className={`${styles.root} ${showErrors ? styles.showErrors : ""}`}
        ref={elementRef}
        disabled={disabled}
      />
    </ValidationTooltip>
  );
});

function isLocal(str: Date | string) {
  return typeof str === "string" && str.length > 0 && !str.includes("Z");
}
