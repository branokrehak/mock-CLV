import { reactive } from "@vue/reactivity";
import { useEffect, useState } from "react";
import { ApiConnector } from "../../../api/api-connector";
import { CellLastEdit } from "../../../components/ui-kit/tables/cells/cell-last-edit";
import { DataTable } from "../../../components/ui-kit/tables/data-table";
import { SelectionMode } from "../../../models/data-model";
import { reacter } from "../../../utils/react";
import { Patient } from "../patient";
import { Symptoms, SymptomsItem } from "./symptoms";

export const SymptomsTable = reacter(function SymptomsTable(props: {
  data: SymptomsItem[];
  patient: Patient;
  api: ApiConnector;
  onInvalidated?: () => void;
  disableEdit?: boolean;
  disableHistory?: boolean;
  disablePagination?: boolean;
  canSelect?: SelectionMode;
  onSelect?: (selected: string[]) => void;
  preselected?: string[];
}) {
  const [model] = useState(() => {
    const m = reactive(
      new Symptoms([], props.api.userLevel, props.api.userUUID),
    );
    if (props.disableHistory) {
      m.hasHistory = false;
    }
    return m;
  });

  useEffect(() => {
    model.updateData(props.data);
  }, [props.data]);

  return (
    <DataTable
      name={`patient/${props.patient.patientId}/symptoms`}
      model={model}
      columns={[
        {
          header1: "Symptom datetime",
          attr: "symptom_datetime",
          type: "datetime",
          editable: true,
          sort: true,
          initSort: "desc",
        },
        {
          header1: "Symptom",
          attr: "symptom_name",
          type: "string",
          sort: true,
        },
        {
          header1: "Value",
          attr: "symptom_value",
          type: "number",
          precision: 0,
          editable: true,
        },
        {
          header1: "Change in last 6 months",
          attr: "symptom_change_in_last_six_m",
          type: "boolean",
          editable: true,
        },
        {
          header1: "Change date",
          attr: "symptom_change_date",
          type: "date",
          editable: true,
        },
        {
          header1: "Value before",
          attr: "symptom_value_before",
          type: "number",
          precision: 0,
          editable: true,
        },
        {
          header1: "Comment",
          attr: "comment",
          type: "string",
          multiline: true,
          editable: true,
        },
        model.showingHistory && {
          header1: "Added",
          attr: "created_at",
          type: "datetime",
        },
        model.showingHistory && {
          header1: "Last edit",
          cell: ({ item }) => <CellLastEdit item={item} />,
        },
      ]}
      onEdit={
        props.disableEdit
          ? undefined
          : async (editedField, item) => {
              await props.patient.updateItem(
                "symptoms",
                item.uuid,
                editedField,
              );
              props.onInvalidated?.();
            }
      }
      onDelete={
        props.disableEdit
          ? undefined
          : async (item) => {
              await props.patient.deleteItem("symptoms", item.uuid);
              props.onInvalidated?.();
            }
      }
      rowsPerPage={props.disablePagination ? Number.MAX_VALUE : 25}
      canSelect={props.canSelect}
      onSelect={props.onSelect}
      preselected={props.preselected}
    />
  );
});
