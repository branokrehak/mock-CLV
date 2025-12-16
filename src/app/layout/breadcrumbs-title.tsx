import React, { useMemo } from "react";
import { Link, useMatches, useParams } from "react-router-dom";
import styles from "./breadcrumbs-title.module.css";

export function BreadcrumbsTitle() {
  const params = useParams();
  const matches = useMatches();

  const breadcrumbs = useMemo(() => {
    const filteredMatches = matches.filter(
      (match) => (match.handle as any)?.crumb,
    );
    return filteredMatches.map((match, index) => {
      const crumb = (match.handle as any)?.crumb;
      const crumbStr = typeof crumb === "function" ? crumb(params) : crumb;
      const noCrumbLink = (match.handle as any)?.noCrumbLink;

      if (index === filteredMatches.length - 1 || noCrumbLink) {
        return (
          <span key={match.pathname} className={styles.crumb}>
            {crumbStr}
          </span>
        );
      } else {
        return (
          <Link
            key={match.pathname}
            to={match.pathname}
            className={styles.crumb}
          >
            {crumbStr}
          </Link>
        );
      }
    });
  }, [matches, params]);

  return (
    <h2>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {crumb}
          {index !== breadcrumbs.length - 1 ? " / " : ""}
        </React.Fragment>
      ))}
    </h2>
  );
}
