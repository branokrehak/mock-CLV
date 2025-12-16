import { useMemo } from "react";
import { floatRounding } from "../../../../utils/utils";
import { Column, ColumnNumber } from "../data-table";
import { CellCheckbox } from "./cell-checkbox";
import { CellDate } from "./cell-date";
import { CellEnum } from "./cell-enum";
import { CellEnumMultiple } from "./cell-enum-multiple";
import { CellTags } from "./cell-tags";
import { CellText } from "./cell-text";

export interface CellProps<T> {
  item: T;
  patch?: any;
  attr: keyof T;
  index: () => number;
}

export function Cell<T extends object>(props: {
  column: Column<T>;
  item: T;
  patch?: T;
  index: () => number;
}) {
  const p = useMemo(
    (): CellProps<T> => ({
      item: props.item,
      patch: props.patch,
      attr: props.column.attr,
      index: props.index,
    }),
    [props.item, props.patch, props.column.attr, props.index],
  );

  if (props.column.cell) {
    const CellComponent = props.column.cell;
    return <CellComponent {...p} />;
  }

  const rawValue = useMemo(
    () => props.item[props.column.attr],
    [props.item, props.column.attr],
  );

  if (props.column.type === "string") {
    return (
      <CellText
        {...p}
        width={80}
        displayValue={rawValue}
        multiline={props.column.multiline ? "autosize" : undefined}
      />
    );
  }

  if (props.column.type === "number") {
    const value = useMemo(() => {
      assertType<ColumnNumber<unknown>>(props.column);
      return props.column.precision !== undefined
        ? floatRounding(rawValue as number, props.column.precision)
        : rawValue;
    }, [rawValue, props.column]);

    return <CellText {...p} width={50} displayValue={value} />;
  }

  if (props.column.type === "datetime" || props.column.type === "date") {
    return (
      <CellDate
        {...p}
        type={props.column.type === "datetime" ? "datetime-local" : "date"}
      />
    );
  }

  if (props.column.type === "boolean") {
    return <CellCheckbox {...p} />;
  }

  if (props.column.type === "enum") {
    return <CellEnum {...p} values={props.column.values} />;
  }

  if (props.column.type === "array") {
    if (props.column.values) {
      return <CellEnumMultiple {...p} values={props.column.values} />;
    } else {
      return <CellTags {...p} />;
    }
  }

  // For types not yet implemented, just render the raw value
  return <>{String(rawValue)}</>;
}

function assertType<T>(val: unknown): asserts val is T {}
