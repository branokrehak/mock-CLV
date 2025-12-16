import { useMemo } from "react";
import { TextField } from "../../fields/text-field";

export function CellTextField<T extends object>({
  model,
  attr,
  type,
  width: propsWidth,
  disabled,
  multiline,
  required,
}: {
  model: T;
  attr: keyof T;
  type?: "text" | "number";
  width?: number;
  disabled?: boolean;
  multiline?: boolean | "autosize";
  required?: boolean;
}) {
  const width = useMemo(() => {
    if (propsWidth != null) {
      return propsWidth;
    } else if (type === "number") {
      return 50;
    } else {
      return undefined;
    }
  }, [propsWidth, type]);

  return (
    <TextField
      type={type}
      model={model}
      attr={attr}
      width={width}
      disabled={disabled}
      multiline={multiline}
      required={required}
    />
  );
}
