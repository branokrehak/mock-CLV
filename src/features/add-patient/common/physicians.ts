import { PhysicianWithPatientsResponse } from "../../../api";
import { AccessRules } from "../../../constants/roles";
import { DataModel } from "../../../models/data-model";

export class Physicians extends DataModel<PhysiciansItem> {
  readonly idAttr = "uuid";

  constructor(data: PhysiciansItem[], userLevel: number, userUUID: string) {
    super(data, userLevel, userUUID);

    // access
    this.access = {
      editRules: { 2: AccessRules.owner, 3: AccessRules.visible },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.visible },
      historyMinLevel: null,
    };
  }

  prepareDraft(item: PhysiciansItem) {
    const field = super.prepareDraft(item);
    field["patients"] = item["patients"].map((p) => p.patient_id);
    field["clinics"] = item["clinics"].map((c) => c.uuid);
    field["connected_user_uuid"] = item["connected_user"]?.uuid;
    return field;
  }
}

export function toPhysiciansItem(
  data: PhysicianWithPatientsResponse,
): PhysiciansItem {
  const numClinics = data.clinics.length;
  const clinics = data.clinics
    .map((obj) => `${obj["name"]} (${obj["ambulance"]})`)
    .join(" \\ ");
  const numPatients = data.patients.length;
  const username = data.connected_user?.username ?? null;
  return {
    ...data,
    ["numClinics"]: numClinics,
    ["clinicsStr"]: clinics,
    ["numPatients"]: numPatients,
    ["username"]: username,
  };
}

export interface PhysiciansItem extends PhysicianWithPatientsResponse {
  numClinics: number;
  clinicsStr: string;
  numPatients: number;
  username: string;
}
