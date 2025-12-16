import { useEffect, useMemo, useRef } from "react";
import { reacter } from "../../../utils/react";
import { uniques } from "../../../utils/utils";
import styles from "./checkboxes-field.module.css";
import { useField, valuesToMap } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const CheckboxesField = reacter(function CheckboxesField<
  T extends string | number,
>({
  attr,
  model,
  values,
  min,
  max,
}: {
  attr: string;
  model: Record<string, any>;
  values: T[] | Record<string, string>;
  min?: number;
  max?: number;
}) {
  const elementsRef = useRef<HTMLInputElement[]>([]);
  const element0Ref = useRef<HTMLInputElement>(null);

  const { showErrors, tooltip } = useField(element0Ref);

  const currentValue = model[attr] ?? [];

  const valuesMap = useMemo(() => valuesToMap(values), [values]);

  const setValidity = (message: string) => {
    for (const element of elementsRef.current) {
      element?.setCustomValidity(message);
    }
  };

  const validate = () => {
    if (min != null && currentValue.length < min) {
      setValidity(`Check at least ${min} options`);
    } else if (max != null && currentValue.length > max) {
      setValidity(`Check at most ${max} options`);
    } else {
      setValidity("");
    }
  };

  useEffect(() => {
    validate();
  }, [currentValue, min, max]);

  return (
    <ValidationTooltip model={tooltip}>
      {[...valuesMap.entries()].map(([value, displayValue], index) => {
        return (
          <label key={value}>
            <input
              type="checkbox"
              value={value}
              checked={currentValue.includes(value)}
              onChange={(event) => {
                if (event.target.checked) {
                  model[attr] = uniques([...currentValue, value]);
                } else if (model[attr]) {
                  const idx = model[attr].indexOf(value);
                  if (idx !== -1) {
                    model[attr].splice(idx, 1);
                  }
                }

                validate();
              }}
              className={`${styles.checkbox} ${showErrors ? styles.showErrors : ""}`}
              ref={(element) => {
                if (element) {
                  elementsRef.current[index] = element;
                  if (index === 0) {
                    (element0Ref as any).current = element;
                  }
                }
              }}
            />
            <span> {displayValue}</span>
          </label>
        );
      })}
    </ValidationTooltip>
  );
});
