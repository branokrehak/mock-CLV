import {
  Days,
  InformedConsent,
  PatientBaseSchema,
  SeerlinqStudy,
  SupportedDiagnosis,
  SupportedMedicalData,
  SupportedSymptom,
} from "../api";

const studiesToPhysicianConsent = [
  SeerlinqStudy.no_study,
  SeerlinqStudy.sq_validation_study,
  SeerlinqStudy.clinic_single,
];
export function canApprovePaperConsent(patient: PatientBaseSchema) {
  if (
    patient.informed_consent === InformedConsent.none &&
    patient.patient_study.some((study) =>
      studiesToPhysicianConsent.includes(study),
    )
  ) {
    return true;
  } else {
    return false;
  }
}

export function canRevokePaperConsent(patient: PatientBaseSchema) {
  if (
    patient.informed_consent === InformedConsent.paper &&
    patient.patient_study.some((study) =>
      studiesToPhysicianConsent.includes(study),
    )
  ) {
    return true;
  } else {
    return false;
  }
}

export function isPaperConsent(patient: PatientBaseSchema) {
  if (
    patient.patient_study.some((study) =>
      studiesToPhysicianConsent.includes(study),
    )
  ) {
    return true;
  } else {
    return false;
  }
}

export function consentOk(patient: PatientBaseSchema) {
  const isPaper = isPaperConsent(patient);
  if (patient.informed_consent === InformedConsent.none) {
    return false;
  } else if (isPaper && patient.informed_consent === InformedConsent.paper) {
    return true;
  } else if (
    !isPaper &&
    patient.informed_consent === InformedConsent.telemonitoring
  ) {
    return true;
  } else {
    return false;
  }
}

export const dayNames: Record<Days, string> = {
  [Days.monday]: "Mon",
  [Days.tuesday]: "Tue",
  [Days.wednesday]: "Wed",
  [Days.thursday]: "Thu",
  [Days.friday]: "Fri",
  [Days.saturday]: "Sat",
  [Days.sunday]: "Sun",
};

// data schemas and utils
export type SupportedData =
  | SupportedMedicalData
  | SupportedSymptom
  | SupportedDiagnosis;

export function getNamesValues(variables: SupportedData[]) {
  return variables.map((data) => data.data_name);
}

export function getVariableByName<T extends SupportedData>(
  variables: T[],
  dataName: string,
): T {
  return variables.find((data) => data.data_name === dataName);
}

export function getPrimaryUnitByName(
  variables: SupportedMedicalData[],
  dataName: string,
) {
  const variable = variables.find((data) => data.data_name === dataName);
  if (variable === undefined || variable === null) {
    return null;
  }
  return variable.primary_unit;
}

export function getUnitsValuesByName(
  variables: SupportedMedicalData[],
  dataName: string,
) {
  const variable = variables.find((data) => data.data_name === dataName);
  if (variable === undefined || variable === null) {
    return [];
  }
  if (variable.all_units === null) {
    return [];
  }
  return variable.all_units;
}
