import { Filter } from "./filter";

export class EnumFilter<T> implements Filter<T> {
  constructor(
    readonly attr: keyof T,
    public selected: T[typeof this.attr][] = [],
  ) {}

  filter(item: T): boolean {
    const value = item[this.attr];

    if (this.selected.length === 0) {
      return true;
    }

    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.some((element) => this.selected.includes(element))
      );
    } else {
      return this.selected.includes(value);
    }
  }

  serialize(): EnumFilterSerialized<T> {
    return {
      type: "EnumFilter",
      attr: this.attr,
      selected: this.selected,
    };
  }

  static deserialize<T>(serialized: EnumFilterSerialized<T>): EnumFilter<T> {
    return new EnumFilter(serialized.attr, serialized.selected);
  }
}

export interface EnumFilterSerialized<T> {
  type: "EnumFilter";
  attr: keyof T;
  selected: T[typeof this.attr][];
}
