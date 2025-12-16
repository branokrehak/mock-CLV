import { QuickLookTasks, SeerlinqComputedWithPPGResponse } from "../../../api";
import { ApiConnector } from "../../../api/api-connector";
import { AccessRules } from "../../../constants/roles";
import { DataModel } from "../../../models/data-model";
import { PPGQuickLook } from "../../../models/quick-look-analyses";

export class ComputedData extends DataModel {
  constructor(
    data: SeerlinqComputedWithPPGResponse[],
    userLevel: number,
    userUUID: string,
    private api: ApiConnector | null = null,
    private qlAnalysisType: QuickLookTasks | null = null,
  ) {
    super(data, userLevel, userUUID);

    // access
    this.access = {
      editRules: { 2: AccessRules.visible, 3: AccessRules.visible },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.none },
      historyMinLevel: null,
    };
  }

  init() {
    this.data = this.data.map((item: SeerlinqComputedWithPPGResponse) => {
      const ppgQuickLook =
        this.api !== null && this.qlAnalysisType !== null
          ? new PPGQuickLook(
              this.api,
              this.qlAnalysisType,
              item.ppgs.map((ppg) => ppg.uuid),
            )
          : null;
      const ppgConditions = item.ppgs.map((ppg) => ppg.measurement_condition);
      const ppgDevice = [
        ...new Set(item.ppgs.map((ppg) => ppg.measurement_device)),
      ][0];
      return {
        ...item,
        ppgConditions: ppgConditions.sort((a, b) => a.localeCompare(b)),
        ppgQuickLook: ppgQuickLook,
        ppgDevice: ppgDevice,
      };
    });
    super.init();
  }
}
