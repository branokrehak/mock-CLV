import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";
import React from "react";
import styles from "./popover.module.css";

export function PopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Content
      {...props}
      className={clsx(styles.content, className)}
    />
  );
}
