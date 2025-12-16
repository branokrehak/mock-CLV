import clsx from "clsx";
import React, { useMemo, useRef } from "react";
import { reacter } from "../../../utils/react";
import { transpose } from "../../../utils/utils";
import styles from "../table.module.css";
import { DualScrollbarContainer } from "./dual-scrollbar-container";
import { useStickyColumns } from "./sticky-columns";

export interface Column<T> {
  header1: React.ReactNode;
  header2?: React.ReactNode;
  header3?: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  sticky?: boolean;
}

export const SimpleTable = reacter(function SimpleTable<T>({
  rows,
  columns: propsColumns,
  itemKeyField,
  long,
  verticalAlign,
  foot,
  loading,
  rowAttrs,
  cellAttrs,
}: {
  rows: T[];
  columns: Array<Column<T> | false | null | undefined>;
  itemKeyField?: keyof T;
  long?: boolean;
  verticalAlign?: "top";
  foot?: React.ReactNode;
  loading?: boolean;
  rowAttrs?: (props: {
    row: T;
    index: number;
  }) => React.HTMLAttributes<HTMLTableRowElement>;
  cellAttrs?: (props: {
    row: T;
    col: Column<T>;
    rowIndex: number;
    colIndex: number;
  }) => React.HTMLAttributes<HTMLTableCellElement>;
}) {
  const tableRef = useRef<HTMLTableElement>(null);

  const columns = useMemo(
    () => propsColumns.filter((col): col is Column<T> => !!col),
    [propsColumns],
  );

  const headers = useMemo(() => {
    const headers: Array<Array<React.ReactNode>> = [];

    for (const col of columns) {
      const header: Array<React.ReactNode> = [];

      header.push(col.header1);

      if (col.header2) {
        header.push(col.header2);
      }

      if (col.header3) {
        if (header.length === 1) {
          header.push(null);
        }
        header.push(col.header3);
      }

      headers.push(header);
    }

    return transpose(headers);
  }, [columns]);

  useStickyColumns(tableRef);

  return (
    <DualScrollbarContainer className={styles.tableContainer}>
      <table
        className={clsx(
          styles.table,
          long && styles.longTable,
          verticalAlign === "top" && styles.verticalAlignTop,
        )}
        ref={tableRef}
      >
        <thead>
          {headers.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((header, colIndex) => (
                <th key={colIndex} data-sticky={columns[colIndex]?.sticky}>
                  {header}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className={clsx(loading && styles.loading)} inert={loading}>
          {rows.map((row, rowIndex) => (
            <tr
              key={itemKeyField ? String(row[itemKeyField]) : rowIndex}
              {...rowAttrs?.({ row, index: rowIndex })}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  data-sticky={col.sticky}
                  {...cellAttrs?.({
                    row,
                    col,
                    rowIndex,
                    colIndex,
                  })}
                >
                  {col.cell(row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {foot && <tfoot>{foot}</tfoot>}
      </table>
    </DualScrollbarContainer>
  );
});
