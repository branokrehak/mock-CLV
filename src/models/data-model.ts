import { reactive } from "@vue/reactivity";
import { cloneDeep, isEqual } from "lodash";
import { EnumFilter, EnumFilterSerialized } from "./data-model/enum-filter";
import { Filter } from "./data-model/filter";
import { Sort, SortSerialized } from "./data-model/sort";
import { AccessRules, TableAccess } from "../constants/roles";

export const defaultRowsPerPage = 25;

export class DataModel<T extends object = any> {
  name: string;
  initialized = false;
  paginatedData: T[] = [];
  hasHistory: boolean = false;
  showingHistory: boolean = false;
  idAttr: keyof T;

  // sorting
  sort?: Sort<T>;

  // filtering
  defaultFilter: Record<string, any[]> = null;
  filters: Filter<T>[] = [];

  // editing
  editingIndex: number;
  editingDraft: any;
  private editingInitialDraft: any;
  private currentlyEditable: (keyof T)[];

  // pagination
  rowsPerPage: number = defaultRowsPerPage;
  rowsPerPageOptions: number[] = [10, 25, 50, 100];
  currentPage: number = 1;
  totalPages: number = null;

  // access
  canShowHistory: boolean = false;
  access: TableAccess = {
    editRules: { 2: AccessRules.owner, 3: AccessRules.visible },
    deleteRules: { 2: AccessRules.none, 3: AccessRules.owner },
    historyMinLevel: 3,
  };

  // selection
  selected: any[] = [];
  selectionMode: SelectionMode;

  constructor(
    public data: T[],
    public userLevel?: number,
    public userUUID?: string,
  ) {}

  private get storageKey() {
    return this.name ? `DataModel.${this.name}` : undefined;
  }

  init() {
    this.canShowHistory =
      this.userLevel != null && this.access.historyMinLevel <= this.userLevel;

    if (!this.initialized) {
      this.applyDefaultFilter();
    }

    this.computeData();
    this.initialized = true;
  }

  updateData(data: T[]) {
    this.data = [...data];
    this.init();
  }

  setDefaultFilter(filter: Record<string, any[]>) {
    this.defaultFilter = filter;
    this.applyDefaultFilter();
  }

  private applyDefaultFilter() {
    if (this.defaultFilter != null) {
      for (const attr in this.defaultFilter) {
        this.getOrAddEnumFilter(attr).selected = this.defaultFilter[attr];
      }
    }
  }

  addFilter(filter: Filter<T>) {
    this.filters.push(filter);
  }

  removeFilter(filter: Filter<T>) {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  }

  getOrAddEnumFilter(attr: string) {
    let filter = this.filters.find(
      (f): f is EnumFilter<T> => f instanceof EnumFilter && f.attr === attr,
    );
    if (!filter) {
      filter = reactive(new EnumFilter(attr as keyof T));
      this.filters.push(filter);
    }
    return filter;
  }

