import { ApiConnector } from "../api/api-connector";
import { defaultApiPageSize } from "../constants/constants";
import { DataModel } from "./data-model";

export abstract class APIDataModel<
  T extends object = any,
> extends DataModel<T> {
  totalItems: number = null;
  initialized = false;
  loading = false;

  constructor(public api: ApiConnector) {
    super([], api.userLevel, api.userUUID);
    this.rowsPerPage = defaultApiPageSize;
  }

  async init() {
    super.init();
    await this.refetch();
    this.initialized = true;
  }

  changeRowsPerPage(value: number) {
    super.changeRowsPerPage(value);
    void this.refetch();
  }

  protected setCurrentPage(page: number) {
    super.setCurrentPage(page);
    void this.refetch();
  }

  protected setTotalPages() {
    // Noop
  }

  async refetch() {
    this.loading = true;
    const res = await this.fetchPage(this.currentPage, this.rowsPerPage);
    this.data = res.data;
    this.totalItems = res.pagination.total_items;
    this.totalPages = res.pagination.total_pages;
    this.computeData();
    this.loading = false;
  }

  protected abstract fetchPage(
    page: number,
    rowsPerPage: number,
  ): Promise<PageFetchResult<T>>;

  protected sliceForCurrentPage<T>(data: T[]): T[] {
    return data; // No slicing, we always only have the current page
  }
}

export interface PageFetchResult<T> {
  data: T[];
  pagination: {
    total_pages: number;
    total_items: number;
  };
}
