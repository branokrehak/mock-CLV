import { CheckboxField } from "../../fields/checkbox-field";

export function CellCheckbox<T extends object>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
}) {
  return (
    <CheckboxField
      model={props.item}
      attr={props.attr}
      disabled={!props.patch}
    />
  );
}
