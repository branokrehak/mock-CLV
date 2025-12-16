import { dateTimeOrNull } from "../../../../utils/utils";
import { CellDateField } from "../cell-fields/cell-date-field";

export function CellDate<T extends object>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
  editing?: () => boolean;
  type: "datetime-local" | "date";
}) {
  return (
    <>
      {!props.patch ? (
        dateTimeOrNull(
          props.item[props.attr] as string,
          props.type === "datetime-local",
        )
      ) : (
        <CellDateField
          model={props.patch}
          attr={props.attr}
          type={props.type}
        />
      )}
    </>
  );
}
