import { useMemo, useState } from "react";
import { Race, SeerlinqStudy, Sex } from "../../api";
import { ApiConnector } from "../../api/api-connector";
import { AppModel } from "../../app/app-model";
import { countriesRegistry } from "../../app/countries-registry";
import { QuickLookButton } from "../../components/quick-look/quick-look-button";
import { Button } from "../../components/ui-kit/button";
import { ComboboxMultipleField } from "../../components/ui-kit/fields/combobox-multiple-field";
import { DateField } from "../../components/ui-kit/fields/date-field";
import { RadioField } from "../../components/ui-kit/fields/radio-field";
import { SelectField } from "../../components/ui-kit/fields/select-field";
import { TextField } from "../../components/ui-kit/fields/text-field";
import { valuesToMap } from "../../components/ui-kit/fields/utils";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { FormRowEditable } from "../../components/ui-kit/form/form-row-editable";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";
import {
  informedConsent,
  patientStatuses,
  seerlinqStudies,
} from "../../constants/enum-to-text";
import { physicianName } from "../../utils/physician";
import { reacter } from "../../utils/react";
import { floatRounding } from "../../utils/utils";
import { CountrySelect } from "./country-select";
import { CreateUserForm } from "./create-user-form";
import { MonitoringMuteFormRow } from "./monitoring-mute-form-row";
import { Patient } from "./patient";
import { RegionSelect } from "./region-select";
import { ScheduleFormRow } from "./schedule-form-row";
import { SelfMeasurementConfig } from "./self-measurement-config";

