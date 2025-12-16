import { DataModel } from "../../../../models/data-model";
import { reacter } from "../../../../utils/react";
import { uniques } from "../../../../utils/utils";
import { HeaderFilterBase } from "./header-filter-base";

export const HeaderSelectFilter = reacter(function HeaderSelectFilter<
  T extends object,
>(props: {
  name?: string;
  model: DataModel<T>;
  attr?: keyof T;
  values?: Record<string, string> | string[];
  onChange?: (selected: T[typeof this.attr][]) => void;
  disabled?: boolean;
}) {
  // Don't use useMemo here! The reacter wrapper needs to track filterModel.selected
  // on every render to properly react to changes.
  const filterModel = props.model.getOrAddEnumFilter(props.attr as string);

  // Don't use useMemo here either! The reacter wrapper needs to track props.model.data
  // on every render to properly react to changes when data loads asynchronously.
  const available = uniques(
    props.model.data.flatMap((i): T[typeof this.attr] => i[props.attr]),
  );
  const map = available
    .map(
      (value) =>
        [
          value,
          props.values && !Array.isArray(props.values)
            ? props.values[String(value)]
            : String(value ?? ""),
        ] as const,
    )
    .sort();
  const options = new Map(map);

  return (
    <HeaderFilterBase
      options={options}
      name={props.name}
      selected={filterModel.selected}
      disabled={props.disabled}
      onChange={(newSelected) => {
        filterModel.selected = newSelected;
        props.model.reload();
        props.model.saveSettings();
        props.onChange?.(newSelected);
      }}
    />
  );
});
