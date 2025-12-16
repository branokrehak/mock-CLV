import { reactive } from "@vue/reactivity";
import { useMemo } from "react";
import { DataModel } from "../../../models/data-model";
import { MedicalPlotModel } from "../../../models/plotting";
import { Plot } from "./plot";

export function MedicalPlot(props: {
  dataModel: DataModel;
  plotTypeOptions: string[];
}) {
  const model = useMemo(
    () =>
      reactive(
        new MedicalPlotModel(props.dataModel, props.plotTypeOptions, "plot-canvas"),
      ),
    [props.dataModel, props.plotTypeOptions],
  );

  useMemo(() => {
    model.initPlot();
  }, [model]);

  return <Plot model={model} />;
}
