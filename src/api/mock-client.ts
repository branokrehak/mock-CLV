// Simplified mock client - replaces @hey-api/client-fetch client

import { mockStore } from "./mock-api";

export interface MockClientConfig {
  baseUrl?: string;
  credentials?: RequestCredentials;
  throwOnError?: boolean;
  fetch?: (request: Request) => Promise<Response>;
}

class MockClient {
  private config: MockClientConfig = {
    baseUrl: "http://localhost:3000",
    credentials: "include",
    throwOnError: true,
  };
  private customFetch?: (request: Request) => Promise<Response>;

  setConfig(config: MockClientConfig) {
    this.config = { ...this.config, ...config };
    this.customFetch = config.fetch;
    console.log("[MOCK CLIENT] Config updated", this.config);
  }

  async get(options: { url: string; query?: any; headers?: any }): Promise<{
    data: any;
  }> {
    console.log("[MOCK CLIENT] GET", options.url, options.query);
    return { data: {} };
  }

  async post(options: {
    url: string;
    body?: any;
    headers?: any;
  }): Promise<{ data: any }> {
    console.log("[MOCK CLIENT] POST", options.url, options.body);

    const url = options.url;
    const body = options.body;

    // Handle bulk medication add: /api/v1/medications/bulk
    if (url.includes("/medications/bulk") && body?.medications) {
      const patientId = body.medications[0]?.patient_id;
      if (patientId) {
        const added = mockStore.addMedications(patientId, body.medications);
        return { data: { success: true, medications: added } };
      }
    }

    // Handle bulk lab data add: /api/v1/hf/data
    if (url.includes("/hf/data") && body?.medical_data) {
      const patientId = body.medical_data[0]?.patient_id;
      if (patientId) {
        const added = mockStore.addLabData(patientId, body.medical_data);
        return { data: { success: true, medical_data: added } };
      }
    }

    // Handle bulk symptom add: /api/v1/hf/symptoms
    if (url.includes("/hf/symptoms") && body?.symptoms) {
      const patientId = body.symptoms[0]?.patient_id;
      if (patientId) {
        const added = mockStore.addSymptoms(patientId, body.symptoms);
        return { data: { success: true, symptoms: added } };
      }
    }

    // Return success response for other postBulk operations
    return { data: { success: true } };
  }

  async put(options: {
    url: string;
    body?: any;
    headers?: any;
  }): Promise<{ data: any }> {
    console.log("[MOCK CLIENT] PUT", options.url, options.body);

    const url = options.url;
    const body = options.body;

    // Extract UUID from URL patterns like /api/v1/medications/{uuid}
    const uuidMatch = url.match(
      /\/api\/v1\/(medications|medicaldata|symptoms)\/([^/]+)$/,
    );

    if (uuidMatch) {
      const [, endpoint, uuid] = uuidMatch;

      switch (endpoint) {
        case "medications": {
          const updated = mockStore.updateMedication(uuid, body);
          return { data: updated || { success: true } };
        }
        case "medicaldata": {
          const updated = mockStore.updateLabData(uuid, body);
          return { data: updated || { success: true } };
        }
        case "symptoms": {
          const updated = mockStore.updateSymptom(uuid, body);
          return { data: updated || { success: true } };
        }
      }
    }

    // Handle medication change: /api/v1/medications/change/{uuid}
    const changeMatch = url.match(/\/api\/v1\/medications\/change\/([^/]+)$/);
    if (changeMatch) {
      const uuid = changeMatch[1];
      const updated = mockStore.updateMedication(uuid, body);
      return { data: updated || { success: true } };
    }

    return { data: { success: true } };
  }

  async delete(options: { url: string; headers?: any }): Promise<{
    data: any;
  }> {
    console.log("[MOCK CLIENT] DELETE", options.url);

    const url = options.url;

    // Extract UUID from URL patterns like /api/v1/medications/{uuid}
    const uuidMatch = url.match(
      /\/api\/v1\/(medications|medicaldata|symptoms)\/([^/]+)$/,
    );

    if (uuidMatch) {
      const [, endpoint, uuid] = uuidMatch;

      switch (endpoint) {
        case "medications": {
          mockStore.deleteMedication(uuid);
          break;
        }
        case "medicaldata": {
          mockStore.deleteLabData(uuid);
          break;
        }
        case "symptoms": {
          mockStore.deleteSymptom(uuid);
          break;
        }
      }
    }

    return { data: { success: true } };
  }

  // Mock interceptors - no-op but compatible with api-connector usage
  interceptors = {
    request: {
      use: (handler: any) => {
        // No-op for mocks
      },
      eject: (handler: any) => {
        // No-op for mocks
      },
    },
    response: {
      use: (handler: any) => {
        // No-op for mocks
      },
      eject: (handler: any) => {
        // No-op for mocks
      },
    },
    error: {
      use: (handler: any) => {
        // No-op for mocks
      },
      eject: (handler: any) => {
        // No-op for mocks
      },
    },
  };
}

export const client = new MockClient();
