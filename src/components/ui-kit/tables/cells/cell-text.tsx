import { useMemo } from "react";
import { CellTextField } from "../cell-fields/cell-text-field";
import { CellTextStatic } from "./cell-text-static";
import styles from "./cell-text.module.css";

export function CellText<T>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
  displayValue?: any;
  width?: number;
  type?: "text" | "number";
  disabled?: boolean;
  multiline?: boolean | "autosize";
}) {
  const editing = useMemo(
    () => !!props.patch && !props.disabled,
    [props.patch, props.disabled],
  );

  return (
    <div className={styles.root}>
      {!editing ? (
        <CellTextStatic
          value={
            props.displayValue !== undefined
              ? props.displayValue
              : props.item[props.attr]
          }
          multiline={!!props.multiline}
        />
      ) : (
        <CellTextField
          attr={props.attr}
          model={props.patch}
          type={props.type}
          width={props.width}
          multiline={props.multiline}
        />
      )}
    </div>
  );
}
