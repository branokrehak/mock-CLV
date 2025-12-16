import { reacter } from "../../../../utils/react";
import { SelectField } from "../../fields/select-field";

export const CellSelectField = reacter(function CellSelectField<
  T extends object,
  V extends string | number,
>({
  model,
  attr,
  values,
  listTitle,
  onChange,
  disabled,
  required,
}: {
  model: T;
  attr: keyof T;
  values: Record<V, string> | V[];
  listTitle?: string;
  onChange?: (newValue: V) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  if (disabled) {
    return <>{model[attr]}</>;
  }

  return (
    <SelectField
      attr={attr}
      model={model}
      values={values}
      listTitle={listTitle}
      onChange={onChange}
      required={required}
    />
  );
});
