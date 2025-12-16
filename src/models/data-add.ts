import { client } from "../api";
import { ApiConnector } from "../api/api-connector";
import { Patient } from "../features/patient/patient";

export class DataAdd {
  initFields = [];
  addingList: any = [];
  desc = "";
  bodyField = "";
  endpoint = "";
  defaultDateTime = "";
  defaultDateTimeName = "";
  defaultDateTimeFields = [];
  customDateTime = "";
  reloadToTab = "";
  requiredFields = [];

  requiredEitherOr = [];
  required = [];

  constructor(
    public api: ApiConnector,
    public patient: Patient,
  ) {}

  async initEmpty() {}

  removeItem(index: number) {
    this.addingList.splice(index, 1);
  }

  addItem() {
    this.addingList.push({});
  }

  setAllDatetimes(datetime) {
    for (const field of this.addingList) {
      for (const key of this.defaultDateTimeFields) {
        field[key] = datetime;
      }
    }
    if (datetime === this.defaultDateTime) {
      this.customDateTime = "";
    } else {
      this.customDateTime = datetime;
    }
  }

  customSanitize(field: object) {
    return field;
  }

  async postBulk() {
    // filter by required
    const filteredData =
      this.requiredFields.length === 0
        ? this.addingList
        : this.addingList.filter((item) =>
            this.requiredFields.every(
              (field) => item.hasOwnProperty(field) && item[field] !== null,
            ),
          );
    for (let i = 0; i < filteredData.length; i++) {
      filteredData[i].patient_id = this.patient.patientId;
      filteredData[i] = this.customSanitize(filteredData[i]);
    }

    let body = {};
    body["number_of_datapoints"] = filteredData.length;
    body[this.bodyField] = filteredData;

    const response = await client.post({
      url: `/api/${this.api.apiVersion}/${this.endpoint}`,
      body,
    });

    if (response.data != null) {
      this.api.clearResponseCache();
      window.navigate(`/patient/${this.patient.patientId}/${this.reloadToTab}`);
    }
  }
}
