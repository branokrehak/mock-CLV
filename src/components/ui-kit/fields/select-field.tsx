import { useMemo, useRef } from "react";
import { reacter } from "../../../utils/react";
import styles from "./select-field.module.css";
import { useField, valuesToMap } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

interface Props<T extends object, V extends string | number> {
  model?: T;
  attr?: keyof T;
  value?: V;
  values: Record<V, string> | V[];
  listTitle?: string;
  onChange?: (newValue: V) => void;
  required?: boolean;
  disabled?: boolean;
}

export const SelectField = reacter(function SelectField<
  T extends object,
  V extends string | number,
>({
  model,
  attr,
  value: propsValue,
  values,
  listTitle,
  onChange,
  required,
  disabled,
}: Props<T, V>) {
  const elementRef = useRef<HTMLSelectElement>(null);
  const { showErrors, tooltip } = useField(elementRef);

  // Get value from props or model - parent will re-render when model changes
  const value =
    propsValue !== undefined
      ? propsValue
      : model && attr
        ? (model[attr] as string)
        : undefined;

  const valuesMap = useMemo(() => valuesToMap(values), [values]);
  const isNumber = useMemo(
    () => typeof valuesMap.keys().next().value === "number",
    [valuesMap],
  );

  // Check if current value is empty or doesn't match any option
  const hasEmptyValue =
    value === undefined || value === null || value === ("" as any);
  const valueMatchesOption = valuesMap.has(value as V);
  const showPlaceholder = hasEmptyValue || !valueMatchesOption;

  return (
    <ValidationTooltip model={tooltip}>
      <select
        value={value ?? ""}
        onChange={(event) => {
          const newValue = (
            isNumber ? parseInt(event.target.value) : event.target.value
          ) as V;

          if (model && attr) {
            model[attr] = newValue as any;
          }

          onChange?.(newValue);
        }}
        required={required}
        ref={elementRef}
        className={`${styles.root} ${showErrors ? styles.showErrors : ""}`}
        disabled={disabled}
      >
        {showPlaceholder && (
          <option value="" disabled>
            {listTitle ?? "—"}
          </option>
        )}

        {[...valuesMap.entries()].map(([val, displayValue]) => (
          <option key={val} value={val}>
            {displayValue}
          </option>
        ))}
      </select>
    </ValidationTooltip>
  );
});
