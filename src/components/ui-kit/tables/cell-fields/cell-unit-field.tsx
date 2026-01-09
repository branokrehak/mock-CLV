import { CellSelectField } from "./cell-select-field";
import { 
  getUnitsValuesByName, 
  SupportedData, 
} from "../../../../utils/data-utils";
import { reacter } from "../../../../utils/react";

export const CellUnitField = reacter(function UnitCell({
  attr,
  trigger,
  item,
  supportedVariables,
}: {
  attr: string;
  trigger: string;
  item: any;
  supportedVariables: SupportedData[];
}) {
  const values = getUnitsValuesByName(
    supportedVariables,
    trigger,
  );
  const disabled = values.length <= 1;

  return (
    <CellSelectField
      model={item}
      attr={attr}
      values={values}
      disabled={disabled}
    />
  );
});
