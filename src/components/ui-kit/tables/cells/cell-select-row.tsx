import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";

export const CellSelectRow = reacter(function CellSelectRow<
  T extends DataModel,
>(props: { model: T; id: any; disabled?: boolean }) {
  return (
    <>
      {props.model.selectionMode === "single" && (
        <input
          type="radio"
          checked={props.model.isSelected(props.id)}
          onChange={() => {
            props.model.select(props.id, true);
          }}
          disabled={props.disabled}
        />
      )}

      {props.model.selectionMode === "multi" && (
        <input
          type="checkbox"
          checked={props.model.isSelected(props.id)}
          onChange={() => {
            if (props.model.isSelected(props.id)) {
              props.model.deselect(props.id);
            } else {
              props.model.select(props.id, false);
            }
          }}
          disabled={props.disabled}
        />
      )}
    </>
  );
});
