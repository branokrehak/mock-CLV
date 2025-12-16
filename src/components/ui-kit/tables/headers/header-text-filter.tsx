import { reactive } from "@vue/reactivity";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { APIDataModel } from "../../../../models/api-data-model";
import { DataModel } from "../../../../models/data-model";
import {
  QueryFilterFn,
  SimpleQueryFilter,
} from "../../../../models/data-model/simple-query-filter";
import { reacter } from "../../../../utils/react";

export const HeaderTextFilter = reacter(function HeaderTextFilter<
  T extends object,
>(props: {
  model: DataModel<T>;
  attr: keyof T;
  filterFn?: QueryFilterFn;
  placeholder?: string;
}) {
  const filterModel = useMemo(
    () => reactive(new SimpleQueryFilter<T>(props.attr, props.filterFn)),
    [props.attr, props.filterFn],
  );

  useEffect(() => {
    props.model.addFilter(filterModel);

    return () => {
      props.model.removeFilter(filterModel);
    };
  }, [props.model, filterModel]);

  const reloadDebounced = useMemo(
    () =>
      debounce(() => {
        if (props.model instanceof APIDataModel) {
          props.model.refetch();
        } else {
          props.model.reload();
        }
      }, 100),
    [props.model],
  );

  return (
    <input
      type="text"
      placeholder={props.placeholder}
      value={filterModel.query}
      onInput={(event) => {
        filterModel.query = event.currentTarget.value;
        reloadDebounced();
      }}
      style={{ width: "75px" }}
    />
  );
});
