import { reactive } from "@vue/reactivity";
import {
  apiGetPhysicians,
  apiPostPatients,
  apiPostPatientsPatientAndUser,
} from "../../api";
import { ApiConnector } from "../../api/api-connector";
import { DataAdd } from "../../models/data-add";
import { Physicians, toPhysiciansItem } from "./common/physicians";
import { Users } from "./common/users";

export class AddPatient extends DataAdd {
  createUser = false;
  dataUser = { preferred_language: "sk", token_expiry_timedelta: "P1D" };

  // constants
  constructor(api: ApiConnector, patient: any) {
    super(api, patient);
    this.addingList = {
      patient_study: [null],
      date_of_birth: null,
      sex: null,
      height: null,
      description: null,
      country: null,
      region: null,
      race: "Unknown / Not Reported",
      name: null,
      residence: "N/A",
      health_insurance: null,
      id_number: null,
      email: null,
      phone: null,
      monitoring_users: [],
      append_to_physicians: [],
      append_to_managing_users: [],
    };
  }

  createPhysicians() {
    const physicians = reactive(
      new Physicians([], this.api.userLevel, this.api.userUUID),
    );

    void apiGetPhysicians().then((res) => {
      physicians.data = res.data.physicians.map(toPhysiciansItem);
      physicians.init();
    });

    return physicians;
  }

  createUsers() {
    const users = reactive(new Users(this.api));

    void users.initPhysiciansOnly();

    return users;
  }

  createMonitoringUsers(country?: string) {
    const monitoringUsers = reactive(new Users(this.api));

    // All users see monitoring users filtered by country if provided
    // Backend handles access policy filtering automatically
    void monitoringUsers.initMonitoringUsers(country);

    return monitoringUsers;
  }

  async post() {
    let newPatId: number;

    if (this.createUser) {
      const response = await apiPostPatientsPatientAndUser({
        body: {
          ...this.addingList,
          ...this.dataUser,
        },
      });
      newPatId = response.data.patient.patient_id;
    } else {
      const response = await apiPostPatients({ body: this.addingList });
      newPatId = response.data.patient_id;
    }

    if (this.api.userLevel > 2) {
      window.navigate(`/patient/${newPatId}`);
    } else {
      alert(
        "Patient was added. You will have access to patient data once the patient gives consent.",
      );
      window.navigate("/");
    }
  }
}
