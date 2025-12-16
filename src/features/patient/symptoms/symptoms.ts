import { ListSymptomResponse } from "../../../api";
import { DataModel } from "../../../models/data-model";
import { AccessRules } from "../../../constants/roles";

export class Symptoms extends DataModel<SymptomsItem> {
  constructor(data: SymptomsItem[], userLevel: number, userUUID: string) {
    super(data, userLevel, userUUID);
    this.hasHistory = true;

    // access
    this.access = {
      editRules: { 2: AccessRules.owner, 3: AccessRules.visible },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.visible },
      historyMinLevel: 3,
    };
  }
}

export type SymptomsItem = ListSymptomResponse["symptoms"][number];
