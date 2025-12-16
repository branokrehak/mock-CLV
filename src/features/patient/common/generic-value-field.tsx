import { EnumDataSchema, FloatDataSchema, IntDataSchema } from "../../../api";
import { NumberField } from "../../../components/ui-kit/fields/number-field";
import { RadioField } from "../../../components/ui-kit/fields/radio-field";
import { SelectField } from "../../../components/ui-kit/fields/select-field";
import { SupportedData } from "../../../utils/data-utils";

export function GenericValueField<T extends object>({
  model,
  attr,
  variableDef,
  disabled,
  showUnit,
  required,
}: {
  model: T;
  attr: keyof T;
  variableDef: SupportedData;
  disabled?: boolean;
  showUnit?: boolean;
  required?: boolean;
}) {
  const renderField = () => {
    if (
      variableDef?.data_value.value_type === "enum" &&
      variableDef.data_value.values_enum.length <= 2
    ) {
      return (
        <RadioField
          model={model}
          attr={attr}
          values={(variableDef.data_value as EnumDataSchema).values_enum}
          required={required}
          disabled={disabled}
        />
      );
    }

    if (
      variableDef?.data_value.value_type === "enum" &&
      variableDef.data_value.values_enum.length > 2
    ) {
      return (
        <SelectField
          model={model}
          attr={attr}
          values={(variableDef.data_value as EnumDataSchema).values_enum}
          required={required}
          disabled={disabled}
        />
      );
    }

    if (
      variableDef?.data_value.value_type === "float" ||
      variableDef?.data_value.value_type === "integer"
    ) {
      const data_value = variableDef.data_value as
        | FloatDataSchema
        | IntDataSchema;

      return (
        <NumberField
          model={model}
          attr={attr}
          min={data_value.value_ge}
          max={data_value.value_le}
          step={data_value.value_multiple_of}
          required={required}
          disabled={disabled}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex items-center gap-2">
      {renderField()}

      {showUnit && "primary_unit" in variableDef
        ? variableDef.primary_unit
        : null}
    </div>
  );
}
