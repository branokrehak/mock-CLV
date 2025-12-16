import {
  DerivedDataAggregationFunction,
  DerivedDataRollingType,
  DerivedDataWindowTypeSchema,
  PPGDerivedDataGroup,
  PPGDerivedDataSchemaWithPPGResponse,
  QuickLookTasks,
} from "../../../api";
import { ApiConnector } from "../../../api/api-connector";
import { AccessRules } from "../../../constants/roles";
import { DataModel } from "../../../models/data-model";
import { PPGQuickLook } from "../../../models/quick-look-analyses";

export class DerivedData extends DataModel {
  // constants

  dataGroups = {
    [PPGDerivedDataGroup.hr]: "HR",
    [PPGDerivedDataGroup.hrv]: "HR Variability",
    [PPGDerivedDataGroup.spo2]: "SpO2",
  };
  aggTypes = {
    [DerivedDataRollingType.full]: "full",
    [DerivedDataRollingType.window]: "windowed",
  };
  aggFuncs = {
    [DerivedDataAggregationFunction.mean]: "mean",
    [DerivedDataAggregationFunction.median]: "median",
    [DerivedDataAggregationFunction.std]: "STD",
    [DerivedDataAggregationFunction.min]: "min",
    [DerivedDataAggregationFunction.max]: "max",
    [DerivedDataAggregationFunction.sdnn]: "SDNN",
    [DerivedDataAggregationFunction.sdsd]: "SDSD",
    [DerivedDataAggregationFunction.rmssd]: "RMSSD",
    [DerivedDataAggregationFunction.pnn50]: "pNN50",
    [DerivedDataAggregationFunction.pnn20]: "pNN20",
    [DerivedDataAggregationFunction.psd_lf]: "low frequency power",
    [DerivedDataAggregationFunction.psd_hf]: "high frequency power",
    [DerivedDataAggregationFunction.sample_entropy]: "entropy",
  };
  spo2Name = "SpO2: mean";
  hrName = "HR: mean";

  constructor(
    data: PPGDerivedDataSchemaWithPPGResponse[],
    userLevel: number,
    userUUID: string,
    private api?: ApiConnector,
    private qlAnalysisType?: QuickLookTasks,
  ) {
    super(data, userLevel, userUUID);
    this.defaultFilter = {
      rolling: [DerivedDataRollingType.full],
      aggregation_function: [
        DerivedDataAggregationFunction.mean,
        DerivedDataAggregationFunction.sdnn,
        DerivedDataAggregationFunction.sdsd,
        DerivedDataAggregationFunction.pnn50,
        DerivedDataAggregationFunction.psd_lf,
        DerivedDataAggregationFunction.psd_hf,
        DerivedDataAggregationFunction.sample_entropy,
      ],
    };

    // access
    this.access = {
      editRules: { 2: AccessRules.none, 3: AccessRules.visible },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.none },
      historyMinLevel: null,
    };
  }

  init() {
    this.data = this.data.map((item: PPGDerivedDataSchemaWithPPGResponse) => {
      let ppgQuickLook: PPGQuickLook = null;
      if (this.api && this.qlAnalysisType) {
        ppgQuickLook = new PPGQuickLook(this.api, this.qlAnalysisType, [
          item["ppg"]["uuid"],
        ]);
      }
      const ppgCond = item.ppg.measurement_condition;
      const ppgDevice = item.ppg.measurement_device;
      return {
        ...item,
        ["ppgConditions"]: [ppgCond],
        ["ppgDevice"]: [ppgDevice],
        ["ppgQuickLook"]: ppgQuickLook,
      };
    });
    super.init();
  }

  strWindow(window: DerivedDataWindowTypeSchema) {
    if (window === null) {
      return "";
    } else {
      const windowStr = window.window_function + ": " + window.length + "s / ";
      if (window.length === window.step) {
        return windowStr + "non-overlapping";
      } else {
        return windowStr + "s step";
      }
    }
  }

  filterSpO2() {
    this.data = this.data.filter((item) => {
      return (
        item.measurement_type === this.spo2Name &&
        item.data_group === PPGDerivedDataGroup.spo2
      );
    });
  }

  filterHR() {
    this.data = this.data.filter((item) => {
      return (
        item.measurement_type === this.hrName &&
        item.data_group === PPGDerivedDataGroup.hr
      );
    });
  }
}
