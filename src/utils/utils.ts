import { toRaw } from "@vue/reactivity";

export function parseDatetimeToLocal(datetime: Date | string) {
  datetime = new Date(datetime);
  const localDatetime = new Date(
    datetime.getTime() - datetime.getTimezoneOffset() * 60000,
  );
  return localDatetime.toISOString().slice(0, 19).replace("T", " ");
}

export function dateToISOString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function dateTimeOrNull(
  dateString: string,
  isDateTime: boolean = true,
  locale: string = "sk-SK",
) {
  if (dateString === null || dateString === undefined || dateString === "") {
    return null;
  }
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return Intl.DateTimeFormat(
      locale,
      isDateTime
        ? {
            dateStyle: "short",
            timeStyle: "medium",
          }
        : {},
    ).format(date);
  } else {
    return null;
  }
}

export function floatRounding(value: number | string, decimals: number = 1) {
  if (typeof value === "number") {
    return value.toFixed(decimals);
  }
  return value;
}

/** Useful for inspecting reactive objects (otherwise we just see Proxy on the console). */
export function toRawDeep<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(toRawDeep) as T;
  }

  const rawObj = toRaw(obj) as T;
  const newObj = {} as T;

  for (const key in rawObj) {
    if (rawObj.hasOwnProperty(key)) {
      newObj[key] = toRawDeep(rawObj[key]);
    }
  }

  return newObj;
}

export function resolveNestedProperty(obj: object, path: string) {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
}

export function uniques<T>(list: T[]): T[] {
  return [...new Set(list)];
}

export class Deferral {
  promise: Promise<void>;

  constructor() {
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }

  resolve: () => void;

  reject: (error?: unknown) => void;
}

/** Transpose 2D array. Works with variable length rows as well. */
export function transpose<T>(matrix: T[][]) {
  const maxRows = Math.max(...matrix.map((a) => a.length));
  const res: T[][] = [];

  for (let i = 0; i < maxRows; i++) {
    res.push(matrix.map((row) => row[i]));
  }

  return res;
}

export function compareString(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}
