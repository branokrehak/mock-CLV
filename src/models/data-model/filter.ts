export interface Filter<T> {
  filter(item: T): boolean;
}
