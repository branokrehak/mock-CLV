import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import React from "react";
import styles from "./dialog.module.css";

export function Dialog({
  children,
  open,
  onOpenChange,
  className,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />

        <DialogPrimitive.Content className={clsx(styles.dialog, className)}>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