  changeRowsPerPage(value: number) {
    this.rowsPerPage = value;
    this.currentPage = 1;
    this.computeData();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setCurrentPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.setCurrentPage(this.currentPage - 1);
    }
  }

  reload() {
    this.currentPage = 1;
    this.computeData();
  }

  isSelected(id: any) {
    return this.selected.includes(id);
  }

  select(id: any, exclusive: boolean) {
    if (exclusive) {
      this.selected = [id];
    } else if (!this.isSelected(id)) {
      this.selected.push(id);
    }
  }

  deselect(id: any) {
    this.selected = this.selected.filter((i) => i !== id);
  }

  selectAll() {
    const filtered = this.sortFilterData();
    this.selected = filtered.map((item) => item[this.idAttr]);
  }

  deselectAll() {
    this.selected = [];
  }

  protected computeData() {
    const sortedFiltered = this.sortFilterData();
    this.paginatedData = this.sliceForCurrentPage(sortedFiltered);
    this.setTotalPages(
      Math.max(Math.ceil(sortedFiltered.length / this.rowsPerPage), 1),
    );
  }

  protected setCurrentPage(page: number) {
    this.currentPage = page;
    this.computeData();
  }

  protected setTotalPages(pages: number) {
    this.totalPages = pages;
  }

  protected filterItem(item: T) {
    // Children can implement their custom filtering
    return true;
  }

  sortFilterData() {
    let res = this.data;

    // Filter
    res = applyFilters(res, this.filters);
    res = res.filter((item) => this.filterItem(item));

    // Sort
    if (this.sort) {
      res = applySort(res, this.sort);
    }

    return res;
  }

  protected sliceForCurrentPage<T>(data: T[]): T[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return data.slice(start, end);
  }

  startAdding(fields: (keyof T)[]) {
    this.currentlyEditable = fields;
    this.editingDraft = {};
    this.editingInitialDraft = {};
    this.editingIndex = -1;
  }

  startEditing(index: number, fields: (keyof T)[]) {
    this.currentlyEditable = fields;
    const draft = this.prepareDraft(this.paginatedData[index]);
    this.editingDraft = cloneDeep(draft);
    this.editingInitialDraft = cloneDeep(draft);
    this.editingIndex = index;
  }

  stopEditing() {
    this.editingIndex = undefined;
    this.editingDraft = undefined;
    this.editingInitialDraft = undefined;
    this.currentlyEditable = undefined;
  }

  prepareDraft(item: T) {
    return Object.keys(item)
      .filter((key) => this.currentlyEditable?.includes(key as keyof T))
      .reduce((obj, key) => {
        obj[key] = item[key];
        return obj;
      }, {});
  }

  /** Patch contains only changed fields. */
  generatePatch(alwaysIncludeKeys?: string[]) {
    if (!this.editingDraft) {
      return;
    }

    const patch: any = {};

    for (const key in this.editingDraft) {
      const keyToPatch =
        alwaysIncludeKeys?.includes(key) ||
        !isEqual(this.editingDraft[key], this.editingInitialDraft[key]);

      if (keyToPatch) {
        patch[key] = this.editingDraft[key];
      }
    }

    return patch;
  }

  canEditField(fieldName: keyof T, member: object) {
    return (
      !this.currentlyEditable || this.currentlyEditable.includes(fieldName)
    );
  }

  validateItemDelete(item: T): string | undefined {
    if (
      !this.canDelete() ||
      (this.getDeleteRule() === AccessRules.owner &&
        item["user_uuid"] !== this.userUUID)
    ) {
      return "Not authorized";
    }

    return undefined;
  }

  validateItemEdit(item: T): string | undefined {
    if (
      !this.canEdit() ||
      (this.getEditRule() === AccessRules.owner &&
        item["user_uuid"] !== this.userUUID)
    ) {
      return "Not authorized";
    }

    return undefined;
  }

  canDelete() {
    return this.getDeleteRule() !== AccessRules.none;
  }

  canEdit() {
    return this.getEditRule() !== AccessRules.none;
  }

  private getDeleteRule() {
    switch (this.userLevel) {
      case 4:
      case undefined:
        return AccessRules.visible;
      case 3:
      case 2:
        return this.access.deleteRules[this.userLevel];
      default:
        return AccessRules.none;
    }
  }

  private getEditRule() {
    switch (this.userLevel) {
      case 4:
      case undefined:
        return AccessRules.visible;
      case 3:
      case 2:
        return this.access.editRules[this.userLevel];
      default:
        return AccessRules.none;
    }
  }

  toggleHistory() {
    if (this.hasHistory && this.canShowHistory) {
      this.showingHistory = !this.showingHistory;
    }
  }

  saveSettings() {
    if (!this.storageKey) {
      return;
    }

    try {
      const serialized = JSON.stringify(this.serializeSettings());
      sessionStorage.setItem(this.storageKey, serialized);
    } catch (error) {
      console.warn("Cannot persist settings", error);
    }
  }

  loadSettings() {
    if (!this.storageKey) {
      return;
    }

    try {
      const str = sessionStorage.getItem(this.storageKey);
      if (str) {
        const serialized = JSON.parse(str) as SettingsSerialized;
        this.deserializeSettings(serialized);
        this.reload();
      }
    } catch (error) {
      console.warn("Cannot persist settings", error);
    }
  }

  private serializeSettings(): SettingsSerialized {
    return {
      filters: this.filters
        .map((f) => (f instanceof EnumFilter ? f.serialize() : undefined))
        .filter(Boolean),
      sort: this.sort?.serialize(),
    };
  }

  private deserializeSettings(serialized: SettingsSerialized) {
    // Preserve existing non-EnumFilters (like SimpleQueryFilter)
    const nonEnumFilters = this.filters.filter((f) => !(f instanceof EnumFilter));

    const deserializedEnumFilters = serialized.filters
      .map((f) =>
        f.type === "EnumFilter" ? EnumFilter.deserialize(f) : undefined,
      )
      .filter(Boolean);

    // Combine non-enum filters with deserialized enum filters
    this.filters = [...nonEnumFilters, ...deserializedEnumFilters];

    if (serialized.sort) {
      this.sort = Sort.deserialize(serialized.sort);
    }
  }
}

export function applySort<T>(data: T[], sort: Sort<T>): T[] {
  return [...data].sort((a, b) => sort.compare(a, b));
}

export function applyFilters<T>(data: T[], filters: Filter<T>[]): T[] {
  return data.filter((item) =>
    Array.from(filters.values()).every((f) => f.filter(item)),
  );
}

interface SettingsSerialized {
  filters: EnumFilterSerialized<any>[];
  sort?: SortSerialized<any>;
}

export type SelectionMode = "single" | "multi";
