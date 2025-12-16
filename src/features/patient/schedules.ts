import { PatientScheduleResponse } from "../../api";
import { DataModel } from "../../models/data-model";

export class Schedules extends DataModel {
  constructor(
    data: PatientScheduleResponse[],
    userLevel: number,
    userUUID: string,
  ) {
    super(data, userLevel, userUUID);
  }
}
