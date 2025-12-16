import { ppgRelatedFlag } from "../../../constants/enum-to-text";
import { MedData } from "./med-data";

export class MergedMedData extends MedData {
  originFieldName: string = "data_source";
  flagKey: string = "seerlinq_measurement_quality_flag";
  tagsKey: string = "tags";
  condsKey: string = "ppgConditions";
  deviceKey: string = "ppgDevice";
  quickLookKey: string = "ppgQuickLook";

  medDataKeys: string[] = [
    "measurement_datetime",
    "measurement_type",
    "measurement_value",
    "measurement_unit",
    "comment",
    "created_at",
    "update_history",
    "uuid",
    this.flagKey,
    this.tagsKey,
    this.deviceKey,
    this.condsKey,
    this.quickLookKey,
    "override_value",
  ];

  updateEndpoint = {
    [MedDataSource.PatientOrPhysician]: "medicaldata",
    [MedDataSource.SQAlgo]: "computed",
    [MedDataSource.PPGDerived]: "derived",
  };

  mergeWithPPGDerivedAndComputed(
    derivedDataList: any[],
    computedDataList: any[],
    keyToRename: string,
    valueMapping: object,
  ) {
    const filterAndLabel = (
      list: any[],
      label: MedDataSource,
      renameKey: boolean = true,
      defaultQF: number = null,
      defaultTag: string[] = null,
      defaultDevice: string = null,
      defaultCond: string[] = null,
    ) =>
      list.map((item) => {
        const filteredItem = this.medDataKeys.reduce((acc, key) => {
          if (item.hasOwnProperty(key)) {
            acc[key] =
              renameKey &&
              key === keyToRename &&
              valueMapping[item[key]] !== undefined
                ? valueMapping[item[key]]
                : item[key];
          }
          return acc;
        }, {});
        filteredItem[this.originFieldName] = label;
        if (defaultQF !== null) {
          filteredItem[this.flagKey] = defaultQF;
        }
        if (defaultTag !== null) {
          filteredItem[this.tagsKey] = defaultTag;
        }
        if (defaultDevice !== null) {
          filteredItem[this.deviceKey] = defaultDevice;
        }
        if (defaultCond !== null) {
          filteredItem[this.condsKey] = defaultCond;
        }

        return filteredItem;
      });
    const medData = filterAndLabel(
      this.data,
      MedDataSource.PatientOrPhysician,
      false,
      -1,
      ["Not tagged"],
      "--",
      ["--"],
    );
    const derivedData = derivedDataList
      .map((item) =>
        filterAndLabel(item.data, MedDataSource.PPGDerived, true, null, [
          "Not tagged",
        ]),
      )
      .flat();
    const computedData = computedDataList
      .map((item) => filterAndLabel(item.data, MedDataSource.SQAlgo, true))
      .flat();
    this.data = [...medData, ...derivedData, ...computedData];
  }

  flag(member: any) {
    return ppgRelatedFlag[member[this.flagKey]] || "N/A";
  }

  override validateItemDelete(item: any): string | undefined {
    if (item.data_source !== MedDataSource.PatientOrPhysician) {
      return "Cannot delete";
    }

    return super.validateItemDelete(item);
  }
}

export enum MedDataSource {
  PatientOrPhysician = "Patient / Physician",
  SQAlgo = "SQ-algo",
  PPGDerived = "PPG-derived",
}
