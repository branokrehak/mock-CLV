import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { reacter } from "../../../utils/react";
import styles from "./number-field.module.css";
import { useField } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const NumberField = reacter(function NumberField<T extends object>({
  model,
  value: propsValue,
  onChange: propsOnChange,
  attr,
  width,
  required,
  disabled,
  autofocus,
  className,
  min,
  max,
  step,
}: {
  model?: T;
  value?: number;
  onChange?: (newValue: number) => void;
  attr?: keyof T;
  width?: number;
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const elementRef = useRef<HTMLInputElement>(null);
  const { showErrors, tooltip } = useField(elementRef);

  // Get value from props or model - parent will re-render when model changes
  const value =
    propsValue !== undefined
      ? propsValue
      : model && attr
        ? (model[attr] as number)
        : undefined;

  const [strValue, setStrValue] = useState(valueToStrValue(value));

  const onChange = (newStrValue: string) => {
    setStrValue(newStrValue);
    const newValue = parseStrValue(newStrValue);
    if (model && attr) {
      model[attr] = newValue as any;
    }
    if (newValue !== undefined) {
      propsOnChange?.(newValue);
    }
  };

  useEffect(() => {
    // Only sync from external value changes, not when the parsed local value matches
    const parsedLocal = parseStrValue(strValue);
    if (parsedLocal !== value) {
      setStrValue(valueToStrValue(value));
    }
  }, [value]);

  return (
    <ValidationTooltip model={tooltip}>
      <input
        type="number"
        value={strValue}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        style={{ width: width ? `${width}px` : undefined }}
        required={required}
        ref={elementRef}
        className={clsx(
          className,
          styles.root,
          showErrors && styles.showErrors,
        )}
        disabled={disabled}
        autoFocus={autofocus}
        step={step ?? "any"}
        min={min}
        max={max}
      />
    </ValidationTooltip>
  );
});

function parseStrValue(strValue: string) {
  const num = parseFloat(strValue);
  return isNaN(num) ? undefined : num;
}

function valueToStrValue(value: number | undefined) {
  return value != null ? String(value) : "";
}
