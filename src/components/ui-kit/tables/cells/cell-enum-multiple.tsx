import { useMemo } from "react";
import { ComboboxMultipleField } from "../../fields/combobox-multiple-field";
import { valuesToMap } from "../../fields/utils";
import { Tags } from "../../tags";

export function CellEnumMultiple<
  T extends object,
  V extends string | number,
>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
  /** Either an enum or just an array of possible values. */
  values: Record<V, string> | V[];
  onChange?: (editedField: object) => void;
}) {
  const value = useMemo(
    () => (props.item[props.attr] as string[]) ?? [],
    [props.item, props.attr],
  );

  if (props.patch) {
    return (
      <ComboboxMultipleField
        attr={props.attr}
        model={props.patch}
        options={Array.from(valuesToMap(props.values).entries()).map(
          ([value, label]) => ({ value, label }),
        )}
      />
    );
  }

  return (
    <div style={{ maxWidth: "300px" }}>
      <Tags
        tags={value.map((val) =>
          Array.isArray(props.values) ? val : props.values[val],
        )}
      />
    </div>
  );
}
