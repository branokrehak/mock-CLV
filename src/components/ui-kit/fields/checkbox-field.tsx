import { reacter } from "../../../utils/react";

export const CheckboxField = reacter(function CheckboxField<T extends object>({
  model,
  attr,
  disabled,
}: {
  model?: T;
  attr?: keyof T;
  disabled?: boolean;
}) {
  return (
    <input
      type="checkbox"
      checked={model[attr] as boolean}
      onChange={(event) => {
        model[attr] = event.target.checked as any;
      }}
      disabled={disabled}
    />
  );
});
