import clsx from "clsx";
import React from "react";
import styles from "./invisible-table.module.css";

export function InvisibleTable({
  children,
  dataAdd,
  big,
}: {
  children?: React.ReactNode;
  dataAdd?: boolean;
  big?: boolean;
}) {
  return (
    <table
      className={clsx(
        styles.table,
        dataAdd && styles.dataAdd,
        big && styles.big,
      )}
    >
      {children}
    </table>
  );
}
