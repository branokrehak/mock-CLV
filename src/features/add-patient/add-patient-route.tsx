import { useCallback, useEffect, useState } from "react";
import { Race, Sex, SupportedLanguages } from "../../api";
import { AppModel } from "../../app/app-model";
import { Page } from "../../app/layout/page";
import { Button } from "../../components/ui-kit/button";
import { ChooseField } from "../../components/ui-kit/fields/choose-field";
import { DateField } from "../../components/ui-kit/fields/date-field";
import { RadioField } from "../../components/ui-kit/fields/radio-field";
import { SelectField } from "../../components/ui-kit/fields/select-field";
import { SwitchField } from "../../components/ui-kit/fields/switch-field";
import { TextField } from "../../components/ui-kit/fields/text-field";
import { Form } from "../../components/ui-kit/form/form";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";
import { Spinner } from "../../components/ui-kit/spinner";
import { deviceHandovers, tokenExpiries } from "../../constants/constants";
import { seerlinqStudies } from "../../constants/enum-to-text";
import { reacter } from "../../utils/react";
import { CountrySelect } from "../patient/country-select";
import { RegionSelect } from "../patient/region-select";
import { AddPatient } from "./add-patient";
import { PhysiciansModal } from "./common/physicians-modal";
import { UsersModal } from "./common/users-modal";

