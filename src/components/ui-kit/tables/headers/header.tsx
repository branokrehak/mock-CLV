import { reactive } from "@vue/reactivity";
import React, { useEffect, useMemo } from "react";
import { DataModel } from "../../../../models/data-model";
import { Sort, SortDir } from "../../../../models/data-model/sort";
import { reacter } from "../../../../utils/react";
import styles from "./header.module.css";

export const Header = reacter(function Header<T extends object>(props: {
  model?: DataModel<T>;
  attr?: keyof T;
  type?: string;
  children: React.ReactNode;
  sort?: boolean;
  initSort?: SortDir;
}) {
  const sortModel = useMemo(() => {
    if (props.attr && props.type && props.sort && props.model) {
      if (props.model.sort && props.model.sort.attr === props.attr) {
        return props.model.sort;
      } else {
        return reactive(
          new Sort<T>(
            props.attr as keyof T,
            props.type,
            props.initSort ?? "asc",
          ),
        );
      }
    }
    return null;
  }, [props.attr, props.type, props.sort, props.model, props.initSort]);

  // Apply initial sort if needed
  useEffect(() => {
    if (sortModel && props.initSort && !props.model?.sort) {
      props.model.sort = sortModel;
      props.model.reload();
    }
  }, [sortModel, props.initSort, props.model]);

  return (
    <>
      <b>{props.children}</b>

      {sortModel && (
        <button
          onClick={() => {
            sortModel.dir = sortModel.dir === "asc" ? "desc" : "asc";
            props.model!.sort = sortModel;
            props.model!.reload();
            props.model!.saveSettings();
          }}
          className={styles.button}
          type="button"
        >
          {props.model!.sort !== sortModel
            ? "\u25EF"
            : sortModel.dir === "asc"
              ? "\u25B2"
              : "\u25BC"}
        </button>
      )}
    </>
  );
});
