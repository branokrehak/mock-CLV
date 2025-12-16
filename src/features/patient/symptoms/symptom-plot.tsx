import { reactive } from "@vue/reactivity";
import { useState } from "react";
import { DataModel } from "../../../models/data-model";
import { SymptomPlotModel } from "../../../models/plotting";
import { Plot } from "../common/plot";

export function SymptomPlot(props: {
  dataModel: DataModel;
  plotTypeOptions: string[];
}) {
  const [model] = useState(() => {
    const m = reactive(
      new SymptomPlotModel(
        props.dataModel,
        props.plotTypeOptions,
        "plot-canvas",
      ),
    );
    m.initPlot();
    return m;
  });

  return <Plot model={model} />;
}