export const AddPatientRoute = reacter(function AddPatientRoute({
  app,
}: {
  app: AppModel;
}) {
  const [model, setModel] = useState<AddPatient | null>(null);

  useEffect(() => {
    const init = async () => {
      const m = await app.initAddPatient();
      setModel(m);
    };
    init();
  }, [app]);

  const MonitoringUsersModal = useCallback(
    ({ onClose }: { onClose: () => void }) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const usersModel = model!.createMonitoringUsers(
        model!.addingList.country,
      );
      return (
        <UsersModal
          title="Choose monitoring user(s) for a new patient"
          preselected={model!.addingList["monitoring_users"]}
          mode="multi"
          model={usersModel}
          onClose={onClose}
          onConfirm={({ selected }) => {
            model!.addingList["monitoring_users"] = selected;
          }}
        />
      );
    },
    [model],
  );

  const PhysiciansModalComponent = useCallback(
    ({ onClose }: { onClose: () => void }) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const physiciansModel = model!.createPhysicians();
      return (
        <PhysiciansModal
          title="Choose physicians for a new patient"
          preselected={model!.addingList["append_to_physicians"]}
          filter={{ country: [model!.addingList.country] }}
          mode="multi"
          model={physiciansModel}
          onClose={onClose}
          onConfirm={({ selected }) => {
            model!.addingList["append_to_physicians"] = selected;
          }}
        />
      );
    },
    [model],
  );

  const ManagingUsersModal = useCallback(
    ({ onClose }: { onClose: () => void }) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const usersModel = model!.createUsers();
      return (
        <UsersModal
          title="Choose managing users for a new patient"
          preselected={model!.addingList["append_to_managing_users"]}
          mode="multi"
          model={usersModel}
          onClose={onClose}
          onConfirm={({ selected }) => {
            model!.addingList["append_to_managing_users"] = selected;
          }}
        />
      );
    },
    [model],
  );

  if (!model) {
    return (
      <Page app={app}>
        <Spinner />
      </Page>
    );
  }

  return (
    <Page app={app}>
      <span style={{ color: "#bb16a3" }}>
        <strong>*</strong>
      </span>{" "}
      = mandatory
      <Form onSubmit={() => model.post()}>
        <InvisibleTable dataAdd>
          <FormRow
            label="Patient study"
            data={
              <SelectField
                value={model.addingList["patient_study"]?.[0]}
                onChange={(newValue) => {
                  model.addingList["patient_study"] = [newValue];
                }}
                values={seerlinqStudies}
                listTitle="Select study"
                required
              />
            }
            mandatory
          />

          <FormRow
            label="Date of Birth"
            data={
              <DateField
                type="date"
                attr="date_of_birth"
                model={model.addingList}
                required
              />
            }
            mandatory
          />

          <FormRow
            label="Sex"
            data={
              <RadioField
                attr="sex"
                model={model.addingList}
                values={Sex}
                required
              />
            }
            mandatory
          />

          <FormRow
            label="Race"
            data={
              <SelectField
                attr="race"
                model={model.addingList}
                values={Race}
                required
              />
            }
            mandatory
          />

          <FormRow
            label="Height [cm]"
            data={<TextField attr="height" model={model.addingList} />}
          />

          <FormRow
            label="Description"
            data={
              <TextField
                attr="description"
                model={model.addingList}
                multiline="autosize"
                width={300}
              />
            }
          />

          <FormRow
            label="Country"
            data={
              <CountrySelect attr="country" model={model.addingList} required />
            }
            mandatory
          />

          <FormRow
            label="Region"
            data={
              <RegionSelect
                attr="region"
                country={model.addingList.country}
                model={model.addingList}
                required
              />
            }
            mandatory
          />

          <FormRow
            label="Create user (for the app)"
            data={
              <SwitchField
                attr="createUser"
                model={model}
                truthy="Yes"
                falsy="No"
              />
            }
            mandatory
          />

          <FormRow
            label="Name"
            data={<TextField attr="name" model={model.addingList} required />}
            mandatory
          />

          <FormRow
            label="Email"
            data={<TextField attr="email" model={model.addingList} required />}
            mandatory
          />

          {model.createUser && (
            <FormRow
              label="Device handover (changes welcome email)"
              data={
                <RadioField
                  attr="welcome_email_type"
                  model={model.addingList}
                  values={deviceHandovers}
                  required
                />
              }
              mandatory
            />
          )}

          <FormRow
            label="Phone"
            data={<TextField attr="phone" model={model.addingList} />}
          />

          <FormRow
            label="Residence"
            data={<TextField attr="residence" model={model.addingList} />}
          />

          <FormRow
            label="Health insurance provider"
            data={
              <TextField
                attr="health_insurance"
                model={model.addingList}
                required
              />
            }
            mandatory
          />

          <FormRow
            label="ID number"
            data={<TextField attr="id_number" model={model.addingList} />}
          />

          {model.createUser && (
            <>
              <FormRow
                label="Preferred language"
                data={
                  <SelectField
                    attr="preferred_language"
                    model={model.dataUser}
                    values={SupportedLanguages}
                    required
                  />
                }
                mandatory
              />

              <FormRow
                label="Finish registration link expiration"
                data={
                  <SelectField
                    attr="token_expiry_timedelta"
                    model={model.dataUser}
                    values={tokenExpiries}
                    required
                  />
                }
                mandatory
              />
            </>
          )}

          <FormRow
            label="Assign monitoring user / owner"
            data={
              <ChooseField
                value={`${model.addingList["monitoring_users"]?.length ?? 0} chosen`}
                modal={MonitoringUsersModal}
              />
            }
            mandatory
          />

          {app.seerlinqApi.userLevel >= 3 && (
            <>
              <FormRow
                label="Assign physician(s) to patient"
                data={
                  <ChooseField
                    value={`${model.addingList["append_to_physicians"]?.length ?? 0} chosen`}
                    modal={PhysiciansModalComponent}
                  />
                }
              />

              <FormRow
                label="Assign user(s) to patient (changes users' visibility over this patient)"
                data={
                  <ChooseField
                    value={`${model.addingList["append_to_managing_users"]?.length ?? 0} chosen`}
                    modal={ManagingUsersModal}
                  />
                }
              />
            </>
          )}
        </InvisibleTable>

        <br />
        <br />

        <Button type="submit">Add patient</Button>
      </Form>
    </Page>
  );
});
