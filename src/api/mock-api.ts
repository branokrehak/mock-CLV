// Simplified mock API functions - return mock data instead of making real API calls

import type {
  APIInfoResponse,
  AccessLimiterResponse,
  CountrySchema,
  DefaultMedicationSchemaResponse,
  FullUserResponse,
  Level3ClinicalPatientResponse,
  Level3PatientResponse,
  ListMedicalDataResponse,
  MinimalPatientResponse,
  PatientScheduleResponse,
  PhysicianWithPatientsResponse,
  SeerlinqComputedWithPPGResponse,
  SupportedDiagnosis,
  SupportedMedicalData,
  SupportedSymptom,
  UserResponseManaging,
} from "./mock-types";
import {
  InformedConsent,
  PatientState,
  PatientStatus,
  SeerlinqEnvironments,
  SeerlinqStudy,
  UserRole,
} from "./mock-types";

// Simple mock response helper
function mockResponse<T>(data: T): Promise<{ data: T }> {
  return Promise.resolve({ data });
}

// Helper function to generate UUIDs
function generateUUID(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to generate dates
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

// Helper function to generate random patient ID between 1000 and 9999
function generateRandomPatientId(): number {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

// Mock data store - maintains state across API calls
class MockDataStore {
  private patients: MinimalPatientResponse[] = [];
  private usedPatientIds = new Set<number>();
  private medications: Map<number, any[]> = new Map();
  private symptoms: Map<number, any[]> = new Map();
  private labData: Map<number, any[]> = new Map();

  private generateUniqueRandomPatientId(): number {
    let patientId: number;
    do {
      patientId = generateRandomPatientId();
    } while (this.usedPatientIds.has(patientId));
    this.usedPatientIds.add(patientId);
    return patientId;
  }

  addPatient(patientData: any): number {
    const patientId = this.generateUniqueRandomPatientId();

    // Handle patient_study - it might be an array or a single value
    let patientStudy: SeerlinqStudy[] = [];
    if (patientData.patient_study) {
      if (Array.isArray(patientData.patient_study)) {
        patientStudy = patientData.patient_study.filter((s: any) => s !== null);
      } else if (patientData.patient_study[0]) {
        patientStudy = [patientData.patient_study[0]];
      }
    }

    const newPatient: MinimalPatientResponse = {
      patient_id: patientId,
      name: patientData.name || "New Patient",
      email: patientData.email || `patient${patientId}@example.com`,
      country: patientData.country || "SK",
      region: patientData.region || "BA",
      patient_study: patientStudy.length > 0 ? patientStudy : [],
      informed_consent:
        (patientData.informed_consent as InformedConsent) ||
        InformedConsent.none,
    };
    this.patients.push(newPatient);
    console.log("[MOCK STORE] Added patient:", newPatient);
    console.log("[MOCK STORE] Total patients:", this.patients.length);

    // Initialize mock data for new patient
    this.initializeMockData(patientId);

    return patientId;
  }

  // Add a patient directly without generating a new ID (for initial/default patients)
  addPatientDirectly(patient: MinimalPatientResponse): void {
    // Check if patient already exists
    if (!this.patients.find((p) => p.patient_id === patient.patient_id)) {
      this.patients.push(patient);
      this.usedPatientIds.add(patient.patient_id);
      console.log("[MOCK STORE] Added patient directly:", patient);
      console.log("[MOCK STORE] Total patients:", this.patients.length);

      // Initialize mock data for this patient
      this.initializeMockData(patient.patient_id);
    }
  }

  private initializeMockData(patientId: number) {
    // Initialize medications
    if (!this.medications.has(patientId)) {
      const meds = this.generateMockMedications(patientId);
      this.medications.set(patientId, meds);
    }

    // Initialize symptoms
    if (!this.symptoms.has(patientId)) {
      const syms = this.generateMockSymptoms(patientId);
      this.symptoms.set(patientId, syms);
    }

    // Initialize lab data
    if (!this.labData.has(patientId)) {
      const labs = this.generateMockLabData(patientId);
      this.labData.set(patientId, labs);
    }
  }

  private generateMockMedications(patientId: number): any[] {
    const now = new Date();
    const baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return [
      {
        uuid: generateUUID(),
        patient_id: patientId,
        medication_name: "Metoprolol",
        medication_group: "Beta-blocker",
        medication_dose: 50,
        medication_unit: "mg",
        medication_dosage: [50, 0, 0, 0],
        medication_frequency_regular_repeat_every: 1,
        medication_started: daysAgo(180),
        medication_ended: null,
        comment: "For hypertension",
        created_at: daysAgo(180),
        updated_at: daysAgo(180),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        medication_name: "Lisinopril",
        medication_group: "ACE inhibitor",
        medication_dose: 10,
        medication_unit: "mg",
        medication_dosage: [10, 0, 0, 0],
        medication_frequency_regular_repeat_every: 1,
        medication_started: daysAgo(120),
        medication_ended: null,
        comment: null,
        created_at: daysAgo(120),
        updated_at: daysAgo(120),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        medication_name: "Furosemide",
        medication_group: "Diuretic",
        medication_dose: 40,
        medication_unit: "mg",
        medication_dosage: [40, 0, 0, 0],
        medication_frequency_regular_repeat_every: 1,
        medication_started: daysAgo(90),
        medication_ended: daysAgo(30),
        comment: "Discontinued due to improved condition",
        created_at: daysAgo(90),
        updated_at: daysAgo(30),
      },
    ];
  }

  private generateMockSymptoms(patientId: number): any[] {
    return [
      {
        uuid: generateUUID(),
        patient_id: patientId,
        symptom_datetime: daysAgo(5),
        symptom_name: "shortness of breath",
        symptom_value: 3,
        symptom_change_in_last_six_m: false,
        symptom_change_date: null,
        symptom_value_before: null,
        comment: "Mild shortness of breath during exercise",
        created_at: daysAgo(5),
        updated_at: daysAgo(5),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        symptom_datetime: daysAgo(12),
        symptom_name: "fatigue score",
        symptom_value: 5,
        symptom_change_in_last_six_m: true,
        symptom_change_date: daysAgo(60),
        symptom_value_before: 7,
        comment: "Improved from previous assessment",
        created_at: daysAgo(12),
        updated_at: daysAgo(12),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        symptom_datetime: daysAgo(20),
        symptom_name: "shortness of breath",
        symptom_value: 2,
        symptom_change_in_last_six_m: false,
        symptom_change_date: null,
        symptom_value_before: null,
        comment: null,
        created_at: daysAgo(20),
        updated_at: daysAgo(20),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        symptom_datetime: daysAgo(35),
        symptom_name: "fatigue score",
        symptom_value: 6,
        symptom_change_in_last_six_m: false,
        symptom_change_date: null,
        symptom_value_before: null,
        comment: "Patient reports moderate fatigue",
        created_at: daysAgo(35),
        updated_at: daysAgo(35),
      },
    ];
  }

  private generateMockLabData(patientId: number): any[] {
    return [
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(7),
        measurement_type: "NT-proBNP",
        measurement_value: 1250,
        measurement_unit: "pg/mL",
        comment: "Elevated, monitoring",
        created_at: daysAgo(7),
        updated_at: daysAgo(7),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(7),
        measurement_type: "creatinine",
        measurement_value: 1.2,
        measurement_unit: "mg/dL",
        comment: null,
        created_at: daysAgo(7),
        updated_at: daysAgo(7),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(7),
        measurement_type: "hemoglobin",
        measurement_value: 13.5,
        measurement_unit: "g/dL",
        comment: null,
        created_at: daysAgo(7),
        updated_at: daysAgo(7),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(30),
        measurement_type: "NT-proBNP",
        measurement_value: 980,
        measurement_unit: "pg/mL",
        comment: "Previous measurement",
        created_at: daysAgo(30),
        updated_at: daysAgo(30),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(30),
        measurement_type: "urea",
        measurement_value: 45,
        measurement_unit: "mg/dL",
        comment: null,
        created_at: daysAgo(30),
        updated_at: daysAgo(30),
      },
      {
        uuid: generateUUID(),
        patient_id: patientId,
        measurement_datetime: daysAgo(60),
        measurement_type: "BNP",
        measurement_value: 320,
        measurement_unit: "pg/mL",
        comment: null,
        created_at: daysAgo(60),
        updated_at: daysAgo(60),
      },
    ];
  }

  getPatients(): MinimalPatientResponse[] {
    return [...this.patients];
  }

  getPatient(patientId: number): MinimalPatientResponse | undefined {
    return this.patients.find((p) => p.patient_id === patientId);
  }

  getMedications(patientId: number): any[] {
    this.initializeMockData(patientId);
    return [...(this.medications.get(patientId) || [])];
  }

  getSymptoms(patientId: number): any[] {
    this.initializeMockData(patientId);
    return [...(this.symptoms.get(patientId) || [])];
  }

  getLabData(patientId: number): any[] {
    this.initializeMockData(patientId);
    return [...(this.labData.get(patientId) || [])];
  }

  // Add medication(s)
  addMedications(patientId: number, medications: any[]): any[] {
    this.initializeMockData(patientId);
    const existingMeds = this.medications.get(patientId) || [];
    const newMeds = medications.map((med) => ({
      ...med,
      uuid: med.uuid || generateUUID(),
      patient_id: patientId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    this.medications.set(patientId, [...existingMeds, ...newMeds]);
    console.log("[MOCK STORE] Added medications:", newMeds);
    return newMeds;
  }

  // Update medication
  updateMedication(uuid: string, updates: any): any | null {
    for (const [patientId, meds] of this.medications.entries()) {
      const index = meds.findIndex((m) => m.uuid === uuid);
      if (index !== -1) {
        meds[index] = {
          ...meds[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        console.log("[MOCK STORE] Updated medication:", meds[index]);
        return meds[index];
      }
    }
    return null;
  }

  // Delete medication
  deleteMedication(uuid: string): boolean {
    for (const [patientId, meds] of this.medications.entries()) {
      const index = meds.findIndex((m) => m.uuid === uuid);
      if (index !== -1) {
        meds.splice(index, 1);
        console.log("[MOCK STORE] Deleted medication:", uuid);
        return true;
      }
    }
    return false;
  }

  // Add symptom(s)
  addSymptoms(patientId: number, symptoms: any[]): any[] {
    this.initializeMockData(patientId);
    const existingSymptoms = this.symptoms.get(patientId) || [];
    const newSymptoms = symptoms.map((sym) => ({
      ...sym,
      uuid: sym.uuid || generateUUID(),
      patient_id: patientId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    this.symptoms.set(patientId, [...existingSymptoms, ...newSymptoms]);
    console.log("[MOCK STORE] Added symptoms:", newSymptoms);
    return newSymptoms;
  }

  // Update symptom
  updateSymptom(uuid: string, updates: any): any | null {
    for (const [patientId, syms] of this.symptoms.entries()) {
      const index = syms.findIndex((s) => s.uuid === uuid);
      if (index !== -1) {
        syms[index] = {
          ...syms[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        console.log("[MOCK STORE] Updated symptom:", syms[index]);
        return syms[index];
      }
    }
    return null;
  }

  // Delete symptom
  deleteSymptom(uuid: string): boolean {
    for (const [patientId, syms] of this.symptoms.entries()) {
      const index = syms.findIndex((s) => s.uuid === uuid);
      if (index !== -1) {
        syms.splice(index, 1);
        console.log("[MOCK STORE] Deleted symptom:", uuid);
        return true;
      }
    }
    return false;
  }

  // Add lab data
  addLabData(patientId: number, labDataItems: any[]): any[] {
    this.initializeMockData(patientId);
    const existingLabs = this.labData.get(patientId) || [];
    const newLabs = labDataItems.map((lab) => ({
      ...lab,
      uuid: lab.uuid || generateUUID(),
      patient_id: patientId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    this.labData.set(patientId, [...existingLabs, ...newLabs]);
    console.log("[MOCK STORE] Added lab data:", newLabs);
    return newLabs;
  }

  // Update lab data
  updateLabData(uuid: string, updates: any): any | null {
    for (const [patientId, labs] of this.labData.entries()) {
      const index = labs.findIndex((l) => l.uuid === uuid);
      if (index !== -1) {
        labs[index] = {
          ...labs[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        console.log("[MOCK STORE] Updated lab data:", labs[index]);
        return labs[index];
      }
    }
    return null;
  }

  // Delete lab data
  deleteLabData(uuid: string): boolean {
    for (const [patientId, labs] of this.labData.entries()) {
      const index = labs.findIndex((l) => l.uuid === uuid);
      if (index !== -1) {
        labs.splice(index, 1);
        console.log("[MOCK STORE] Deleted lab data:", uuid);
        return true;
      }
    }
    return false;
  }
}

const mockStore = new MockDataStore();

// Export the store for use by mock-client
export { mockStore };

// Auth endpoints
export async function apiPostAuthLogin(options?: any): Promise<{ data: any }> {
  console.log("[MOCK] apiPostAuthLogin", options?.body);
  return mockResponse({ success: true });
}

export async function apiGetAuthLogout(options?: any): Promise<{ data: any }> {
  console.log("[MOCK] apiGetAuthLogout");
  return mockResponse({ success: true });
}

export async function apiGetAuthRefresh(options?: any): Promise<{ data: any }> {
  console.log("[MOCK] apiGetAuthRefresh");
  return mockResponse({ success: true });
}

// User endpoints
export async function apiGetUsersMe(): Promise<{ data: FullUserResponse }> {
  console.log("[MOCK] apiGetUsersMe");
  // seerlinq-user is level 3, so users can navigate to patient pages after adding
  return mockResponse({
    uuid: "mock-user-uuid",
    username: "mockuser",
    role: UserRole["seerlinq-user"], // Level 3 user
    access_policy: { monitoring_active: true },
  });
}

export async function apiGetUsers(options?: any): Promise<{
  data: { users: UserResponseManaging[] };
}> {
  console.log("[MOCK] apiGetUsers", options?.query);
  return mockResponse({
    users: [
      {
        uuid: "mock-user-1",
        username: "user1",
        role: UserRole["seerlinq-user"],
        access_policy: { monitoring_active: true },
      },
    ],
  });
}

export async function apiGetUsersPhysicians(): Promise<{
  data: { users: UserResponseManaging[] };
}> {
  console.log("[MOCK] apiGetUsersPhysicians");
  return mockResponse({
    users: [
      {
        uuid: "mock-physician-1",
        username: "physician1",
        role: UserRole.physician,
        access_policy: { monitoring_active: true },
      },
    ],
  });
}

export async function apiGetUsersMonitoringUsers(options?: any): Promise<{
  data: { users: UserResponseManaging[] };
}> {
  console.log("[MOCK] apiGetUsersMonitoringUsers", options?.query);
  return mockResponse({
    users: [
      {
        uuid: "mock-monitoring-user-1",
        username: "monitoring1",
        role: UserRole["seerlinq-user"],
        access_policy: { monitoring_active: true },
      },
    ],
  });
}

export async function apiPostUsersChangePassword(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPostUsersChangePassword");
  return mockResponse({ success: true });
}

export async function apiPutUsersForgotPassword(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPutUsersForgotPassword", options?.body);
  return mockResponse({ success: true });
}

// Info endpoints
export async function apiGetInfo(): Promise<{ data: APIInfoResponse }> {
  console.log("[MOCK] apiGetInfo");
  return mockResponse({
    environment: SeerlinqEnvironments.test,
    version: "1.0.0-mock",
    base_url: "http://localhost:3000",
    server_time_utc: new Date().toISOString(),
    server_time_local: new Date().toISOString(),
  });
}

export async function apiGetLimiters(): Promise<{
  data: AccessLimiterResponse[];
}> {
  console.log("[MOCK] apiGetLimiters");
  return mockResponse([]);
}

// Utils endpoints
export async function apiGetUtilsCountries(): Promise<{
  data: { countries: Record<string, CountrySchema> };
}> {
  console.log("[MOCK] apiGetUtilsCountries");
  return mockResponse({
    countries: {
      SK: {
        code: "SK",
        name: "Slovakia",
        regions: [
          {
            code: "BA",
            name: "Bratislava",
            region_enum_value: 1,
            region_name: "Bratislava",
          },
          {
            code: "KE",
            name: "Košice",
            region_enum_value: 2,
            region_name: "Košice",
          },
        ],
      },
      CZ: {
        code: "CZ",
        name: "Czech Republic",
        regions: [
          {
            code: "PR",
            name: "Prague",
            region_enum_value: 1,
            region_name: "Prague",
          },
          {
            code: "BR",
            name: "Brno",
            region_enum_value: 2,
            region_name: "Brno",
          },
        ],
      },
    },
  });
}

// Patient endpoints
export async function apiGetPatientsMinimal(): Promise<{
  data: { patients: MinimalPatientResponse[] };
}> {
  console.log("[MOCK] apiGetPatientsMinimal");
  const patients = mockStore.getPatients();
  // Initialize with default patients if store is empty
  if (patients.length === 0) {
    const defaultPatients: MinimalPatientResponse[] = [
      {
        patient_id: 3421,
        name: "John Smith",
        email: "john.smith@example.com",
        country: "SK",
        region: "BA",
        patient_study: [SeerlinqStudy.commercial],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 7.5,
      },
      {
        patient_id: 7892,
        name: "Maria Garcia",
        email: "maria.garcia@example.com",
        country: "SK",
        region: "KE",
        patient_study: [SeerlinqStudy.sq_validation_study],
        informed_consent: InformedConsent.paper,
        clinical_risk_score: 4.2,
      },
      {
        patient_id: 1567,
        name: "Petr Novák",
        email: "petr.novak@example.com",
        country: "CZ",
        region: "PR",
        patient_study: [SeerlinqStudy.stop_dhf],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 9.1,
      },
      {
        patient_id: 9234,
        name: "Anna Kowalska",
        email: "anna.kowalska@example.com",
        country: "CZ",
        region: "BR",
        patient_study: [SeerlinqStudy.clinic_single],
        informed_consent: InformedConsent.paper,
        clinical_risk_score: 2.8,
      },
      {
        patient_id: 5671,
        name: "Tomáš Horváth",
        email: "tomas.horvath@example.com",
        country: "SK",
        region: "BA",
        patient_study: [SeerlinqStudy.seerlinq_lhc],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 6.3,
      },
      {
        patient_id: 4123,
        name: "Eva Svobodová",
        email: "eva.svobodova@example.com",
        country: "CZ",
        region: "PR",
        patient_study: [SeerlinqStudy.test_monitoring],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 5.7,
      },
      {
        patient_id: 6785,
        name: "Ján Kováč",
        email: "jan.kovac@example.com",
        country: "SK",
        region: "KE",
        patient_study: [],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 3.4,
      },
      {
        patient_id: 8456,
        name: "Lucie Procházková",
        email: "lucie.prochazkova@example.com",
        country: "CZ",
        region: "BR",
        patient_study: [
          SeerlinqStudy.commercial,
          SeerlinqStudy.test_monitoring,
        ],
        informed_consent: InformedConsent.telemonitoring,
        clinical_risk_score: 8.9,
      },
    ];
    // Add default patients to store so they persist
    defaultPatients.forEach((patient) => {
      mockStore.addPatientDirectly(patient);
    });
    return mockResponse({
      patients: defaultPatients,
    });
  }
  return mockResponse({ patients });
}

export async function apiGetPatientsPatientId(options?: any): Promise<{
  data: Level3PatientResponse;
}> {
  console.log("[MOCK] apiGetPatientsPatientId", options?.path);
  const patientId = options?.path?.patient_id;
  const storedPatient = patientId ? mockStore.getPatient(patientId) : null;

  if (storedPatient) {
    return mockResponse({
      patient_id: storedPatient.patient_id,
      name: storedPatient.name,
      email: storedPatient.email,
      date_of_birth: "1990-01-01",
      sex: "M" as any,
      race: "White" as any,
      country: storedPatient.country,
      region: storedPatient.region,
      patient_study: storedPatient.patient_study,
      informed_consent: storedPatient.informed_consent,
      state: PatientState.normal,
      status: PatientStatus.active,
    });
  }

  return mockResponse({
    patient_id: patientId || 1,
    name: "Mock Patient",
    email: "patient@example.com",
    date_of_birth: "1990-01-01",
    sex: "M" as any,
    race: "White" as any,
    country: "SK",
    region: "BA",
    patient_study: [],
    informed_consent: InformedConsent.telemonitoring,
    state: PatientState.normal,
    status: PatientStatus.active,
  });
}

export async function apiPutPatientsPatientId(options?: any): Promise<{
  data: Level3PatientResponse;
}> {
  console.log("[MOCK] apiPutPatientsPatientId", options?.path, options?.body);
  return apiGetPatientsPatientId(options);
}

export async function apiPostPatients(options?: any): Promise<{
  data: { patient_id: number };
}> {
  console.log("[MOCK] apiPostPatients", options?.body);
  const patientId = mockStore.addPatient(options?.body || {});
  return mockResponse({ patient_id: patientId });
}

export async function apiPostPatientsPatientAndUser(options?: any): Promise<{
  data: { patient: { patient_id: number } };
}> {
  console.log("[MOCK] apiPostPatientsPatientAndUser", options?.body);
  const patientId = mockStore.addPatient(options?.body || {});
  return mockResponse({
    patient: { patient_id: patientId },
  });
}

export async function apiPostPatientsPatientIdUser(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPostPatientsPatientIdUser", options?.path);
  return mockResponse({ success: true });
}

export async function apiPutPatientsPatientIdApproveConsentPaper(
  options?: any,
): Promise<{ data: any }> {
  console.log("[MOCK] apiPutPatientsPatientIdApproveConsentPaper");
  return mockResponse({ success: true });
}

export async function apiPutPatientsPatientIdRevokeConsentPaper(
  options?: any,
): Promise<{ data: any }> {
  console.log("[MOCK] apiPutPatientsPatientIdRevokeConsentPaper");
  return mockResponse({ success: true });
}

export async function apiPutPatientsPatientIdApproveConsentTelemonitoring(
  options?: any,
): Promise<{ data: any }> {
  console.log("[MOCK] apiPutPatientsPatientIdApproveConsentTelemonitoring");
  return mockResponse({ success: true });
}

export async function apiPutPatientsPatientIdRevokeConsentTelemonitoring(
  options?: any,
): Promise<{ data: any }> {
  console.log("[MOCK] apiPutPatientsPatientIdRevokeConsentTelemonitoring");
  return mockResponse({ success: true });
}

export async function apiGetPatientsPatientIdComputed(options?: any): Promise<{
  data: {
    results?: number;
    computed_data?: SeerlinqComputedWithPPGResponse[];
    [key: string]: any;
  };
}> {
  console.log("[MOCK] apiGetPatientsPatientIdComputed", options?.path);
  return mockResponse({ results: 0, computed_data: [] });
}

export async function apiGetPatientsPatientIdDerived(options?: any): Promise<{
  data: { derived_data: any[]; [key: string]: any };
}> {
  console.log("[MOCK] apiGetPatientsPatientIdDerived", options?.path);
  return mockResponse({ derived_data: [] });
}

export async function apiGetPatientsPatientIdHealthPro(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiGetPatientsPatientIdHealthPro", options?.path);
  return mockResponse({ reports: [] });
}

export async function apiGetPatientsPatientIdMonitoringInfo(
  options?: any,
): Promise<{
  data: Level3ClinicalPatientResponse & {
    last_ppg?: string | null;
    report_start_date?: string | null;
    last_5_dris?: Array<[string, number]>;
    [key: string]: any;
  };
}> {
  console.log("[MOCK] apiGetPatientsPatientIdMonitoringInfo", options?.path);
  return mockResponse({
    patient_id: options?.path?.patient_id || 1,
    name: "Mock Patient",
    email: "patient@example.com",
    date_of_birth: "1990-01-01",
    sex: "M" as any,
    race: "White" as any,
    country: "SK",
    region: "BA",
    patient_study: [],
    informed_consent: InformedConsent.telemonitoring,
    state: PatientState.normal,
    status: PatientStatus.active,
    monitoring_watch_kind: "none" as any,
    monitoring_watch_status: "not_watching" as any,
    last_ppg: null,
    report_start_date: null,
    last_5_dris: [],
  });
}

export async function apiGetPatientsPatientIdMedications(
  options?: any,
): Promise<{
  data: { medications: DefaultMedicationSchemaResponse[] };
}> {
  console.log("[MOCK] apiGetPatientsPatientIdMedications", options?.path);
  const patientId = options?.path?.patient_id || 1;
  const medications = mockStore.getMedications(patientId);
  return mockResponse({ medications });
}

// Physician endpoints
export async function apiGetPhysicians(options?: any): Promise<{
  data: { physicians: PhysicianWithPatientsResponse[] };
}> {
  console.log("[MOCK] apiGetPhysicians", options?.query);
  return mockResponse({
    physicians: [
      {
        uuid: "mock-physician-1",
        name: "Dr. Mock",
        email: "physician@example.com",
        country: "SK",
        region: "BA",
        patient_count: 0,
      },
    ],
  });
}

// Vitals endpoints
export async function apiGetHfVitalsPatientId(options?: any): Promise<{
  data: { medical_data: any[]; [key: string]: any };
}> {
  console.log("[MOCK] apiGetHfVitalsPatientId", options?.path);
  return mockResponse({ medical_data: [] });
}

// Symptoms endpoints
export async function apiGetHfSymptomsPatientId(options?: any): Promise<{
  data: { symptoms: any[]; [key: string]: any };
}> {
  console.log("[MOCK] apiGetHfSymptomsPatientId", options?.path);
  const patientId = options?.path?.patient_id || 1;
  const symptoms = mockStore.getSymptoms(patientId);
  return mockResponse({
    symptoms,
  });
}

export async function apiGetSymptomsList(options?: any): Promise<{
  data: { symptoms: SupportedSymptom[] };
}> {
  console.log("[MOCK] apiGetSymptomsList");
  return mockResponse({
    symptoms: [
      {
        data_name: "shortness of breath",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
      {
        data_name: "fatigue score",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
      {
        data_name: "orthopnea",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4"],
        },
      },
      {
        data_name: "paroxysmal nocturnal dyspnea",
        data_value: { value_type: "enum" as const, values_enum: ["0", "1"] },
      },
      {
        data_name: "edema",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4"],
        },
      },
      {
        data_name: "chest pain",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
      {
        data_name: "palpitations",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
      {
        data_name: "dizziness",
        data_value: {
          value_type: "enum" as const,
          values_enum: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
    ],
  });
}

// Labs endpoints
export async function apiGetHfLabDataPatientId(options?: any): Promise<{
  data: { medical_data: any[]; [key: string]: any };
}> {
  console.log("[MOCK] apiGetHfLabDataPatientId", options?.path);
  const patientId = options?.path?.patient_id || 1;
  const medicalData = mockStore.getLabData(patientId);
  return mockResponse({
    medical_data: medicalData,
  });
}

// Medical data endpoints
export async function apiGetMedicaldataList(options?: any): Promise<{
  data: { medical_data: SupportedMedicalData[] };
}> {
  console.log("[MOCK] apiGetMedicaldataList");
  return mockResponse({
    medical_data: [
      {
        data_name: "NT-proBNP",
        data_category: "labs",
        primary_unit: "pg/mL",
        all_units: ["pg/mL", "pmol/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "BNP",
        data_category: "labs",
        primary_unit: "pg/mL",
        all_units: ["pg/mL", "pmol/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "creatinine",
        data_category: "labs",
        primary_unit: "mg/dL",
        all_units: ["mg/dL", "μmol/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "urea",
        data_category: "labs",
        primary_unit: "mg/dL",
        all_units: ["mg/dL", "mmol/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "hemoglobin",
        data_category: "labs",
        primary_unit: "g/dL",
        all_units: ["g/dL", "g/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "hematocrit",
        data_category: "labs",
        primary_unit: "%",
        all_units: ["%"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "potassium",
        data_category: "labs",
        primary_unit: "mmol/L",
        all_units: ["mmol/L", "mEq/L"],
        data_value: { value_type: "float" as const },
      },
      {
        data_name: "sodium",
        data_category: "labs",
        primary_unit: "mmol/L",
        all_units: ["mmol/L", "mEq/L"],
        data_value: { value_type: "float" as const },
      },
    ],
  });
}

export async function apiGetMedicaldataListWithQuery(options?: any): Promise<{
  data: ListMedicalDataResponse;
}> {
  console.log("[MOCK] apiGetMedicaldataListWithQuery", options?.query);
  return mockResponse({
    data: [],
    pagination: {
      total_items: 0,
      total_pages: 0,
      page: 1,
      page_size: 10,
    },
  });
}

// Diagnoses endpoints
export async function apiGetDiagnosesList(options?: any): Promise<{
  data: { diagnoses: SupportedDiagnosis[] };
}> {
  console.log("[MOCK] apiGetDiagnosesList");
  return mockResponse({ diagnoses: [] });
}

// Schedules endpoints
export async function apiGetSchedules(options?: any): Promise<{
  data: { schedules: PatientScheduleResponse[] };
}> {
  console.log("[MOCK] apiGetSchedules", options?.query);
  return mockResponse({ schedules: [] });
}

export async function apiPostSchedules(options?: any): Promise<{
  data: PatientScheduleResponse;
}> {
  console.log("[MOCK] apiPostSchedules", options?.body);
  return mockResponse({
    uuid: "mock-schedule-uuid",
    patient_id: 1,
    day: "monday" as any,
    time: "10:00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function apiPutSchedulesUuid(options?: any): Promise<{
  data: PatientScheduleResponse;
}> {
  console.log("[MOCK] apiPutSchedulesUuid", options?.path);
  return mockResponse({
    uuid: options?.path?.uuid || "mock-schedule-uuid",
    patient_id: 1,
    day: "monday" as any,
    time: "10:00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
}

export async function apiDeleteSchedulesUuid(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiDeleteSchedulesUuid", options?.path);
  return mockResponse({ success: true });
}

// Clinical studies endpoints
export async function apiGetClinicalStudies(options?: any): Promise<{
  data: { study_enrollments: any[]; [key: string]: any };
}> {
  console.log("[MOCK] apiGetClinicalStudies", options?.query);
  return mockResponse({ study_enrollments: [] });
}

// Computed/Derived endpoints
export async function apiPutComputedUuid(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPutComputedUuid", options?.path);
  return mockResponse({ success: true });
}

export async function apiPutDerivedUuid(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPutDerivedUuid", options?.path);
  return mockResponse({ success: true });
}

// Alerts endpoints
export async function apiPutAlertsMarkAllSeenPatientId(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPutAlertsMarkAllSeenPatientId", options?.path);
  return mockResponse({ success: true });
}

export async function apiPutAlertsMarkSeenUuid(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiPutAlertsMarkSeenUuid", options?.path);
  return mockResponse({ success: true });
}

// Labelstudio endpoints
export async function apiGetLabelstudioTaskProjectIdPpgUuid(
  options?: any,
): Promise<{ data: any }> {
  console.log("[MOCK] apiGetLabelstudioTaskProjectIdPpgUuid", options?.path);
  return mockResponse({});
}

// Quick look / Tasks endpoints
export async function apiPostTasksWorkerQuicklookPatient(
  options?: any,
): Promise<{
  data: { task_id: string };
}> {
  console.log("[MOCK] apiPostTasksWorkerQuicklookPatient", options?.body);
  return mockResponse({ task_id: "mock-task-id" });
}

export async function apiPostTasksWorkerQuicklookPpg(options?: any): Promise<{
  data: { task_id: string };
}> {
  console.log("[MOCK] apiPostTasksWorkerQuicklookPpg", options?.body);
  return mockResponse({ task_id: "mock-task-id" });
}

export async function apiGetTasksWorkerStatusTaskId(options?: any): Promise<{
  data: { status: string; state: string; [key: string]: any };
}> {
  console.log("[MOCK] apiGetTasksWorkerStatusTaskId", options?.path);
  return mockResponse({ status: "completed", state: "success" });
}

export async function apiGetTasksWorkerResultTaskId(options?: any): Promise<{
  data: any;
}> {
  console.log("[MOCK] apiGetTasksWorkerResultTaskId", options?.path);
  return mockResponse({});
}

export async function apiGetTasksWorkerQuicklookShareTaskId(
  options?: any,
): Promise<{
  data: { share_url: string; shareable_link: string; [key: string]: any };
}> {
  console.log("[MOCK] apiGetTasksWorkerQuicklookShareTaskId", options?.path);
  return mockResponse({
    share_url: "https://mock-share-url.com",
    shareable_link: "https://mock-share-url.com",
  });
}

export async function apiPutTasksWorkerQuicklookHeartcorePatientId(
  options?: any,
): Promise<{ data: any }> {
  console.log(
    "[MOCK] apiPutTasksWorkerQuicklookHeartcorePatientId",
    options?.path,
  );
  return mockResponse({ success: true });
}
