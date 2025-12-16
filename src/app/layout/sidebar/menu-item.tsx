import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./sidebar.module.css";

export function MenuItem({
  children,
  selected,
  href,
  end,
  subitems,
  expandable,
  defaultExpanded,
  level = 0,
}: {
  children?: React.ReactNode;
  selected?: boolean;
  href?: string;
  end?: boolean;
  subitems?: React.ReactNode;
  expandable?: boolean;
  defaultExpanded?: boolean;
  level?: number;
}) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);

  // Auto-expand if current route matches this item or any of its children
  useEffect(() => {
    if (expandable && href) {
      const currentPath = location.pathname;
      const itemPath = href;

      // Check if we're on this exact route or a child route
      const isActive = currentPath.includes(itemPath);

      if (isActive && !expanded) {
        setExpanded(true);
      }
    }
  }, [location.pathname, expandable, href, expanded]);

  const handleCaretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Calculate padding based on nesting level
  const paddingLeft = `${20 + level * 20}px`;

  return (
    <>
      <NavLink
        to={href}
        className={({ isActive }) =>
          `${styles.menuitem} ${level > 0 ? styles[`menuitem_level${level}`] : ""} ${
            isActive ? styles.selected : ""
          }`
        }
        end={end}
        style={{ paddingLeft }}
      >
        {children}
        {expandable && (
          <button
            className={styles.expandIcon}
            onClick={handleCaretClick}
            type="button"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▼" : "▶"}
          </button>
        )}
      </NavLink>
      {expanded && subitems && <div className={styles.submenu}>{subitems}</div>}
    </>
  );
}
