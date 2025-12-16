import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./cell-text-static.module.css";

export function CellTextStatic(props: { value: string; multiline?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!props.multiline) {
      return;
    }

    if (textRef.current) {
      setOverflows(
        !expanded && textRef.current.clientWidth < textRef.current.scrollWidth,
      );
    }
  }, [props.multiline, props.value, expanded]);

  return (
    <div className={styles.root}>
      <div className={styles.textContainer}>
        <span
          className={clsx(
            props.multiline && styles.multiline,
            props.multiline && !expanded && styles.collapsed,
          )}
          ref={textRef}
        >
          {props.value || "\u00A0"}
        </span>
      </div>

      {props.multiline && (overflows || expanded) && (
        <div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(!expanded);
            }}
            className={styles.button}
          >
            {expanded ? "\u25B2" : "\u25BC"}
          </button>
        </div>
      )}
    </div>
  );
}
