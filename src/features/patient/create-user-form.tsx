import { reactive } from "@vue/reactivity";
import { useState } from "react";
import {
  CreateUserForExistingPatientSchema,
  SeerlinqStudy,
  SupportedLanguages,
} from "../../api";
import { Button } from "../../components/ui-kit/button";
import { RadioField } from "../../components/ui-kit/fields/radio-field";
import { SelectField } from "../../components/ui-kit/fields/select-field";
import { TextField } from "../../components/ui-kit/fields/text-field";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";
import { deviceHandovers, tokenExpiries } from "../../constants/constants";
import { seerlinqStudies } from "../../constants/enum-to-text";
import { reacter } from "../../utils/react";
import { Patient } from "./patient";

export const CreateUserForm = reacter(function CreateUserForm(props: {
  patient: Patient;
}) {
  const [data] = useState(() =>
    reactive<CreateUserForExistingPatientSchema>({
      token_expiry_timedelta: "P1D",
      preferred_language: SupportedLanguages.sk,
      new_patient_study: [SeerlinqStudy.commercial],
      email: "",
      welcome_email_type: undefined,
    }),
  );

  return (
    <div>
      <InvisibleTable>
        <FormRow
          label="Email (also used as username)"
          data={<TextField attr="email" model={data} />}
        />

        <FormRow
          label="Device handover (changes welcome email)"
          data={
            <RadioField
              attr="welcome_email_type"
              model={data}
              values={deviceHandovers}
            />
          }
        />

        <FormRow
          label="Patient study"
          data={
            <SelectField
              value={data["new_patient_study"][0]}
              onChange={(newValue) => {
                data["new_patient_study"] = [newValue];
              }}
              values={seerlinqStudies}
            />
          }
        />

        <FormRow
          label="Preferred language"
          data={
            <SelectField
              attr="preferred_language"
              model={data}
              values={SupportedLanguages}
            />
          }
        />

        <FormRow
          label="Finish registration link expiration"
          data={
            <SelectField
              attr="token_expiry_timedelta"
              model={data}
              values={tokenExpiries}
            />
          }
        />
      </InvisibleTable>

      <br />

      <Button
        onClick={() => {
          props.patient.createConnectedUser(data);
        }}
      >
        Create user
      </Button>
    </div>
  );
});
