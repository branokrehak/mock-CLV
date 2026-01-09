import { reactive } from "@vue/reactivity";
import { useMemo } from "react";
import { AppModel } from "../../../app/app-model";
import { AddTable } from "../../../components/ui-kit/tables/add-table";
import { CellDateField } from "../../../components/ui-kit/tables/cell-fields/cell-date-field";
import { CellTextField } from "../../../components/ui-kit/tables/cell-fields/cell-text-field";
import { CellRemoveButton } from "../../../components/ui-kit/tables/cells/cell-remove-button";
import { reacter } from "../../../utils/react";
import { AddMedications } from "./add-medications";
import { CellSelectField } from "../../../components/ui-kit/tables/cell-fields/cell-select-field";
import { 
  getNamesValues, 
  getPrimaryUnitByName,
} from "../../../utils/data-utils";
import { CellValueField } from "../../../components/ui-kit/tables/cell-fields/cell-value-field";
import { CellUnitField } from "../../../components/ui-kit/tables/cell-fields/cell-unit-field";

export const AddMedicationsTable = reacter(function AddMedicalTable(props: {
  app: AppModel;
  variant: "medications";
}) {
  const patient = props.app.patient;
  const model = useMemo(() => {
    const m = reactive(new AddMedications(patient.api, patient));
    m.initEmpty();
    return m;
  }, [patient]);

  return (
    <AddTable
      model={model}
      setAllDates="datetime"
      columns={[
        {
          header: "Medications started at",
          mandatory: true,
          cell: (item) => (
            <CellDateField
              model={item}
              attr="medication_started"
              type="datetime-local"
            />
          ),
        },
        {
          header: "Medications ended at",
          cell: (item) => (
            <CellDateField
              model={item}
              attr="medication_ended"
              type="datetime-local"
            />
          ),
        },
        {
          header: "Group",
          mandatory: true,
          cell: (item) => (
            <CellSelectField
              model={item}
              attr="medication_group"
              values={getNamesValues(model.supportedVariables)}
              onChange={(newValue) => {
                item.medication_unit = getPrimaryUnitByName(
                  model.supportedVariables,
                  newValue,
                );
              }}
            />
          ),
        },
        {
          header: "Name",
          mandatory: true,
          cell: (item) => (
            <CellTextField
              model={item}
              attr="medication_name"
            />
          ),
        },
        {
          header: "Dose",
          mandatory: true,
          cell: (item) => (
            <CellValueField
              attr="medication_dose"
              trigger={item.medication_group}
              item={item}
              supportedVariables={model.supportedVariables}
            />
          ),
        },
        {
          header: "Unit",
          cell: (item) => (
            <CellUnitField
              attr="medication_unit"
              trigger={item.medication_group}
              item={item}
              supportedVariables={model.supportedVariables}
            />
          ),
        },
        {
          header: "Comment",
          cell: (item) => (
            <CellTextField
              model={item}
              attr="comment"
              multiline="autosize"
            />
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
