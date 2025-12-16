import { Filter } from "./filter";

export class SimpleQueryFilter<T> implements Filter<T> {
  query = "";

  constructor(
    readonly attr: keyof T,
    private filterFn: QueryFilterFn = standardFilter,
  ) {}

  filter(item: T) {
    return this.filterFn(item[this.attr], this.query);
  }
}

export type QueryFilterFn = (value: unknown, query: string) => boolean;

export const standardFilter: QueryFilterFn = (
  value: unknown,
  query: string,
): boolean => {
  if (query === "") {
    return true;
  }

  const valueTokens = normalize(value).split(" ");
  const queryTokens = normalize(query).split(" ");

  return queryTokens.every((queryToken) =>
    valueTokens.some((valueToken) => valueToken.startsWith(queryToken)),
  );
};

export const idFilter: QueryFilterFn = (
  value: unknown,
  query: string,
): boolean => {
  return query === "" || normalize(value).includes(normalize(query));
};

function normalize(str: unknown): string {
  return String(str)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
