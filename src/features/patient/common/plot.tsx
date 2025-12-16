import { SimplePlotModel } from "../../../models/plotting";
import { reacter } from "../../../utils/react";
import styles from "./plot.module.css";

export const Plot = reacter(function Plot(props: { model: SimplePlotModel }) {
  return (
    <div id="medical-plot">
      <h4>Plot</h4>
      <label>Plot:</label>{" "}
      <select
        value={props.model.plotType ?? ""}
        onChange={(event) => {
          props.model.plotType = event.target.value;
          props.model.preparePlot();
        }}
      >
        <option value="" disabled>
          Select type
        </option>
        {props.model.plotTypeOptions.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>{" "}
      <label>between</label>{" "}
      <input
        type="datetime-local"
        value={props.model.plotStart ?? ""}
        onChange={(event) => {
          props.model.plotStart = event.target.value;
          props.model.updatePlot(props.model.plotStart, props.model.plotEnd);
        }}
      />{" "}
      -{" "}
      <input
        type="datetime-local"
        value={props.model.plotEnd ?? ""}
        onChange={(event) => {
          props.model.plotEnd = event.target.value;
          props.model.updatePlot(props.model.plotStart, props.model.plotEnd);
        }}
      />
      <br />
      <canvas
        className={styles.plot}
        id="plot-canvas"
        style={{ display: "none" }}
      />
    </div>
  );
});
