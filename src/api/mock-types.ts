// Simplified mock types - only essential fields needed for the app to work

// Enums (keep these as they're used in the UI)
export enum SeerlinqEnvironments {
  dev = "dev",
  test = "test",
  stage = "stage",
  prod = "prod",
}

export enum SupportedLanguages {
  sk = "sk",
  en = "en",
  cs = "cs",
}

export enum UserRole {
  admin = "admin",
  physician = "physician",
  "study-physician" = "study-physician",
  "seerlinq-user" = "seerlinq-user",
  patient = "patient",
}

export enum SeerlinqStudy {
  no_study = "no_study",
  commercial = "commercial",
  sq_validation_study = "sq_validation_study",
  test_monitoring = "test_monitoring",
  stop_dhf = "stop_dhf",
  clinic_single = "clinic_single",
  seerlinq_lhc = "seerlinq_lhc",
}

export enum Race {
  "American Indian or Alaska Native" = "American Indian or Alaska Native",
  Asian = "Asian",
  "Black or African American" = "Black or African American",
  "Native Hawaiian or Other Pacific Islander" = "Native Hawaiian or Other Pacific Islander",
  White = "White",
  Caucasian = "Caucasian",
  "Unknown / Not Reported" = "Unknown / Not Reported",
}

export enum Sex {
  M = "M",
  F = "F",
  O = "O",
}

export enum PatientState {
  normal = "normal",
  high_risk = "high_risk",
}

export enum PatientStatus {
  test = "test",
  active = "active",
  not_active = "not_active",
  mark_for_deletion = "mark_for_deletion",
  dead = "dead",
}

export enum InformedConsent {
  none = "none",
  telemonitoring = "telemonitoring",
  paper = "paper",
}

export enum AlertKind {
  medical = 0,
  technical = 1,
  compliance = 2,
}

export enum AlertType {
  low_critical = -3,
  low_alert = -2,
  low_warning = -1,
  normal = 0,
  high_warning = 1,
  high_alert = 2,
  high_critical = 3,
}

export enum PPGMeasurementMode {
  external_data = "external_data",
  seerlinq_supervision = "seerlinq_supervision",
  physician_supervison = "physician_supervison",
  home_monitoring = "home_monitoring",
  synthetic = "synthetic",
}

export enum ECGMeasurementMode {
  external_data = "external_data",
  home_monitoring = "home_monitoring",
  physician_supervison = "physician_supervison",
  seerlinq_supervision = "seerlinq_supervision",
  synthetic = "synthetic",
}

export enum PPGQualityFlag {
  unknown = "unknown",
  data_error = "data_error",
  ok = "ok",
  low_signal_quality = "low_signal_quality",
  artefacts = "artefacts",
  short_signal = "short_signal",
  extra_circumstance = "extra_circumstance",
  test_measurement = "test_measurement",
}

export enum ECGQualityFlag {
  data_error = "data_error",
  low_signal_quality = "low_signal_quality",
  ok = "ok",
  unknown = "unknown",
}

export enum PPGRelatedQualityFlag {
  wrong = "wrong",
  ok = "ok",
  low_ppg_quality = "low_ppg_quality",
  ignore_data = "ignore_data",
  manual_value_override = "manual_value_override",
}

export enum ECGRelatedQualityFlag {
  _0 = "0",
  _1 = "1",
  _2 = "2",
  _3 = "3",
  _4 = "4",
}

export enum ECGDerivedDataGroup {
  "scp-default" = "scp-default",
  "scp-custom" = "scp-custom",
}

export enum ECGLead {
  "lead-I" = "lead-I",
  "lead-II" = "lead-II",
  "lead-III" = "lead-III",
  "lead-aVR" = "lead-aVR",
  "lead-aVL" = "lead-aVL",
  "lead-aVF" = "lead-aVF",
}

export enum ECGDiagnosticClass {
  normal = "normal",
}

export enum PatientMonitoringWatchKind {
  none = "none",
  medical = "medical",
  tech_compliance = "tech_compliance",
}

export enum PatientMonitoringWatchStatus {
  in_progress = "in_progress",
  new_alert = "new_alert",
  not_watching = "not_watching",
  watching = "watching",
  from_audit = "from_audit",
}

export enum ClinicalStudies {
  "seerlinq-lhc" = "seerlinq-lhc",
}

export enum QuestionnaireTypes {
  eq_5d_5l = "eq_5d_5l",
  dummy = "dummy",
}

export enum HealthProPhysicians {
  allan_bohm = "allan_bohm",
  diana_sevcikova = "diana_sevcikova",
}

export enum HealthProDiagnoses {
  "I50.9" = "I50.9",
  "I50.11" = "I50.11",
  "I50.12" = "I50.12",
  "I50.13" = "I50.13",
  "I50.14" = "I50.14",
}

export enum HealthProServices {
  "11a" = "11a",
}

