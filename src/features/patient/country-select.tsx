import { countriesRegistry } from "../../app/countries-registry";
import { ComboboxField } from "../../components/ui-kit/fields/combobox-field";

export function CountrySelect(props: {
  model?: Record<string, any>;
  attr?: string;
  regionAttr?: string;
  value?: string;
  onChange?: (newValue: string) => void;
  required?: boolean;
}) {
  return (
    <ComboboxField<string>
      options={countriesRegistry.countriesEnum.map((c) => ({
        label: c,
        value: c,
      }))}
      model={props.model}
      attr={props.attr}
      value={props.value}
      onChange={(newValue) => {
        if (props.regionAttr && props.model) {
          props.model[props.regionAttr] = 0; // Set the default catch-all region
        }
        props.onChange?.(newValue);
      }}
    />
  );
}
