import clsx from "clsx";
import React from "react";
import styles from "./form-row.module.css";

export function FormRow({
  label,
  hint,
  data,
  mandatory,
  maxWidth,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  data: React.ReactNode;
  mandatory?: boolean;
  maxWidth?: boolean;
}) {
  return (
    <tr>
      <td className={styles.leftColumn}>
        <div>
          <div>
            {label}:{" "}
            {mandatory && (
              <span style={{ color: "#bb16a3" }}>
                <strong>*</strong>
              </span>
            )}
          </div>
          {hint && <div className="font-normal">{hint}</div>}
        </div>
      </td>
      <td
        className={clsx(
          styles.rightColumn,
          (maxWidth ?? true) && styles.columnMaxWidth,
        )}
      >
        {data}
      </td>
    </tr>
  );
}
