import { useRef, useState } from "react";
import { reacter } from "../../../utils/react";
import styles from "./password-field.module.css";
import textFieldStyles from "./text-field.module.css";
import { useField } from "./utils";
import { ValidationTooltip } from "./validation-tooltip";

export const PasswordField = reacter(function PasswordField<T extends object>({
  model,
  value: propsValue,
  onChange: propsOnChange,
  attr,
  width,
  required,
  disabled,
  autofocus,
}: {
  model?: T;
  value?: string;
  onChange?: (newValue: string) => void;
  attr?: keyof T;
  width?: number;
  required?: boolean;
  disabled?: boolean;
  autofocus?: boolean;
}) {
  const elementRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <ValidationTooltip model={tooltip} className={styles.container}>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        style={{ width: width ? `${width}px` : undefined }}
        required={required}
        ref={elementRef}
        className={`${textFieldStyles.root} ${showErrors ? textFieldStyles.showErrors : ""} ${styles.inputWithCheckbox}`}
        disabled={disabled}
        autoFocus={autofocus}
      />
      <label className={styles.showLabel}>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        <span>Show</span>
      </label>
    </ValidationTooltip>
  );
});
