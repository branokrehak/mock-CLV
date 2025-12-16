import { DataModel } from "../../../models/data-model";
import { reacter } from "../../../utils/react";

export const RowsSelector = reacter(function RowsSelector(props: {
  model: DataModel;
}) {
  return (
    <div className="pagination-rows">
      <span>
        <label>Rows per page:</label>{" "}
        <select
          value={props.model.rowsPerPage}
          onChange={(event) => {
            props.model.changeRowsPerPage(parseInt(event.target.value));
          }}
        >
          {props.model.rowsPerPageOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </span>
    </div>
  );
});
