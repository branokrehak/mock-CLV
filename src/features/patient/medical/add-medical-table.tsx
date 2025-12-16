import { reactive } from "@vue/reactivity";
import { useMemo } from "react";
import { SupportedMedicalData } from "../../../api";
import { AppModel } from "../../../app/app-model";
import { AddTable } from "../../../components/ui-kit/tables/add-table";
import { CellDateField } from "../../../components/ui-kit/tables/cell-fields/cell-date-field";
import { CellSelectField } from "../../../components/ui-kit/tables/cell-fields/cell-select-field";
import { CellTextField } from "../../../components/ui-kit/tables/cell-fields/cell-text-field";
import { CellRemoveButton } from "../../../components/ui-kit/tables/cells/cell-remove-button";
import {
  getNamesValues,
  getPrimaryUnitByName,
  getUnitsValuesByName,
  getVariableByName,
} from "../../../utils/data-utils";
import { reacter } from "../../../utils/react";
import { CellGenericValueField } from "../common/cell-generic-value-field";
import { AddLabs } from "../labs/add-labs";

export const AddMedicalTable = reacter(function AddMedicalTable(props: {
  app: AppModel;
  variant: "labs";
}) {
  const patient = props.app.patient;
  const model = useMemo(() => {
    const m = reactive(new AddLabs(patient.api, patient));
    m.initEmpty();
    return m;
  }, [patient]);

  return (
    <AddTable
      model={model}
      setAllDates="datetime"
      columns={[
        {
          header: "Measured at",
          mandatory: true,
          cell: (item) => (
            <CellDateField
              model={item}
              attr="measurement_datetime"
              type="datetime-local"
            />
          ),
        },
        {
          header: "Type",
          mandatory: true,
          cell: (item) => (
            <CellSelectField
              model={item}
              attr="measurement_type"
              values={getNamesValues(model.supportedVariables)}
              onChange={(newValue) => {
                item.measurement_unit = getPrimaryUnitByName(
                  model.supportedVariables,
                  newValue,
                );
              }}
            />
          ),
        },
        {
          header: "Value",
          mandatory: true,
          cell: (item) => (
            <ValueCell
              item={item}
              supportedVariables={model.supportedVariables}
            />
          ),
        },
        {
          header: "Unit",
          cell: (item) => (
            <UnitCell
              item={item}
              supportedVariables={model.supportedVariables}
            />
          ),
        },
        {
          header: "Comment",
          cell: (item) => (
            <CellTextField model={item} attr="comment" multiline="autosize" />
          ),
        },
        {
          header: "Remove data row",
          cell: (item, index) => (
            <CellRemoveButton index={index} model={model} />
          ),
        },
      ]}
    />
  );
});

const ValueCell = reacter(function ValueCell({
  item,
  supportedVariables,
}: {
  item: any;
  supportedVariables: SupportedMedicalData[];
}) {
  const variableDef = getVariableByName(
    supportedVariables,
    item.measurement_type,
  );

  return (
    <CellGenericValueField
      model={item}
      attr="measurement_value"
      variableDef={variableDef}
    />
  );
});

const UnitCell = reacter(function UnitCell({
  item,
  supportedVariables,
}: {
  item: any;
  supportedVariables: SupportedMedicalData[];
}) {
  const values = getUnitsValuesByName(
    supportedVariables,
    item.measurement_type,
  );
  const disabled = values.length <= 1;

  return (
    <CellSelectField
      model={item}
      attr="measurement_unit"
      values={values}
      disabled={disabled}
    />
  );
});
