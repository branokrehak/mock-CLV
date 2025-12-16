import clsx from "clsx";
import React from "react";
import styles from "./tag.module.css";

export function Tag({
  children,
  className,
  deleteable,
  onClick,
  onDelete,
}: {
  children?: React.ReactNode;
  className?: string;
  deleteable?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={clsx(styles.tag, className)}
      onClick={onClick}
      onPointerDown={(e) => {
        if (deleteable) {
          e.stopPropagation();
        }
      }}
    >
      {children}

      {deleteable && (
        <button
          type="button"
          onClick={() => {
            onDelete?.();
          }}
          className={styles.deleteBtn}
        >
          X
        </button>
      )}
    </div>
  );
}