export const PatientDetails = reacter(function PatientDetails(props: {
  patient: Patient;
  app: AppModel;
  api: ApiConnector;
}) {
  const patient = useMemo(() => props.patient, [props.patient]);
  const data = useMemo(() => patient?.data, [patient?.data]);
  const form = useMemo(() => patient?.detailsForm, [patient?.detailsForm]);
  const updateField = (editedField: Record<string, any>) => {
    patient.updatePatientField(editedField);
  };
  const [openPatSettings, setOpenPatSettings] = useState(false);
  const [addingConnUser, setAddingConnUser] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <div>
      <InvisibleTable big>
        <FormRow label="Name" data={data.name} />

        <FormRowEditable
          form={form}
          attr="country"
          label="Country"
          model={data}
          viewMode={data.country}
          editMode={() => (
            <CountrySelect
              attr="country"
              regionAttr="region"
              model={form.editedField}
            />
          )}
          onChange={updateField}
        />

        <FormRowEditable
          form={form}
          attr="region"
          label="Region"
          model={data}
          viewMode={
            countriesRegistry.getRegionSchema(data.country, data.region)
              ?.region_name
          }
          editMode={() => (
            <RegionSelect
              attr="region"
              model={form.editedField}
              country={data.country}
            />
          )}
          onChange={updateField}
        />
        <FormRowEditable
          form={form}
          attr="date_of_birth"
          label="Date of birth"
          model={data}
          viewMode={new Date(data.date_of_birth).toLocaleDateString("sk-SK")}
          editMode={() => (
            <DateField
              attr="date_of_birth"
              model={form.editedField}
              type="date"
            />
          )}
          onChange={updateField}
        />

        <FormRowEditable
          form={form}
          attr="sex"
          label="Sex"
          model={data}
          viewMode={data.sex}
          editMode={() => (
            <RadioField attr="sex" model={form.editedField} values={Sex} />
          )}
          onChange={updateField}
        />

        <FormRowEditable
          form={form}
          attr="race"
          label="Race"
          model={data}
          viewMode={data.race}
          editMode={() => (
            <SelectField attr="race" model={form.editedField} values={Race} />
          )}
          onChange={updateField}
        />

        <FormRowEditable
          form={form}
          attr="height"
          label="Height [cm]"
          model={data}
          viewMode={floatRounding(data.height, 1)}
          editMode={() => (
            <TextField attr="height" model={form.editedField} width={40} />
          )}
          onChange={updateField}
        />

        <FormRow
          label="Clinical risk score"
          data={data.clinical_risk_score}
        ></FormRow>

        <FormRowEditable
          form={form}
          attr="description"
          label="Description"
          model={data}
          viewMode={
            <div className="max-h-[200px] overflow-y-auto">
              {data.description}
            </div>
          }
          editMode={() => (
            <TextField
              attr="description"
              model={form.editedField}
              multiline="autosize"
              width={200}
            />
          )}
          onChange={updateField}
        />

        {props.api.userLevel >= 3 && (
          <FormRowEditable
            form={form}
            attr="medical_monitoring_note"
            label="Medical note"
            model={data}
            viewMode={
              <div className="max-h-[200px] overflow-y-auto">
                {data.medical_monitoring_note}
              </div>
            }
            editMode={() => (
              <TextField
                attr="medical_monitoring_note"
                model={form.editedField}
                multiline="autosize"
                width={200}
              />
            )}
            onChange={updateField}
          />
        )}

        {props.api.userLevel >= 3 && (
          <FormRowEditable
            form={form}
            attr="technical_monitoring_note"
            label="Technical note"
            model={data}
            viewMode={
              <div className="max-h-[200px] overflow-y-auto">
                {data.technical_monitoring_note}
              </div>
            }
            editMode={() => (
              <TextField
                attr="technical_monitoring_note"
                model={form.editedField}
                multiline="autosize"
                width={200}
              />
            )}
            onChange={updateField}
          />
        )}

        <ScheduleFormRow form={form} patient={patient} />
      </InvisibleTable>

      {props.api.userLevel >= 3 && (
        <>
          <Button
            onClick={() => {
              setOpenPatSettings(!openPatSettings);
            }}
          >
            Toggle patient monitoring settings
          </Button>

          {openPatSettings && (
            <>
              <InvisibleTable big>
                <FormRow
                  label="Added"
                  data={new Date(data.created_at).toLocaleString("sk-SK")}
                />

                <FormRow label="Added by" data={data.user.username} />

                <FormRow
                  label="Informed consent"
                  data={
                    <div
                      className={
                        patient.consentOk() ? "text-green" : "text-red"
                      }
                    >
                      {informedConsent[data.informed_consent]}
                    </div>
                  }
                />

                {patient.isPaperConsent() && (
                  <FormRow
                    label="Change consent"
                    data={
                      <>
                        {!patient.consentOk() && (
                          <Button
                            className="text-green"
                            onClick={() => {
                              props.api.approvePaperConsent(data.patient_id);
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        {patient.consentOk() && (
                          <Button
                            className="text-red"
                            onClick={() => {
                              props.api.revokePaperConsent(data.patient_id);
                            }}
                          >
                            Revoke
                          </Button>
                        )}
                      </>
                    }
                  />
                )}

                {!patient.isPaperConsent() && props.api.userLevel === 4 && (
                  <FormRow
                    label="Change consent"
                    data={
                      <>
                        {!patient.consentOk() && (
                          <Button
                            className="text-green"
                            onClick={() => {
                              props.api.approveTeleConsent(data.patient_id);
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        {patient.consentOk() && (
                          <Button
                            className="text-red"
                            onClick={() => {
                              props.api.revokeTeleConsent(data.patient_id);
                            }}
                          >
                            Revoke
                          </Button>
                        )}
                      </>
                    }
                  />
                )}

                <FormRowEditable
                  form={form}
                  attr="patient_study"
                  label="Seerlinq studies"
                  model={data}
                  viewMode={data.patient_study
                    .map((st) => seerlinqStudies[st])
                    .join("; ")}
                  editMode={() => (
                    <ComboboxMultipleField
                      attr="patient_study"
                      model={form.editedField}
                      options={Array.from(
                        valuesToMap(seerlinqStudies).entries(),
                      ).map(([value, label]) => ({
                        value: value as SeerlinqStudy,
                        label,
                      }))}
                    />
                  )}
                  onChange={updateField}
                />

                <FormRowEditable
                  form={form}
                  attr="patient_status"
                  label="Patient status"
                  model={data}
                  viewMode={patientStatuses[data.patient_status]}
                  editMode={() => (
                    <SelectField
                      attr="patient_status"
                      model={form.editedField}
                      values={patientStatuses}
                    />
                  )}
                  onChange={updateField}
                />

                <FormRow
                  label="Connected to users"
                  data={data.connected_users
                    .map((user) => user.username)
                    .join("; ")}
                />

                <FormRow
                  label="Is managed by physicians"
                  data={data.physicians.map(physicianName).join("; ")}
                />

                <FormRow
                  label="Is managed by users"
                  data={data.managing_users
                    .map((user) => user.username)
                    .join("; ")}
                />

                <FormRow
                  label="Last measured PPG"
                  data={patient.heartCore.last_ppg}
                />

                <FormRow label="Patient adherence" data="N/A" />
              </InvisibleTable>

              <Button
                onClick={() => {
                  setAddingConnUser(!addingConnUser);
                }}
              >
                Create user for this patient
              </Button>

              {addingConnUser && <CreateUserForm patient={patient} />}
            </>
          )}
        </>
      )}

      <div className="mt-5 mb-5">
        <SelfMeasurementConfig
          config={data.self_measurement_config}
          api={props.api}
          patient={props.patient}
        />
      </div>

      {props.api.userLevel >= 3 && (
        <div className="mt-5 mb-5">
          <h3 style={{ marginBottom: "-5px" }}>Alerts</h3>
          <div style={{ marginBottom: "10px" }}>
            Mark all alerts of certain kinds as seen.
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await patient.markMedicalAlertsSeen();
              }}
            >
              Mark all medical as seen
            </Button>
            <Button
              onClick={async () => {
                await patient.markTechAlertsSeen();
              }}
            >
              Mark all technical / compliance as seen
            </Button>
          </div>
          <div className="mt-3">
            <MonitoringMuteFormRow patient={patient} form={form} />
          </div>
        </div>
      )}

      <div className="mt-5 mb-5">
        <h3 style={{ marginBottom: "-5px" }}>Seerlinq HeartCore</h3>
        <div style={{ marginBottom: "10px" }}>
          Patient has <strong>{patient.numDRIDataPoints}</strong> measurements.
        </div>
        {props.api.userLevel >= 3 && (
          <div className="flex flex-col gap-5">
            <QuickLookButton
              label="DRI HeartCore"
              resultLabel="View HeartCore"
              model={patient.driHeartCore}
              disabled={!patient.consentOk()}
            />

            <div className="flex gap-5">
              <QuickLookButton
                label="HeartCore Report"
                resultLabel="View Report"
                model={patient.heartCoreReport}
                disabled={!patient.consentOk()}
              />

              <div className="flex items-center gap-2">
                <span>Plot range:</span>
                <SelectField
                  attr="hcReportPlot"
                  model={patient}
                  values={[3, 6, 9, 12]}
                  onChange={() => patient.initHeartCore()}
                />
              </div>

              <div className="flex items-center gap-2">
                <span>Table range:</span>
                <SelectField
                  attr="hcReportTable"
                  model={patient}
                  values={[3, 6, 9, 12]}
                  onChange={() => patient.initHeartCore()}
                />
              </div>
            </div>
          </div>
        )}

        {props.api.userLevel === 2 && (
          <>
            <QuickLookButton
              label="HeartCore Report"
              resultLabel="View Report"
              model={patient.heartCoreReport}
              disabled={!patient.consentOk()}
            />
            <span
              style={{ margin: "10px", fontSize: "0.9em", color: "#ff8a3b" }}
            >
              *First LVFP reading is available after 4 measurements without PPG
              quality errors.*
            </span>
          </>
        )}
      </div>
    </div>
  );
});
