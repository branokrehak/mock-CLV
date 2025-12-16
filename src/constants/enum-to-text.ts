import {
  InformedConsent,
  PatientState,
  PatientStatus,
  PPGRelatedQualityFlag,
  QuestionnaireTypes,
  SeerlinqStudy,
} from "../api";

export const patientStates: Record<PatientState, string> = {
  [PatientState.normal]: "Normal",
  [PatientState.high_risk]: "High risk",
};

export const patientStatuses: Record<PatientStatus, string> = {
  [PatientStatus.test]: "Test",
  [PatientStatus.active]: "Active",
  [PatientStatus.not_active]: "Not active",
  [PatientStatus.mark_for_deletion]: "Marked for deletion",
  [PatientStatus.dead]: "Dead",
};

export const seerlinqStudies: Record<SeerlinqStudy, string> = {
  [SeerlinqStudy.no_study]: "No study",
  [SeerlinqStudy.commercial]: "Commercial",
  [SeerlinqStudy.sq_validation_study]: "Seerlinq-validation study",
  [SeerlinqStudy.test_monitoring]: "Test home-monitoring",
  [SeerlinqStudy.stop_dhf]: "#STOP-DHF",
  [SeerlinqStudy.clinic_single]: "Clinic: single measurement",
  [SeerlinqStudy.seerlinq_lhc]: "Seerlinq: LHC study",
};

export const informedConsent: Record<InformedConsent, string> = {
  [InformedConsent.none]: "None",
  [InformedConsent.telemonitoring]: "Telemonitoring",
  [InformedConsent.paper]: "Paper",
};

export const ppgRelatedFlag: Record<PPGRelatedQualityFlag, string> = {
  [PPGRelatedQualityFlag.wrong]: "Wrong",
  [PPGRelatedQualityFlag.ok]: "OK",
  [PPGRelatedQualityFlag.low_ppg_quality]: "Low PPG Quality",
  [PPGRelatedQualityFlag.ignore_data]: "Ignore",
  [PPGRelatedQualityFlag.manual_value_override]: "Manual value override",
};

export const questionnaireTypes = {
  [QuestionnaireTypes.eq_5d_5l]: "EQ-5D-5L",
} as Record<QuestionnaireTypes, string>;

if (import.meta.env.VITE_QUESTIONNAIRES_DUMMY) {
  questionnaireTypes[QuestionnaireTypes.dummy] = "Dummy";
}
