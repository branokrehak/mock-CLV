import { 
  getVariableByName, 
  SupportedData,
} from "../../../../utils/data-utils";
import { reacter } from "../../../../utils/react";
import { CellGenericValueField } from "../../../../features/patient/common/cell-generic-value-field";

export const CellValueField = reacter(function ValueCell({
  item,
  supportedVariables,
  trigger,
  attr,
}: {
  attr: string;
  trigger: string;
  item: any;
  supportedVariables: SupportedData[];
}) {
  const variableDef = getVariableByName(
    supportedVariables,
    trigger,
  );

  return (
    <CellGenericValueField
      model={item}
      attr={attr}
      variableDef={variableDef}
    />
  );
});
