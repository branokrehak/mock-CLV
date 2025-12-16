import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { PatientBaseSchema } from "../../api";
import { ApiConnector } from "../../api/api-connector";
import { AppModel } from "../../app/app-model";
import { countriesRegistry } from "../../app/countries-registry";
import { Page } from "../../app/layout/page";
import { QuickLookPerLevel } from "../../components/quick-look/quick-look-button";
import { Spinner } from "../../components/ui-kit/spinner";
import { CellEnum } from "../../components/ui-kit/tables/cells/cell-enum";
import { DataTable } from "../../components/ui-kit/tables/data-table";
import { RegionFilterHeader } from "../../components/ui-kit/tables/headers/region-filter-header";
import {
  patientStates,
  patientStatuses,
  seerlinqStudies,
} from "../../constants/enum-to-text";
import { idFilter } from "../../models/data-model/simple-query-filter";
import { consentOk } from "../../utils/data-utils";
import { reacter } from "../../utils/react";

export const PatientsRoute = reacter(function PatientsRoute({
  api,
  app,
}: {
  api: ApiConnector;
  app: AppModel;
}) {
  const location = useLocation();

  useEffect(() => {
    app.getPatients();
  }, [app, location.pathname]);

  const model = useMemo(() => app.patients, [app.patients]);

  const initializing = useMemo(() => !model || !model.initialized, [model]);

  return (
    <Page app={app}>
      {initializing ? (
        <Spinner />
      ) : (
        <>
          <span>
            We have <strong>{model.data.length}</strong> patient(s) in the
            database.
          </span>

          <br />
          <br />

          <DataTable
            name="patients"
            model={model}
            columns={[
              {
                header1: "HeartCore ♥",
                cell: ({ item }) => (
                  <QuickLookPerLevel api={api} patientId={item.patient_id} />
                ),
              },
              {
                header1: "Patient HF study ID",
                attr: "patient_id",
                search: idFilter,
                cell: ({ item }) => {
                  const disabled =
                    !consentOk(item as PatientBaseSchema) && api.userLevel <= 2;

                  return (
                    <strong>
                      <Link
                        className={clsx(
                          "patient-link",
                          disabled && "disabled-link",
                        )}
                        to={!disabled ? `/patient/${item.patient_id}` : "#"}
                      >
                        {item.patient_id}
                      </Link>
                    </strong>
                  );
                },
              },
              { header1: "Name", attr: "name", search: true },
              {
                header1: "Risk flag",
                header3: "(Click to change)",
                attr: "patient_state",
                type: "enum",
                values: patientStates,
                editable: true,
                userLevel: 3,
                filter: true,
              },
              {
                header1: "Added",
                attr: "created_at",
                type: "datetime",
                sort: true,
              },
              {
                header1: "Country",
                attr: "country",
                type: "string",
                filter: true,
              },
              {
                header1: "Region",
                attr: "region",
                header2: <RegionFilterHeader model={model} />,
                editable: true,
                cell: (props) => (
                  <CellEnum
                    {...props}
                    values={countriesRegistry.getRegionsEnum(
                      props.item.country,
                    )}
                  />
                ),
              },
              {
                header1: "Seerlinq studies",
                attr: "patient_study",
                type: "enum",
                values: seerlinqStudies,
                filter: true,
              },
              {
                header1: "Status",
                attr: "patient_status",
                type: "enum",
                values: patientStatuses,
                filter: true,
              },
              {
                header1: "Clinical risk score",
                attr: "clinical_risk_score",
                filter: true,
              },
            ]}
            editMode="cell"
            onEdit={async (editedField, item) => {
              await model.updatePatient(item.patient_id, editedField);
            }}
          />
        </>
      )}
    </Page>
  );
});
