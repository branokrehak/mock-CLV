import { useMemo } from "react";
import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";
import { Button } from "../../button";

export const CellEditButtons = reacter(function CellEditButtons<
  T extends object,
>(props: { model: DataModel; index: () => number; fields: () => (keyof T)[] }) {
  const validationMessage = useMemo(() => {
    const item = props.model.paginatedData[props.index()];
    return item ? props.model.validateItemEdit(item) : false;
  }, [props.model, props.index]);

  return (
    <>
      {props.model.editingIndex === props.index() ? (
        <>
          <Button type="submit" variant="subtle">
            Update
          </Button>{" "}
          <Button
            onClick={() => {
              props.model.stopEditing();
            }}
            variant="subtle"
          >
            X
          </Button>
        </>
      ) : (
        <Button
          disabled={!!validationMessage || props.model.editingIndex === -1}
          data-tooltip={validationMessage}
          onClick={() => {
            props.model.startEditing(props.index(), props.fields());
          }}
          variant="subtle"
        >
          Edit
        </Button>
      )}
    </>
  );
});
