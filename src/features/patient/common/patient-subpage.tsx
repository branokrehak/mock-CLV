import React from "react";
import { Spinner } from "../../../components/ui-kit/spinner";

export function PatientSubpage(props: {
  title: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return <div>{props.loading ? <Spinner /> : props.children}</div>;
}
