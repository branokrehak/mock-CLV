import { reactive } from "@vue/reactivity";
import { useMemo } from "react";
import { apiGetHfLabDataPatientId } from "../../../api";
import { AppModel } from "../../../app/app-model";
import { AButton } from "../../../components/ui-kit/a-button";
import { CellLastEdit } from "../../../components/ui-kit/tables/cells/cell-last-edit";
import { DataTable } from "../../../components/ui-kit/tables/data-table";
import { reacter } from "../../../utils/react";
import { useFetch } from "../../../utils/use-fetch";
import { MedData } from "../common/med-data";
import { MedicalPlot } from "../common/medical-plot";
import { PatientSubpage } from "../common/patient-subpage";

export const LabsTable = reacter(function LabsTable(props: { app: AppModel }) {
  const patient = props.app.patient;
  const api = props.app.seerlinqApi;

  const model = useMemo(
    () => reactive(new MedData([], api.userLevel, api.userUUID)),
    [api.userLevel, api.userUUID],
  );

  const { loading, refetch } = useFetch(
    async ({ isRefetch }) => {
      const response = await apiGetHfLabDataPatientId({
        path: { patient_id: patient.patientId },
        meta: { useSessionCache: !isRefetch },
      });
      model.updateData(response.data.medical_data);
      await patient.fetchSupportedMedicalData();
    },
    [patient.patientId],
  );

  return (
    <PatientSubpage title="Labs" loading={loading}>
      <AButton href="add">Add labs</AButton>

      <MedicalPlot
        dataModel={model}
        plotTypeOptions={[
          "NT-proBNP",
          "BNP",
          "urea",
          "creatinine",
          "hemoglobin",
          "hematocrit",
        ]}
      />

      <br />
      <br />
      <br />

      <DataTable
        name={`patient/${patient.patientId}/labs`}
        model={model}
        columns={[
          {
            header1: "Measured",
            attr: "measurement_datetime",
            type: "datetime",
            editable: true,
            sort: true,
            initSort: "desc",
          },
          {
            header1: "Type",
            attr: "measurement_type",
            type: "string",
            sort: true,
          },
          {
            header1: "Value",
            attr: "measurement_value",
            type: "number",
            precision: 1,
            editable: true,
          },
          {
            header1: "Unit",
            attr: "measurement_unit",
            type: "string",
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
        onEdit={async (editedField, item) => {
          await patient.updateItem("medicaldata", item.uuid, editedField);
          await refetch();
        }}
        onDelete={async (item) => {
          await patient.deleteItem("medicaldata", item.uuid);
          await refetch();
        }}
      />
    </PatientSubpage>
  );
});
