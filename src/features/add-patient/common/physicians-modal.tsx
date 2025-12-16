import React, { useEffect } from "react";
import { countriesRegistry } from "../../../app/countries-registry";
import { ChoosingModal } from "../../../components/ui-kit/choosing-modal/choosing-modal";
import { DataTable } from "../../../components/ui-kit/tables/data-table";
import { SelectionMode } from "../../../models/data-model";
import { Physicians } from "./physicians";

export function PhysiciansModal(props: {
  model: Physicians;
  mode: SelectionMode;
  preselected?: number[];
  filter?: Record<string, any[]>;
  title: React.ReactNode;
  onConfirm: (params: { selected: any[] }) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (props.preselected) {
      props.model.selected = [...props.preselected];
    }

    if (props.filter) {
      props.model.setDefaultFilter(props.filter);
    }
  }, [props.model, props.preselected, props.filter]);

  return (
    <ChoosingModal
      model={props.model}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
      title={props.title}
      table={
        <DataTable
          columns={[
            {
              header1: "Surname",
              attr: "surname",
              type: "string",
              sort: true,
              initSort: "desc",
            },
            {
              header1: "Name",
              attr: "given_name",
              type: "string",
            },
            {
              header1: "Country",
              attr: "country",
              type: "enum",
              values: countriesRegistry.countriesEnum,
              filter: true,
            },
            {
              header1: "Region",
              attr: "region",
              cell: ({ item }) =>
                countriesRegistry.getRegionSchema(
                  item.country,
                  typeof item.region === "string"
                    ? parseInt(item.region) || 0
                    : item.region,
                )?.region_name,
            },
            {
              header1: "# of patients",
              cell: ({ item }) => item.numPatients,
            },
            {
              header1: "Other clinics",
              cell: ({ item }) => item.clinicsStr,
            },
          ]}
          model={props.model}
          canSelect={props.mode}
        />
      }
    />
  );
}