export enum EventCategory {
  hospitalization = "hospitalization",
  death = "death",
  visit = "visit",
  medical_call = "medical_call",
  technical_call = "technical_call",
  medication_change = "medication_change",
  labs = "labs",
  physician_notified = "physician_notified",
  patient_non_adherence = "patient_non_adherence",
  adverse_event = "adverse_event",
}

export enum HospitalizationEventType {
  unplanned = "unplanned",
  elective = "elective",
}

export enum HospitalizationEventReason {
  hfh = "hfh",
  cv = "cv",
  non_cv = "non_cv",
}

export enum DeathEventReason {
  hf = "hf",
  cv = "cv",
  non_cv = "non_cv",
  unknown = "unknown",
}

export enum VisitEventType {
  planned = "planned",
}

export enum VisitEventUnplannedCategory {
  er_urgent_hf_iv_diuretics = "er_urgent_hf_iv_diuretics",
  outpatient = "outpatient",
  study_visit = "study_visit",
  er_cv = "er_cv",
  er_non_cv = "er_non_cv",
}

export enum VisitEventPlannedCategory {
  outpatient_seerlinq = "outpatient_seerlinq",
  er_seerlinq = "er_seerlinq",
}

export enum LabsEventType {
  seerlinq = "seerlinq",
}

export enum PhysicianNotifiedEventType {
  regular = "regular",
}

export enum AdverseEventType {
  hypokalemia = "hypokalemia",
  hyperkalemia = "hyperkalemia",
  hyponatremia = "hyponatremia",
  symptomatic_hypotension = "symptomatic_hypotension",
}

export enum AdverseEventLevel {
  mild = "mild",
  moderate = "moderate",
  severe = "severe",
}

