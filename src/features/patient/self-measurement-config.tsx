import { reactive } from "@vue/reactivity";
import { useEffect, useState } from "react";
import { MeasurementRequiredData_Input, StrictPPGConditions } from "../../api";
import { ApiConnector } from "../../api/api-connector";
import { Button } from "../../components/ui-kit/button";
import { Dialog } from "../../components/ui-kit/dialog";
import {
  ComboboxField,
  ComboboxOption,
} from "../../components/ui-kit/fields/combobox-field";
import { NumberField } from "../../components/ui-kit/fields/number-field";
import { SelectField } from "../../components/ui-kit/fields/select-field";
import { Form } from "../../components/ui-kit/form/form";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";
import { SimpleTable } from "../../components/ui-kit/tables/simple-table";
import { reacter } from "../../utils/react";
import { Patient } from "./patient";

export const SelfMeasurementConfig = reacter(
  function SelfMeasurementConfig(props: {
    config: any[];
    api: ApiConnector;
    patient: Patient;
  }) {
    const [configModel] = useState(() =>
      reactive({
        data: [],
      }),
    );
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [adding, setAdding] = useState(false);

    const startEdit = () => {
      configModel.data = (props.config ?? [])
        .slice()
        .sort((a, b) => a.order - b.order);
      setEditing(true);
    };

    const exitEdit = () => {
      setEditing(false);
    };

    return (
      <div>
        <div className="flex gap-2 items-center">
          <h3 style={{}}>Self-measurement config</h3>
          <button
            className="border-none text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>

        {expanded && (
          <>
            <SimpleTable
              rows={editing ? configModel.data : props.config}
              columns={[
                {
                  header1: "Order",
                  cell: (row, index) =>
                    editing ? (
                      <SelectField
                        value={index + 1}
                        values={Array.from(
                          { length: configModel.data.length },
                          (_, i) => i + 1,
                        )}
                        onChange={(newOrder) => {
                          const item = configModel.data.splice(index, 1)[0];
                          configModel.data.splice(newOrder - 1, 0, item);
                        }}
                      />
                    ) : (
                      index + 1
                    ),
                },
                {
                  header1: "Type",
                  cell: (row) => dataTypes[row.data_type],
                },
                {
                  header1: "Data name",
                  cell: (row) =>
                    "data_name" in row
                      ? row.data_name
                      : `${row.measurement_condition} (> ${row.minimum_length}s)`,
                },
                editing && {
                  header1: "",
                  cell: (row, index) => (
                    <Button
                      variant="subtle"
                      onClick={() => {
                        configModel.data.splice(index, 1);
                      }}
                    >
                      -
                    </Button>
                  ),
                },
              ]}
              foot={
                editing ? (
                  <tr>
                    <td colSpan={100}>
                      <Button
                        variant="subtle"
                        onClick={() => {
                          setAdding(true);
                        }}
                      >
                        Add
                      </Button>
                    </td>
                  </tr>
                ) : undefined
              }
            />

            {!editing && (
              <Button
                onClick={() => {
                  startEdit();
                }}
              >
                Edit
              </Button>
            )}

            {editing && (
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await props.patient.updatePatientField({
                      self_measurement_config: configModel.data.map(
                        (i, index) => ({
                          data_type: i.data_type,
                          order: index + 1,
                          data_name: i.data_name,
                          measurement_condition: i.measurement_condition,
                          minimum_length: i.minimum_length,
                          required_device: i.required_device,
                        }),
                      ),
                    });

                    exitEdit();
                  }}
                >
                  Confirm
                </Button>

                <Button
                  onClick={() => {
                    exitEdit();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}

        {adding && (
          <AddingDialog
            patient={props.patient}
            onConfirm={(data) => {
              setAdding(false);
              configModel.data.push({
                ...data,
                order: configModel.data.length + 1,
              });
            }}
            onClose={() => setAdding(false)}
          />
        )}
      </div>
    );
  },
);

interface NewItemBody {
  data_type?: keyof typeof dataTypes;
  data_name?: string;
  measurement_condition?: StrictPPGConditions;
  minimum_length?: number;
  required_device?: string;
}

const AddingDialog = reacter(function AddingDialog(props: {
  patient: Patient;
  onConfirm: (data: any) => void;
  onClose: () => void;
}) {
  const [data] = useState(() => reactive<NewItemBody>({}));

  useEffect(() => {
    // Reset data when dialog opens (component mounts)
    // Clear all properties from the reactive object
    if (data.data_type) delete data.data_type;
    if (data.data_name) delete data.data_name;
    if (data.measurement_condition) delete data.measurement_condition;
    if (data.minimum_length) delete data.minimum_length;
    if (data.required_device) delete data.required_device;

    props.patient.fetchSupportedMedicalData();
    props.patient.fetchSupportedSymptoms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onSubmit={() => {
          props.onConfirm(data as unknown as MeasurementRequiredData_Input);
        }}
        className="flex flex-col"
      >
        <InvisibleTable>
          <FormRow
            label="Type"
            data={
              <SelectField
                values={dataTypes}
                model={data}
                attr="data_type"
                listTitle="Select type"
                onChange={(newValue) => {
                  delete data.data_name;
                  delete data.measurement_condition;
                  delete data.minimum_length;
                  delete data.required_device;

                  if (newValue === "ppg") {
                    data.minimum_length = 120;
                    data.required_device = devices[0];
                  }
                }}
                required
              />
            }
          />

          {data.data_type === "medical-data" && (
            <FormRow
              label="Name"
              data={
                <ComboboxField
                  model={data}
                  attr="data_name"
                  options={props.patient.supportedMedData.map(
                    (d): ComboboxOption<string> => ({
                      value: d.data_name,
                      label: d.data_name,
                    }),
                  )}
                />
              }
            />
          )}

          {data.data_type === "symptom" && (
            <FormRow
              label="Name"
              data={
                <ComboboxField
                  model={data}
                  attr="data_name"
                  options={props.patient.supportedSymptoms.map(
                    (d): ComboboxOption<string> => ({
                      value: d.data_name,
                      label: d.data_name,
                    }),
                  )}
                />
              }
            />
          )}

          {data.data_type === "ppg" && (
            <>
              <FormRow
                label="Condition"
                data={
                  <SelectField
                    values={StrictPPGConditions}
                    model={data}
                    attr="measurement_condition"
                  />
                }
              />
              <FormRow
                label="Minimum length (s)"
                data={<NumberField model={data} attr="minimum_length" />}
              />

              <FormRow
                label="Required device"
                data={
                  <SelectField
                    model={data}
                    attr="required_device"
                    values={devices}
                  />
                }
              />
            </>
          )}
        </InvisibleTable>

        <div className="flex justify-center mt-4">
          <Button type="submit">Add</Button>
        </div>
      </Form>
    </Dialog>
  );
});

const dataTypes = {
  "medical-data": "medical data",
  symptom: "symptom",
  ppg: "PPG",
  // ecg: "ECG",
};

const devices = ["BerryMed BM1000B"];
