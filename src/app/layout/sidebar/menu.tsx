import React from "react";
import styles from "./sidebar.module.css";

export function Menu({ children }: { children?: React.ReactNode }) {
  return <div className={styles.menu}>{children}</div>;
}
