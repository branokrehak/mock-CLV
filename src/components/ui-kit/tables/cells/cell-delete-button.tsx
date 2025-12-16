import { useMemo } from "react";
import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";
import { Button } from "../../button";

export const CellDeleteButton = reacter(function CellDeleteButton(props: {
  model: DataModel;
  index: () => number;
  onConfirm: () => void;
}) {
  const validationMessage = useMemo(() => {
    const item = props.model.paginatedData[props.index()];
    return item ? props.model.validateItemDelete(item) : false;
  }, [props.model, props.index]);

  return (
    <Button
      disabled={!!validationMessage || props.model.editingIndex === -1}
      onClick={() => props.onConfirm()}
      data-tooltip={validationMessage}
      variant="subtle"
    >
      Delete
    </Button>
  );
});
