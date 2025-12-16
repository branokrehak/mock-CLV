import { DateField } from "../../fields/date-field";

export function CellDateField<T extends object>({
  model,
  attr,
  type,
  required,
}: {
  model: T;
  attr: keyof T;
  type: "datetime-local" | "date";
  required?: boolean;
}) {
  return (
    <DateField attr={attr} model={model} type={type} required={required} />
  );
}
