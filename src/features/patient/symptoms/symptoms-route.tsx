import { reactive } from "@vue/reactivity";
import { useState } from "react";
import { apiGetHfSymptomsPatientId } from "../../../api";
import { AppModel } from "../../../app/app-model";
import { reacter } from "../../../utils/react";
import { useFetch } from "../../../utils/use-fetch";
import { PatientSubpage } from "../common/patient-subpage";
import { SymptomPlot } from "./symptom-plot";
import { Symptoms, SymptomsItem } from "./symptoms";
import { SymptomsTable } from "./symptoms-table";

export const SymptomsRoute = reacter(function SymptomsRoute(props: {
  app: AppModel;
}) {
  const patient = props.app.patient;
  const api = props.app.seerlinqApi;
  const [model] = useState(() =>
    reactive(new Symptoms([], api.userLevel, api.userUUID)),
  );

  const [data, setData] = useState<SymptomsItem[]>([]);

  const { loading, refetch } = useFetch(
    async ({ isRefetch }) => {
      const response = await apiGetHfSymptomsPatientId({
        path: { patient_id: patient.patientId },
        meta: { useSessionCache: !isRefetch },
      });
      model.updateData(response.data.symptoms);
      await patient.fetchSupportedSymptoms();
      setData(response.data.symptoms);
    },
    [patient.patientId],
  );

  return (
    <PatientSubpage title="Symptoms" loading={loading}>
      <SymptomPlot
        dataModel={model}
        plotTypeOptions={["shortness of breath", "fatigue score"]}
      />

      <br />
      <br />
      <br />

      <SymptomsTable
        api={api}
        data={data}
        onInvalidated={refetch}
        patient={patient}
      />
    </PatientSubpage>
  );
});
