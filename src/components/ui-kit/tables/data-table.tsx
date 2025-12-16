import clsx from "clsx";
import React, { useEffect, useMemo } from "react";
import { APIDataModel } from "../../../models/api-data-model";
import {
  DataModel,
  defaultRowsPerPage,
  SelectionMode,
} from "../../../models/data-model";
import { QueryFilterFn } from "../../../models/data-model/simple-query-filter";
import { SortDir } from "../../../models/data-model/sort";
import { reacter } from "../../../utils/react";
import { Button } from "../button";
import { Form } from "../form/form";
import styles from "../table.module.css";
import { Cell, CellProps } from "./cells/cell";
import { CellDeleteButton } from "./cells/cell-delete-button";
import { CellEditButtons } from "./cells/cell-edit-buttons";
import { CellSelectRow } from "./cells/cell-select-row";
import { Header } from "./headers/header";
import { HeaderSelectFilter } from "./headers/header-select-filter";
import { HeaderSelectRows } from "./headers/header-select-rows";
import { HeaderTextFilter } from "./headers/header-text-filter";
import { PaginationControl } from "./pagination-control";
import { RowsSelector } from "./rows-selector";
import { Column as SimpleColumn, SimpleTable } from "./simple-table";

export const DataTable = reacter(function DataTable<T extends object>(props: {
  model: DataModel<T>;
  columns: Array<Column<T> | false | null | undefined>;
  /** Specifies the item's primary key. Use this if you want to avoid remounts when new data arrives. */
  itemKeyField?: keyof T;
  /** This name is used to store table settings */
  name?: string;
  foot?: React.ReactNode;
  class?: string;
  verticalAlign?: "top";
  editMode?: "row" | "cell";
  onAdd?: (addedField: any) => void | Promise<unknown>;
  onEdit?: (
    editedField: any,
    row: any,
    index: number,
  ) => void | Promise<unknown>;
  onDelete?: (row: any, index: number) => void | Promise<unknown>;
  rowsPerPage?: number;
  patchAlwaysIncludeKeys?: string[];
  canSelect?: SelectionMode;
  readOnly?: boolean;
  onSelect?: (selected: any[]) => void;
  preselected?: any[];
}) {
  const columns = useMemo(
    () =>
      props.columns.filter(
        (col): col is Column<T> =>
          !!col &&
          (col.userLevel == null ||
            props.model.userLevel == null ||
            props.model.userLevel >= col.userLevel),
      ),
    [props.columns, props.model.userLevel],
  );

  const loading = useMemo(
    () => props.model instanceof APIDataModel && props.model.loading,
    [props.model],
  );

  const showEditColumn = useMemo(
    () => props.onEdit && props.model.canEdit() && props.editMode !== "cell",
    [props.onEdit, props.model, props.editMode],
  );

  const showDeleteColumn = useMemo(
    () => props.onDelete && props.model.canDelete(),
    [props.onDelete, props.model],
  );

  const showHistoryButton = useMemo(
    () => props.model.hasHistory && props.model.canShowHistory,
    [props.model],
  );

  const showPagination = useMemo(
    () => props.rowsPerPage !== Number.MAX_VALUE,
    [props.rowsPerPage],
  );

  // Set stuff in DataModel based on props
  useEffect(() => {
    props.model.rowsPerPage = props.rowsPerPage ?? defaultRowsPerPage;
    props.model.selectionMode = props.canSelect;

    if (props.itemKeyField) {
      props.model.idAttr = props.itemKeyField;
    }

    if (props.model.initialized) {
      props.model.reload();
    }
  }, [
    props.model,
    props.rowsPerPage,
    props.canSelect,
    props.itemKeyField,
    columns,
  ]);

  // Handle model name and settings
  useEffect(() => {
    if (props.name) {
      props.model.name = props.name;
      props.model.loadSettings();
    }
  }, [props.model, props.name]);

  // Handle preselected
  useEffect(() => {
    if (props.preselected) {
      props.model.selected = props.preselected;
    }
  }, [props.model, props.preselected]);

  // Handle onSelect callback
  useEffect(() => {
    props.onSelect?.(props.model.selected);
  }, [props.model.selected, props.onSelect]);

  const editable = (column: Column<T>, item: T) =>
    typeof column.editable === "function"
      ? column.editable(item)
      : column.editable;

  const getEditableFields = (item: T) =>
    columns.filter((c) => editable(c, item) && c.attr).map((c) => c.attr);

  const simpleTableColumns = useMemo((): SimpleColumn<T>[] => {
    const res: SimpleColumn<T>[] = [];

    if (props.canSelect) {
      res.push({
        header1: "Choose",
        header2: props.readOnly ? undefined : (
          <HeaderSelectRows model={props.model} />
        ),
        cell: (item) => (
          <CellSelectRow
            id={item[props.model.idAttr]}
            model={props.model}
            disabled={props.readOnly}
          />
        ),
      });
    }

    res.push(
      ...columns.map((col): SimpleColumn<T> => {
        const headers: Array<React.ReactNode> = [];

        headers.push(
          <Header
            key="header"
            attr={col.attr}
            type={col.type}
            model={props.model}
            sort={col.sort}
            initSort={col.initSort}
          >
            {col.header1}
          </Header>,
        );

        if (col.header2) {
          headers.push(col.header2);
        }

        if (col.filter) {
          headers.push(
            <HeaderSelectFilter
              key="filter"
              attr={col.attr as keyof T}
              model={props.model}
              values={"values" in col ? col.values : undefined}
            />,
          );
        }

        if (col.search && col.attr) {
          headers.push(
            <HeaderTextFilter
              key="search"
              model={props.model}
              attr={col.attr as keyof T}
              filterFn={
                typeof col.search === "function" ? col.search : undefined
              }
              placeholder="Search..."
            />,
          );
        }

        if (col.header3) {
          if (headers.length === 1) {
            headers.push(null);
          }
          headers.push(col.header3);
        }

        return {
          header1: headers[0],
          header2: headers[1],
          header3: headers[2],
          sticky: col.sticky,
          cell: (item, index) => {
            // Don't use hooks here - this is called during SimpleTable's render
            const editing =
              props.model.editingIndex === index &&
              props.model.canEditField(col.attr, item);

            const renderCell = () => (
              <Cell
                item={editing ? { ...item, ...props.model.editingDraft } : item}
                patch={editing ? props.model.editingDraft : undefined}
                column={col}
                index={() => index}
              />
            );

            return (
              <>
                {editing && props.editMode === "cell" ? (
                  <div className="flex gap-1">
                    {renderCell()}

                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        props.onEdit?.(props.model.editingDraft, item, index);
                        props.model.stopEditing();
                      }}
                    >
                      ✓
                    </Button>

                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        props.model.stopEditing();
                      }}
                    >
                      X
                    </Button>
                  </div>
                ) : (
                  renderCell()
                )}
              </>
            );
          },
        };
      }),
    );

    if (showEditColumn) {
      res.push({
        header1: <Header key="edit-header">Edit</Header>,
        cell: (item, index) => (
          <CellEditButtons
            model={props.model}
            index={() => index}
            fields={() => getEditableFields(item)}
          />
        ),
      });
    }

    if (showDeleteColumn) {
      res.push({
        header1: <Header key="delete-header">Delete</Header>,
        cell: (item, index) => (
          <CellDeleteButton
            index={() => index}
            model={props.model}
            onConfirm={() => {
              props.onDelete?.(item, index);
            }}
          />
        ),
      });
    }

    return res;
  }, [
    props.canSelect,
    props.readOnly,
    props.model,
    props.model.editingIndex,
    props.model.editingDraft,
    columns,
    showEditColumn,
    showDeleteColumn,
    props.editMode,
    props.onEdit,
    props.onDelete,
    getEditableFields,
  ]);

  const foot = useMemo((): React.ReactNode => {
    if (props.foot) {
      return props.foot;
    }

    if (props.onAdd) {
      return (
        <tr>
          {props.model.editingIndex === -1 ? (
            <>
              {columns.map((col, i) => (
                <td key={i}>
                  <Cell
                    item={props.model.editingDraft}
                    patch={props.model.editingDraft}
                    column={col}
                    index={() => -1}
                  />
                </td>
              ))}

              <td>
                <Button
                  onClick={() => {
                    props.onAdd!(props.model.editingDraft);
                    props.model.stopEditing();
                  }}
                  variant="subtle"
                >
                  ✓
                </Button>
              </td>

              <td>
                <Button
                  onClick={() => {
                    props.model.stopEditing();
                  }}
                  variant="subtle"
                >
                  X
                </Button>
              </td>
            </>
          ) : (
            <td colSpan={100}>
              <Button
                variant="subtle"
                onClick={() => {
                  props.model.startAdding(getEditableFields({} as T));
                }}
              >
                + Add
              </Button>
            </td>
          )}
        </tr>
      );
    }

    return undefined;
  }, [
    props.foot,
    props.onAdd,
    props.model,
    props.model.editingIndex,
    props.model.editingDraft,
    columns,
    getEditableFields,
  ]);

  return (
    <div className="flex flex-col items-start">
      <Form
        className="w-full h-full"
        onSubmit={async () => {
          if (props.model.editingIndex != null) {
            const index = props.model.editingIndex;
            const item = props.model.paginatedData[index];
            const patch = props.model.generatePatch(
              props.patchAlwaysIncludeKeys,
            );
            if (Object.keys(patch).length > 0) {
              await props.onEdit?.(patch, item, index);
            }
            props.model.stopEditing();
          }
        }}
      >
        <SimpleTable
          columns={simpleTableColumns}
          rows={props.model.paginatedData}
          itemKeyField={props.itemKeyField}
          verticalAlign={props.verticalAlign}
          loading={loading}
          foot={foot}
          rowAttrs={({ row }) => ({
            className: clsx(
              props.model.isSelected(row[props.model.idAttr]) &&
                styles.selected,
            ),
          })}
          cellAttrs={({ row, rowIndex, colIndex }) => {
            const column = columns[colIndex];

            if (!column) {
              return;
            }

            return {
              onClick: () => {
                if (editable(column, row) && props.editMode === "cell") {
                  props.model.startEditing(rowIndex, [column.attr]);
                }
              },
              style: {
                cursor:
                  editable(column, row) && props.editMode === "cell"
                    ? "pointer"
                    : undefined,
              },
            };
          }}
        />
      </Form>

      {(showPagination || showHistoryButton) && (
        <div className="flex gap-10 items-center mt-2">
          {showPagination && (
            <>
              <PaginationControl model={props.model} />
              <RowsSelector model={props.model} />
            </>
          )}

          {showHistoryButton && (
            <Button
              onClick={() => {
                props.model.toggleHistory();
              }}
            >
              Toggle history
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

export type Column<T> =
  | ColumnUnknown<T>
  | ColumnString<T>
  | ColumnEnum<T>
  | ColumnNumber<T>
  | ColumnArray<T>
  | ColumnDate<T>
  | ColumnBoolean<T>;

export interface ColumnBase<T> {
  header1: React.ReactNode;
  header2?: React.ReactNode;
  header3?: React.ReactNode;
  attr?: keyof T;
  editable?: boolean | ((item: T) => boolean);
  sort?: boolean;
  initSort?: SortDir;
  filter?: boolean;
  search?: boolean | QueryFilterFn;
  userLevel?: number;
  sticky?: boolean;
  cell?: (props: CellProps<T>) => React.ReactNode;
}

export interface ColumnUnknown<T> extends ColumnBase<T> {
  type?: never;
}

export interface ColumnString<T> extends ColumnBase<T> {
  type: "string";
  multiline?: boolean;
}

export interface ColumnEnum<T> extends ColumnBase<T> {
  type: "enum";
  values: Record<string, string> | any[];
}

export interface ColumnNumber<T> extends ColumnBase<T> {
  type: "number";
  precision?: number;
}

export interface ColumnArray<T> extends ColumnBase<T> {
  type: "array";
  values?: Record<string, string> | any[];
}

export interface ColumnDate<T> extends ColumnBase<T> {
  type: "datetime" | "date";
}

export interface ColumnBoolean<T> extends ColumnBase<T> {
  type: "boolean";
}
