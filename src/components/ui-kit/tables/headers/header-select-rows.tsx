import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";
import { Button } from "../../button";

export const HeaderSelectRows = reacter(function HeaderSelectRows(props: {
  model: DataModel;
}) {
  return (
    <>
      {props.model.selectionMode === "multi" && (
        <>
          <Button
            onClick={() => {
              props.model.selectAll();
            }}
            variant="subtle"
          >
            All
          </Button>
          <Button
            onClick={() => {
              props.model.deselectAll();
            }}
            variant="subtle"
          >
            None
          </Button>
        </>
      )}
    </>
  );
});
