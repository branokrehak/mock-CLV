import clsx from "clsx";
import React, { useId } from "react";
import { reacter } from "../../../utils/react";
import { resolveNestedProperty } from "../../../utils/utils";
import { Button } from "../button";
import { FormModel } from "./form-model";
import styles from "./form-row.module.css";

export const FormRowEditable = reacter(function FormRowEditable({
  form,
  label,
  attr,
  model,
  viewMode,
  editMode,
  editable,
  getEditedField,
  onChange,
}: {
  form: FormModel;
  label: string;
  attr?: string;
  model?: Record<string, any>;
  viewMode: React.ReactNode;
  editMode: () => React.ReactNode;
  editable?: boolean;
  getEditedField?: () => Record<string, any>;
  onChange?: (editedField: Record<string, any>) => void;
}) {
  const rowId = useId();
  const editing = form.editedId === rowId;

  return (
    <tr>
      <td className={styles.leftColumn}>{label}:</td>

      <td className={clsx(styles.rightColumn, styles.columnMaxWidth)}>
        {!editing && viewMode}
        {editing && editMode()}
      </td>

      <td className={styles.editColumn}>
        {!editing && editable !== false && (
          <Button
            variant="subtle"
            onClick={() => {
              const editedField = getEditedField
                ? getEditedField()
                : {
                    [attr]: resolveNestedProperty(model, attr),
                  };
              form.startEditing(rowId, editedField);
            }}
          >
            Edit
          </Button>
        )}

        {editing && (
          <>
            <Button
              variant="subtle"
              onClick={() => {
                onChange?.(form.editedField);
                form.stopEditing();
              }}
            >
              Update
            </Button>{" "}
            <Button
              variant="subtle"
              onClick={() => {
                form.stopEditing();
              }}
            >
              X
            </Button>
          </>
        )}
      </td>
    </tr>
  );
});
