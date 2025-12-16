import { TagsField } from "../../fields/tags-field";
import { Tags } from "../../tags";

export function CellTags<T extends object>(props: {
  item: T;
  attr: keyof T;
  patch?: any;
}) {
  if (props.patch) {
    return <TagsField attr={props.attr} model={props.patch} />;
  }

  return <Tags tags={props.item[props.attr] as string[]} />;
}
