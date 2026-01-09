import { MedicationDataCategory, SupportedMedicationData } from "../../../api";
import { ApiConnector } from "../../../api/api-connector";
import { DataAdd } from "../../../models/data-add";
import { Patient } from "../patient";

export class AddMedications extends DataAdd {
  supportedVariables: SupportedMedicationData[];

  constructor(api: ApiConnector, patient: Patient) {
    super(api, patient);
    this.initFields = [
      "medication_started",
      "medication_group",
      "medication_unit",
      "medication_dose",
    ];
    this.desc = "Patient medication data";
    this.bodyField = "medication_data";
    this.endpoint = "hf/data";
    this.defaultDateTimeName = "Now";
    this.defaultDateTimeFields = ["medication_started"];
    this.reloadToTab = "medications";
    this.requiredFields = [
      "medication_started",
      "medication_group",
      "medication_unit",
      "medication_dose",
    ];
  }

  async initEmpty() {
    this.defaultDateTime = new Date().toISOString();
    this.supportedVariables = this.patient.supportedMedicationData.filter(
      (data) => data.data_category === MedicationDataCategory.medications,
    );

    var empty = [];
    for (const variable of this.supportedVariables) {
      const temp = {
        medication_started: this.defaultDateTime,
        medication_group: variable.data_name,
        medication_unit: variable.primary_unit,
      };
      empty.push(temp);
    }
    this.addingList = empty;
  }
}
