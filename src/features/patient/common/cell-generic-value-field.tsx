import { SupportedData } from "../../../utils/data-utils";
import { GenericValueField } from "./generic-value-field";

export function CellGenericValueField<T extends object>({
  model,
  attr,
  variableDef,
}: {
  model: T;
  attr: keyof T;
  variableDef: SupportedData;
}) {
  return (
    <GenericValueField attr={attr} model={model} variableDef={variableDef} />
  );
}