export enum Days {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export enum DerivedDataRollingType {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  full = "full",
  window = "window",
}

export enum PPGDerivedDataGroup {
  heart_rate = "heart_rate",
  respiratory_rate = "respiratory_rate",
  oxygen_saturation = "oxygen_saturation",
  hr = "hr",
  hrv = "hrv",
  spo2 = "spo2",
}

export enum QuickLookTasks {
  hf_dri_timeseries_ql = "hf_dri_timeseries_ql",
  ppg_timeseries_ql = "ppg_timeseries_ql",
}

export enum DerivedDataAggregationFunction {
  mean = "mean",
  median = "median",
  min = "min",
  max = "max",
  std = "std",
  sdnn = "sdnn",
  sdsd = "sdsd",
  rmssd = "rmssd",
  pnn50 = "pnn50",
  pnn20 = "pnn20",
  psd_lf = "psd_lf",
  psd_hf = "psd_hf",
  sample_entropy = "sample_entropy",
}

// Simplified types - using any for flexibility
export type APIInfoResponse = {
  environment: SeerlinqEnvironments;
  version: string;
  base_url: string;
  server_time_utc: string;
  server_time_local: string;
};

export type CountrySchema = {
  code: string;
  name: string;
  regions: RegionSchema[];
  [key: string]: any;
};

export type RegionSchema = {
  code: string;
  name: string;
  region_enum_value?: number;
  region_name?: string;
  [key: string]: any;
};

export type PatientBaseSchema = {
  patient_id: number;
  date_of_birth: string;
  sex: Sex;
  race: Race;
  height?: number | null;
  description?: string | null;
  country: string;
  region: string;
  patient_study: SeerlinqStudy[];
  informed_consent: InformedConsent;
  updated_at?: string;
  [key: string]: any; // Allow extra fields
};

export type MinimalPatientResponse = {
  patient_id: number;
  name: string;
  email: string;
  country: string;
  region: string;
  patient_study: SeerlinqStudy[];
  informed_consent: InformedConsent;
  [key: string]: any;
};

export type DefaultPatientResponse = PatientBaseSchema & {
  name: string;
  email: string;
  phone?: string | null;
  residence?: string | null;
  health_insurance?: string | null;
  id_number?: string | null;
  [key: string]: any;
};

export type Level3PatientResponse = DefaultPatientResponse & {
  state: PatientState;
  status: PatientStatus;
  [key: string]: any;
};

export type Level3MinimalPatientResponse = MinimalPatientResponse & {
  state: PatientState;
  status: PatientStatus;
  [key: string]: any;
};

export type Level3ClinicalPatientResponse = Level3PatientResponse & {
  monitoring_watch_kind: PatientMonitoringWatchKind;
  monitoring_watch_status: PatientMonitoringWatchStatus;
  [key: string]: any;
};

export type FullUserResponse = {
  uuid: string;
  username: string;
  role: UserRole;
  access_policy?: {
    monitoring_active?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
};

export type UserPatientRoleResponse = {
  uuid: string;
  username: string;
  role: UserRole;
  [key: string]: any;
};

export type UserResponseManaging = {
  uuid: string;
  username: string;
  role: UserRole;
  access_policy?: {
    monitoring_active?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
};

export type DefaultMedicationSchemaResponse = {
  uuid: string;
  patient_id: number;
  medication_name: string;
  dosage?: string | null;
  frequency?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type SupportedDiagnosis = {
  data_name: string;
  data_value: {
    value_type: "enum";
    values_enum: string[];
    [key: string]: any;
  };
  [key: string]: any;
};

export type SupportedMedicalData = {
  data_name: string;
  primary_unit: string;
  all_units: string[] | null;
  data_value: {
    value_type: "enum" | "float" | "int" | "integer";
    values_enum?: string[];
    [key: string]: any;
  };
  [key: string]: any;
};

export type SupportedSymptom = {
  data_name: string;
  data_value: {
    value_type: "enum";
    values_enum: string[];
    [key: string]: any;
  };
  [key: string]: any;
};

export type PhysicianWithPatientsResponse = {
  uuid: string;
  name: string;
  email: string;
  country: string;
  region: string;
  patient_count: number;
  [key: string]: any;
};

export type PatientScheduleResponse = {
  uuid: string;
  patient_id: number;
  day: Days;
  time: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type ListMedicalDataResponse = {
  data: any[];
  pagination: {
    total_items: number;
    total_pages: number;
    page: number;
    page_size: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export type ListSymptomResponse = {
  data: any[];
  pagination: {
    total_items: number;
    total_pages: number;
    page: number;
    page_size: number;
    [key: string]: any;
  };
  [key: string]: any;
};

export type SeerlinqComputedWithPPGResponse = {
  uuid: string;
  patient_id: number;
  ppg_uuid: string;
  computed_at: string;
  ppgs?: Array<{
    uuid: string;
    measurement_condition: string;
    measurement_device: string;
  }>;
  [key: string]: any;
};

export type ECGDerivedDataSchemaWithECGResponse = {
  uuid: string;
  patient_id: number;
  ecg_uuid: string;
  derived_at: string;
  [key: string]: any;
};

export type PPGDerivedDataSchemaWithPPGResponse = {
  uuid: string;
  patient_id: number;
  ppg_uuid: string;
  derived_at: string;
  data_group: PPGDerivedDataGroup;
  [key: string]: any;
};

export type DerivedDataWindowTypeSchema = {
  window_type: string;
  window_size: number;
  [key: string]: any;
};

export type MeasurementRequiredData_Input = {
  [key: string]: any;
};

export type StrictPPGConditions = {
  [key: string]: any;
};

// Also export as const for use as values
export const StrictPPGConditions: Record<string, string> = {
  condition1: "Condition 1",
  condition2: "Condition 2",
  condition3: "Condition 3",
  condition4: "Condition 4",
  condition5: "Condition 5",
  condition6: "Condition 6",
};

export type CreateUserForExistingPatientSchema = {
  preferred_language: SupportedLanguages;
  token_expiry_timedelta: string;
  [key: string]: any;
};

export type EnumDataSchema = {
  value_type: "enum";
  values_enum: string[];
  [key: string]: any;
};

export type FloatDataSchema = {
  value_type: "float";
  [key: string]: any;
};

export type IntDataSchema = {
  value_type: "int" | "integer";
  [key: string]: any;
};

export type AccessLimiterResponse = {
  limiter_table: string;
  limiter_type: string;
  limit_role?: UserRole | null;
  limit_username?: string | null;
  limit_whole_table?: boolean;
  allowed_items?: string[] | null;
  forbidden_items?: string[] | null;
  user_uuid?: string | null;
  uuid: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
};

export type DefaultPatientAlertResponse = {
  uuid: string;
  patient_id: number;
  alert_kind: AlertKind;
  alert_type: AlertType;
  [key: string]: any;
};

export type MedicalWaitingRoomAlerts = {
  patient_id: number;
  last_events: any[];
  [key: string]: any;
};

export type AuditRoomRow = {
  patient_id: number;
  last_events: any[];
  [key: string]: any;
};

export type WaitingRoomEvents = {
  event_date?: string;
  event_category?: string;
  event_category_type?: string;
  event_category_details?: string;
  event_description?: string;
  added_by?: string;
  event_shape?: any;
  event_color_hex?: string;
  [key: string]: any;
};

export enum AlertTables {
  patients = "patients",
  medicaldata = "medicaldata",
  symptoms = "symptoms",
  ppg = "ppg",
  ppg_derived = "ppg_derived",
  sq_computed = "sq_computed",
}

export type AuditRoomResponse = {
  fetched?: string;
  audit_room_timespan?: string;
  audit_room?: any[];
  patient_id?: number;
  last_events?: any[];
  [key: string]: any;
};

export type ListMonitoringUsersResponse = {
  users: UserResponseManaging[];
  [key: string]: any;
};

export type ListPatientsMinimalResponse = {
  patients: MinimalPatientResponse[];
  [key: string]: any;
};

export enum MedicalDataCategory {
  lab = "lab",
  labs = "labs",
  vital = "vital",
  other = "other",
}

export enum ScheduleTypes {
  medication = "medication",
  measurement = "measurement",
  ppg = "ppg",
  other = "other",
}
