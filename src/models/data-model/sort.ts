import { compareString } from "../../utils/utils";

export type SortDir = "asc" | "desc";

export class Sort<T> {
  constructor(
    readonly attr: keyof T,
    readonly type: string,
    public dir: SortDir,
  ) {}

  compare(a: T, b: T): number {
    const dir = this.dir === "asc" ? 1 : -1;

    if (this.type === "date") {
      const dateA = new Date(a[this.attr] as string);
      const dateB = new Date(b[this.attr] as string);
      return dateA > dateB ? dir : dateA < dateB ? -dir : 0;
    } else if (this.type === "string") {
      return (
        compareString(
          (a[this.attr] as string) ?? "",
          (b[this.attr] as string) ?? "",
        ) * dir
      );
    } else {
      return a[this.attr] > b[this.attr]
        ? dir
        : a[this.attr] < b[this.attr]
          ? -dir
          : 0;
    }
  }

  serialize(): SortSerialized<T> {
    return {
      type: "Sort",
      attr: this.attr,
      attrType: this.type,
      dir: this.dir,
    };
  }

  static deserialize<T>(serialized: SortSerialized<T>): Sort<T> {
    return new Sort(serialized.attr, serialized.attrType, serialized.dir);
  }
}

export interface SortSerialized<T> {
  type: "Sort";
  attr: keyof T;
  attrType: string;
  dir: SortDir;
}
