import React, { useEffect } from "react";
import { ChoosingModal } from "../../../components/ui-kit/choosing-modal/choosing-modal";
import { DataTable } from "../../../components/ui-kit/tables/data-table";
import { SelectionMode } from "../../../models/data-model";
import { Users } from "./users";

export function UsersModal(props: {
  model: Users;
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
              header1: "Username",
              attr: "username",
              type: "string",
              sort: true,
              initSort: "asc",
              cell: ({ item }) => <strong>{item.username}</strong>,
            },
            {
              header1: "Role",
              attr: "role",
              type: "string",
              filter: true,
            },
            {
              header1: "# of managed patients",
              cell: ({ item }) => item.managed_patients?.length ?? 0,
            },
            {
              header1: "# of monitored patients",
              cell: ({ item }) => item.monitoring_patients?.length ?? 0,
            },
          ]}
          model={props.model}
          canSelect={props.mode}
        />
      }
    />
  );
}
