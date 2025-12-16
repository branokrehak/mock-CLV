import {
  apiGetUsers,
  apiGetUsersMonitoringUsers,
  apiGetUsersPhysicians,
} from "../../../api";
import { ApiConnector } from "../../../api/api-connector";
import { AccessRules } from "../../../constants/roles";
import { DataModel } from "../../../models/data-model";

export class Users extends DataModel {
  readonly idAttr = "uuid";
  userMapping = {};

  constructor(public api: ApiConnector) {
    super([], api.userLevel, api.userUUID);
    this.defaultFilter = {
      role: [
        "admin",
        "seerlinq-user",
        "study-physician",
        "physician",
        "patient",
      ],
    };

    // access
    this.access = {
      editRules: { 2: AccessRules.none, 3: AccessRules.none },
      deleteRules: { 2: AccessRules.none, 3: AccessRules.none },
      historyMinLevel: null,
    };
  }

  dataInit() {
    super.init();
    this.getMapping();
  }

  async init() {
    const users = await apiGetUsers();
    this.data = users.data.users;
    this.dataInit();
  }

  async initPhysiciansOnly() {
    const users = await apiGetUsersPhysicians();
    this.data = users.data.users;
    this.dataInit();
  }

  async initMonitoringUsers(
    country?: string,
    accessPolicyUUID?: string,
    region?: string,
  ) {
    const users = await apiGetUsersMonitoringUsers({
      query: {
        country: country,
        access_policy: accessPolicyUUID,
        region: region,
      },
    });
    this.data = users.data.users;
    this.dataInit();
  }

  getMapping() {
    for (const user of this.data) {
      this.userMapping[user.uuid] = user.username;
    }
  }

  generateLinks(ids: number[]) {
    return ids
      .map(
        (id) =>
          `<strong><a style="color: #bb16a3" href="/patient/${id}">${id}</a></strong>`,
      )
      .join(", ");
  }

  prepareDraft(item: any) {
    const field = super.prepareDraft(item);
    field["managed_patients"] = item["managed_patients"].map(
      (p) => p.patient_id,
    );
    return field;
  }
}
