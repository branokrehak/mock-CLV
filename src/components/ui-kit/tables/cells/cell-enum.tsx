import { useMemo } from "react";
import { CellSelectField } from "../cell-fields/cell-select-field";

export function CellEnum<T extends object, V extends string | number>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
  editing?: () => boolean;
  /** Either an enum or just an array of possible values. */
  values: Record<V, string> | V[];
  onChange?: (newValue: V) => void;
}) {
  const value = useMemo(() => props.item[props.attr], [props.item, props.attr]);

  return (
    <>
      {!props.patch ? (
        (Array.isArray(props.values) ? value : props.values[value as string]) ||
        "\u00A0"
      ) : (
        <CellSelectField
          model={props.patch}
          attr={props.attr}
          values={props.values}
          onChange={props.onChange}
        />
      )}
    </>
  );
}
