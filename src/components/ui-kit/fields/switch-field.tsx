import React from "react";
import { reacter } from "../../../utils/react";
import { RadioField } from "./radio-field";

const truthy = "truthy";
const falsy = "falsy";

export const SwitchField = reacter(function SwitchField({
  attr,
  model,
  truthy: truthyLabel,
  falsy: falsyLabel,
}: {
  attr: string;
  model: Record<string, any>;
  truthy: React.ReactNode;
  falsy: React.ReactNode;
}) {
  return (
    <RadioField
      values={{ [falsy]: "No", [truthy]: "Yes" }}
      value={model[attr] ? truthy : falsy}
      onChange={(newValue) => {
        model[attr] = newValue === truthy;
      }}
    />
  );
});
