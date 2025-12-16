import { AccessRules } from "../../../constants/roles";
import { DataModel } from "../../../models/data-model";

export class MedData extends DataModel {
  readonly idAttr = "uuid";

  // constants
  notEditable = [
    "ePVS",
    "CKD-EPI",
    "CHA2DS2-VA",
    "BMI",
    "BSA",
    "congestion score",
  ];

  constructor(data, userLevel: number, userUUID: string) {
    super(data, userLevel, userUUID);
    this.hasHistory = true;

    // access
    this.access = {
      editRules: { 2: AccessRules.owner, 3: AccessRules.visible },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.visible },
      historyMinLevel: 3,
    };
  }

  override validateItemEdit(item: any): string | undefined {
    if (this.notEditable.includes(item.measurement_type)) {
      return "Auto-computed";
    }

    return super.validateItemEdit(item);
  }

  override validateItemDelete(item: any): string | undefined {
    if (this.notEditable.includes(item.measurement_type)) {
      return "Auto-computed";
    }

    return super.validateItemDelete(item);
  }
}
