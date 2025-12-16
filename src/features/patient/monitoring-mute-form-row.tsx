import { reactive } from "@vue/reactivity";
import { useState } from "react";
import { Level3ClinicalPatientResponse } from "../../api";
import { Button } from "../../components/ui-kit/button";
import { Dialog } from "../../components/ui-kit/dialog";
import { DateField } from "../../components/ui-kit/fields/date-field";
import { Form } from "../../components/ui-kit/form/form";
import { FormModel } from "../../components/ui-kit/form/form-model";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { reacter } from "../../utils/react";
import { dateTimeOrNull, dateToISOString } from "../../utils/utils";
import { Patient } from "./patient";

export const MonitoringMuteFormRow = reacter(
  function MonitoringMuteFormRow(props: { patient: Patient; form: FormModel }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
      <>
        <FormRow
          label="Monitoring mute"
          data={
            <div className="flex items-center gap-2">
              <div>{mutingString(props.patient.data)}</div>

              {props.patient.data.monitoring_muted && (
                <Button
                  variant="subtle"
                  onClick={() =>
                    props.patient.updatePatientField(
                      {
                        monitoring_muted: false,
                        monitoring_mute_start_date: null,
                        monitoring_mute_end_date: null,
                      },
                      false,
                    )
                  }
                >
                  Unmute
                </Button>
              )}

              {!props.patient.data.monitoring_muted &&
                !props.patient.data.monitoring_mute_start_date && (
                  <Button
                    variant="subtle"
                    onClick={() =>
                      props.patient.updatePatientField(
                        {
                          monitoring_muted: true,
                          monitoring_mute_start_date: null,
                          monitoring_mute_end_date: null,
                        },
                        false,
                      )
                    }
                  >
                    Mute
                  </Button>
                )}

              {!props.patient.data.monitoring_muted &&
                !props.patient.data.monitoring_mute_start_date && (
                  <Button
                    variant="subtle"
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    Schedule mute
                  </Button>
                )}

              {!props.patient.data.monitoring_muted &&
                props.patient.data.monitoring_mute_start_date && (
                  <Button
                    variant="subtle"
                    onClick={() =>
                      props.patient.updatePatientField(
                        {
                          monitoring_mute_start_date: null,
                          monitoring_mute_end_date: null,
                        },
                        false,
                      )
                    }
                  >
                    Unschedule mute
                  </Button>
                )}
            </div>
          }
        />

        {dialogOpen && (
          <ScheduleMuteDialog
            patient={props.patient}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </>
    );
  },
);

const ScheduleMuteDialog = reacter(function ScheduleMuteDialog(props: {
  patient: Patient;
  onClose: () => void;
}) {
  const [body] = useState(() =>
    reactive({
      monitoring_muted: false,
      monitoring_mute_start_date: null as string | null,
      monitoring_mute_end_date: null as string | null,
    }),
  );

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
    >
      <Form
        onSubmit={async () => {
          if (body.monitoring_mute_start_date === dateToISOString(new Date())) {
            body.monitoring_muted = true;
            body.monitoring_mute_start_date = null;
          }
          await props.patient.updatePatientField(body, false);
          props.onClose();
        }}
      >
        <div>
          <DateField
            model={body}
            type="date"
            attr="monitoring_mute_start_date"
          />
          <DateField model={body} type="date" attr="monitoring_mute_end_date" />
        </div>

        <div className="mt-2 flex gap-2 justify-center">
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </div>
      </Form>
    </Dialog>
  );
});

function mutingString(data: Level3ClinicalPatientResponse) {
  if (data.monitoring_muted) {
    return data.monitoring_mute_end_date
      ? `muted until ${dateTimeOrNull(data.monitoring_mute_end_date, false)}`
      : "muted";
  } else if (data.monitoring_mute_start_date) {
    return data.monitoring_mute_end_date
      ? `mute scheduled from ${dateTimeOrNull(
          data.monitoring_mute_start_date,
          false,
        )} until ${dateTimeOrNull(data.monitoring_mute_end_date, false)}`
      : `mute scheduled from ${dateTimeOrNull(data.monitoring_mute_start_date, false)}`;
  } else {
    return "not muted";
  }
}
