import {
  apiPutPatientsPatientId,
  Level3MinimalPatientResponse,
  MinimalPatientResponse,
  PatientBaseSchema,
} from "../../api";
import { DataModel } from "../../models/data-model";
import {
  canApprovePaperConsent,
  canRevokePaperConsent,
  consentOk,
} from "../../utils/data-utils";
import { Merge } from "../../utils/types";

export class Patients extends DataModel<PatientsItem> {
  readonly idAttr = "patient_id";

  constructor(data: PatientsItem[], userLevel: number, userUUID: string) {
    super(data, userLevel, userUUID);
  }

  async updatePatient(patId: number, field: object) {
    await apiPutPatientsPatientId({
      path: { patient_id: patId },
      body: field,
    });
    window.location.reload();
  }

  canApprovePaperConsent(patient: PatientBaseSchema) {
    return canApprovePaperConsent(patient);
  }

  canRevokePaperConsent(patient: PatientBaseSchema) {
    return canRevokePaperConsent(patient);
  }

  consentOk(patient: PatientBaseSchema) {
    return consentOk(patient);
  }

  disabledPatLink(patient: PatientBaseSchema) {
    return !this.consentOk(patient) && this.userLevel !== 4;
  }
}

export type PatientsItem = Merge<
  Level3MinimalPatientResponse | MinimalPatientResponse
>;
