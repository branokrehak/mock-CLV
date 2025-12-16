import { DataAdd } from "../../../../models/data-add";
import { Button } from "../../button";

export function CellRemoveButton({
  model,
  index,
}: {
  model: DataAdd;
  index: number;
}) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={() => {
          model.removeItem(index);
        }}
        variant="subtle"
      >
        &times;
      </Button>
    </div>
  );
}
