import React, { useMemo, useState } from "react";
import { TooltipModel } from "./utils";
import styles from "./validation-tooltip.module.css";

export function ValidationTooltip({
  model,
  children,
  className,
}: {
  model: TooltipModel;
  children: React.ReactNode;
  className?: string;
}) {
  const [hover, setHover] = useState(false);

  const show = useMemo(() => {
    if (!model.message) return false;
    if (model.forceOpen) return true;
    return hover;
  }, [model.message, model.forceOpen, hover]);

  return (
    <div
      className={className ?? "inline-block relative"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      {show && (
        <div
          className={styles.content}
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {model.message}
        </div>
      )}
    </div>
  );
}
