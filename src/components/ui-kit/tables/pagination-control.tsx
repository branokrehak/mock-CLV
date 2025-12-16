import { DataModel } from "../../../models/data-model";
import { reacter } from "../../../utils/react";
import { Button } from "../button";
import styles from "./pagination-control.module.css";

export const PaginationControl = reacter(function PaginationControl<
  T extends object,
>(props: { model: DataModel<T> }) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => props.model.prevPage()}
        disabled={props.model.currentPage === 1}
        className={styles.button}
      >
        {"\u25C0"}
      </Button>

      <span>
        Page {props.model.currentPage} of {props.model.totalPages}
      </span>

      <Button
        onClick={() => props.model.nextPage()}
        disabled={props.model.currentPage === props.model.totalPages}
        className={styles.button}
      >
        {"\u25B6"}
      </Button>
    </div>
  );
});
