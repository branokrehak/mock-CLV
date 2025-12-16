import {
  apiGetTasksWorkerQuicklookShareTaskId,
  apiGetTasksWorkerResultTaskId,
  apiGetTasksWorkerStatusTaskId,
  apiPostTasksWorkerQuicklookPatient,
  apiPostTasksWorkerQuicklookPpg,
  apiPutTasksWorkerQuicklookHeartcorePatientId,
  QuickLookTasks,
} from "../api";
import { ApiConnector } from "../api/api-connector";

export type HeartCoreRangeMonths = 3 | 6 | 9 | 12;

export abstract class QuickLook {
  analysisType: QuickLookTasks = null;
  processing = false;
  resultUrl = "";
  taskId = null;
  sharedAnalysisUrl = "";
  sharePopupOpen = false;

  quicklookIntervalId = null;

  constructor(protected api: ApiConnector) {}

  quickLookURL() {
    return `${this.api.versionedRoute()}/tasks/worker/quicklook/${this.taskId}`;
  }

  reset() {
    this.processing = false;
    this.resultUrl = "";
    this.taskId = null;
    this.sharedAnalysisUrl = "";
    this.sharePopupOpen = false;
  }

  abstract submit(): Promise<void>;

  async getHandledException() {
    const responseException = await apiGetTasksWorkerResultTaskId({
      path: { task_id: this.taskId },
    });

    const reason = responseException.data.handled_exception
      ? `\n${responseException.data.handled_exception.title}: ${responseException.data.handled_exception.details}`
      : "";

    return `Task with ID ${this.taskId} failed.` + reason;
  }

  checkStatus() {
    this.quicklookIntervalId = setInterval(async () => {
      const response = await apiGetTasksWorkerStatusTaskId({
        path: { task_id: this.taskId },
      });

      if (response.data.state === "success") {
        clearInterval(this.quicklookIntervalId);
        this.taskReady();
      } else if (response.data.state === "failure") {
        const alertText = await this.getHandledException();
        alert(alertText);
        this.reset();
        clearInterval(this.quicklookIntervalId);
      }
    }, 2000);
  }

  taskReady() {
    this.processing = false;
    this.resultUrl = this.quickLookURL();
  }

  async shareQuickLook() {
    const response = await apiGetTasksWorkerQuicklookShareTaskId({
      path: { task_id: this.taskId },
    });

    this.sharedAnalysisUrl = response.data.shareable_link;
    this.sharePopupOpen = true;
  }
}

export class PPGQuickLook extends QuickLook {
  uuids: string[];

  constructor(
    api: ApiConnector,
    analysisType: QuickLookTasks,
    uuids: string[],
  ) {
    super(api);
    this.analysisType = analysisType;
    this.uuids = uuids;
  }

  async submit() {
    if (this.uuids.length > 10) {
      alert("More than 10 PPGs selected, currently not supported");
      return;
    }
    this.processing = true;

    const response = await apiPostTasksWorkerQuicklookPpg({
      body: {
        task: this.analysisType,
        uuids: this.uuids,
      },
    });
    this.taskId = response.data.task_id;
    this.checkStatus();
  }

  toggleUuid(uuid: string) {
    if (this.uuids.includes(uuid)) {
      this.uuids = this.uuids.filter((p) => p !== uuid);
    } else {
      this.uuids.push(uuid);
    }
  }
}

export class PatientQuickLook extends QuickLook {
  patientId: number;

  constructor(
    api: ApiConnector,
    analysisType: QuickLookTasks,
    patientId: number,
  ) {
    super(api);
    this.analysisType = analysisType;
    this.patientId = patientId;
  }

  async submit() {
    this.processing = true;

    const response = await apiPostTasksWorkerQuicklookPatient({
      body: {
        task: this.analysisType,
        patient_ids: [this.patientId],
      },
    });
    this.taskId = response.data.task_id;
    this.checkStatus();
  }
}

export class HeartCoreQuickLook extends QuickLook {
  patientId: number;
  plotRangeMonths: HeartCoreRangeMonths;
  tableRangeMonths: HeartCoreRangeMonths;

  constructor(
    api: ApiConnector,
    patientId: number,
    plotRangeMonths: HeartCoreRangeMonths = 12,
    tableRangeMonths: HeartCoreRangeMonths = 3,
  ) {
    super(api);
    this.patientId = patientId;
    this.plotRangeMonths = plotRangeMonths;
    this.tableRangeMonths = tableRangeMonths;
  }

  async submit() {
    this.processing = true;

    const response = await apiPutTasksWorkerQuicklookHeartcorePatientId({
      path: { patient_id: this.patientId },
      query: {
        plot_range_months: this.plotRangeMonths,
        table_range_months: this.tableRangeMonths,
      },
    });
    this.taskId = response.data.task_id;
    this.checkStatus();
  }
}
