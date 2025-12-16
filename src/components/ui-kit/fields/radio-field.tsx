import { useId, useMemo, useRef } from "react";
import { reacter } from "../../../utils/react";
import styles from "./radio-field.module.css";
import { useField, valuesToMap } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const RadioField = reacter(function RadioField<
  T extends object,
  V extends string | number,
>({
  attr,
  model,
  value: propsValue,
  onChange,
  values,
  required,
  reverse,
  disabled,
}: {
  attr?: keyof T;
  model?: T;
  value?: string;
  onChange?: (newValue: V) => void;
  values: V[] | Record<string, string>;
  required?: boolean;
  reverse?: boolean;
  disabled?: boolean;
}) {
  const elementRef = useRef<HTMLInputElement>(null);
  const { showErrors, tooltip } = useField(elementRef);
  const name = useId();

  // Get value from props or model - parent will re-render when model changes
  const currentValue =
    propsValue !== undefined
      ? propsValue
      : model && attr
        ? model[attr]
        : undefined;

  const valuesMap = useMemo(() => valuesToMap(values), [values]);

  return (
    <ValidationTooltip model={tooltip}>
      <div className="flex gap-2">
        {[...valuesMap.entries()].map(([value, displayValue], index) => (
          <label key={value} className="flex items-center gap-1">
            {!reverse && <span>{displayValue}: </span>}
            <input
              type="radio"
              value={value}
              checked={currentValue === value}
              onChange={(event) => {
                if (!event.target.checked) {
                  return;
                }

                if (model && attr) {
                  model[attr] = value as any;
                }

                onChange?.(value as V);
              }}
              className={`${styles.radio} ${showErrors ? styles.showErrors : ""}`}
              ref={index === 0 ? elementRef : undefined}
              name={name}
              required={required}
              disabled={disabled}
            />
            {reverse && <span> {displayValue}</span>}
          </label>
        ))}
      </div>
    </ValidationTooltip>
  );
});
