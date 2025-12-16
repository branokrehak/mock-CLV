import React, { useMemo } from "react";
import { DataAdd } from "../../../models/data-add";
import { reacter } from "../../../utils/react";
import { Button } from "../button";
import { DateField } from "../fields/date-field";
import { Form } from "../form/form";
import styles from "./add-table.module.css";
import { Column as SimpleColumn, SimpleTable } from "./simple-table";

export interface Column<T> {
  header: React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  mandatory?: boolean;
}

export const AddTable = reacter(function AddTable({
  model,
  columns,
  setAllDates,
  canAddRows,
  infoExtra,
  footer,
}: {
  model: DataAdd;
  columns: Column<Record<string, any>>[];
  setAllDates?: "date" | "datetime";
  canAddRows?: boolean;
  infoExtra?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const hasMandatory = useMemo(
    () => columns.some((c) => c.mandatory),
    [columns],
  );

  return (
    <div>
      <br />

      {hasMandatory && (
        <>
          (
          <span style={{ color: "#bb16a3" }}>
            <strong>*</strong>
          </span>{" "}
          = mandatory)
        </>
      )}
      <Form onSubmit={() => model.postBulk()}>
        {infoExtra}

        {setAllDates && (
          <div className={styles.datetimeSetter}>
            <p className={styles.title}>
              <strong>
                {setAllDates === "datetime"
                  ? "Set all datetimes:"
                  : "Set all dates:"}
              </strong>
            </p>
            <p>
              (Default) <span>{model.defaultDateTimeName}</span>
              <Button
                onClick={() => {
                  model.setAllDatetimes(model.defaultDateTime);
                }}
              >
                Set
              </Button>
            </p>
            <p>
              <DateField
                type={setAllDates === "date" ? "date" : "datetime-local"}
                value={model.customDateTime}
                onChange={(newValue) => {
                  model.customDateTime = newValue;
                }}
              />
              <Button
                disabled={!model.customDateTime}
                onClick={() => {
                  model.setAllDatetimes(model.customDateTime);
                }}
              >
                Set
              </Button>
            </p>
          </div>
        )}

        <SimpleTable
          columns={columns.map(
            (col): SimpleColumn<any> => ({
              header1: (
                <>
                  {col.header}

                  {col.mandatory && (
                    <>
                      {" "}
                      <span style={{ color: "#bb16a3" }}>
                        <strong>*</strong>
                      </span>
                    </>
                  )}
                </>
              ),
              cell: (item, index) => col.cell(item, index),
            }),
          )}
          rows={model.addingList.filter(Boolean)}
        />

        {canAddRows !== false && (
          <Button
            onClick={() => {
              model.addItem();
            }}
          >
            + Add Row
          </Button>
        )}

        {footer && (
          <>
            <br />
            {footer}
          </>
        )}

        <br />
        <br />

        <Button type="submit">Post</Button>
      </Form>
    </div>
  );
});
