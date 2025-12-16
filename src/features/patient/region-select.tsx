import { countriesRegistry } from "../../app/countries-registry";
import { SelectField } from "../../components/ui-kit/fields/select-field";

export function RegionSelect(props: {
  country?: string;
  model?: Record<string, any>;
  attr?: string;
  value?: number;
  onChange?: (newValue: number) => void;
  required?: boolean;
}) {
  return (
    <SelectField
      {...props}
      values={countriesRegistry.getRegionsEnum(props.country)}
    />
  );
}
