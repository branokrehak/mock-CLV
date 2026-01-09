import { reactive } from "@vue/reactivity";
import { useMemo } from "react";
import { DataModel } from "../../../models/data-model";
import { MedicationPlotModel } from "../../../models/plotting";
import { Plot } from "../common/plot";

export function MedicationPlot(props: {
  dataModel: DataModel;
  plotTypeOptions: string[];
}) {
  const model = useMemo(
    () =>
      reactive(
        new MedicationPlotModel(props.dataModel, props.plotTypeOptions, "plot-canvas"),
      ),
    [props.dataModel, props.plotTypeOptions],
  );

  useMemo(() => {
    model.initPlot();
  }, [model]);

  return <Plot model={model} />;
}
