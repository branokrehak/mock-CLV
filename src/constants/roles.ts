import { UserRole } from "../api";

export const userLevel: Record<UserRole, number> = {
  [UserRole["patient-ppg-app"]]: 1,
  [UserRole["physician-ppg-app"]]: 1,
  [UserRole["study-ppg-app"]]: 1,
  [UserRole["patient"]]: 2,
  [UserRole["physician"]]: 2,
  [UserRole["study-physician"]]: 3,
  [UserRole["seerlinq-user"]]: 3,
  [UserRole["admin"]]: 4,
};

export enum AccessRules {
  visible = "visible",
  owner = "owner",
  none = "none",
}

export interface TableAccess {
  readonly editRules: { [2]: AccessRules; [3]: AccessRules };
  readonly deleteRules: { [2]: AccessRules; [3]: AccessRules };
  readonly historyMinLevel: number | null;
}
