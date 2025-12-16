import Chart, { ChartOptions } from "chart.js/auto";
import "chartjs-adapter-moment";
import moment from "moment";
import { parseDatetimeToLocal } from "../utils/utils";
import { applyFilters, applySort, DataModel } from "./data-model";
import { EnumFilter } from "./data-model/enum-filter";
import { Filter } from "./data-model/filter";
import { Sort } from "./data-model/sort";

type PlotKey = Record<string, string[]>;

export class SimplePlotModel<T extends object = any> {
  data: DataModel;
  valueKey = "";
  filterKey = "";
  dateTimeKey = "";
  chartId: string;
  hueKey: PlotKey = null;
  styleKey: PlotKey = null;
  plotType: string = null;
  plotStart: string = null;
  plotEnd: string = null;
  plotTimeSeries: any[] = null;
  chart: any = null;
  showLegend = false;

  defaultColor = "rgba(187, 22, 163, 1)";
  defaultStyle = "circle";
  extraFilters: Filter<T>[] = [];

  minDataPoints = 2;
  plotTypeOptions: string[] = [];
  defaultPlotTypeOptions: string[];

  constructor(
    dataModel: DataModel,
    plotTypeOptions: string[],
    chartId: string,
  ) {
    this.data = dataModel;
    this.chartId = chartId;
    this.defaultPlotTypeOptions = plotTypeOptions;
  }

  private getData(filterOption: string) {
    const sort = new Sort(this.dateTimeKey, "datetime", "asc");

    const filters: Filter<any>[] = [
      new EnumFilter(this.filterKey, [filterOption]),
      ...this.extraFilters,
    ];

    return applySort(applyFilters(this.data.data, filters), sort);
  }

  initPlot() {
    this.plotTypeOptions = [];

    for (let plotOption of this.defaultPlotTypeOptions) {
      const filteredData = this.getData(plotOption);

      if (filteredData.length >= this.minDataPoints) {
        this.plotTypeOptions.push(plotOption);
      }
    }
  }

  resetPlot() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = null;
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    if (canvas) {
      canvas.style.display = "none";
    }
  }

  preparePlot() {
    this.resetPlot();
    const filteredData = this.getData(this.plotType);

    this.plotStart = parseDatetimeToLocal(
      new Date(
        Math.min(
          ...filteredData.map((item) =>
            new Date(item[this.dateTimeKey] as string).getTime(),
          ),
        ),
      ),
    );
    this.plotEnd = parseDatetimeToLocal(
      new Date(
        Math.max(
          ...filteredData.map((item) =>
            new Date(item[this.dateTimeKey] as string).getTime(),
          ),
        ),
      ),
    );
    this.plotTimeSeries = filteredData;
    this.updatePlot(this.plotStart, this.plotEnd);
  }

  yLabel(plotType: string) {
    return plotType;
  }

  getChartScales(): ChartOptions<"line">["scales"] {
    return {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "MMM D",
          },
        },
        adapters: {
          date: {
            library: moment,
          },
        },
        title: {
          display: true,
          text: "date",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: this.yLabel(this.plotType),
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    };
  }

  getDatesTimeSeries(minDate: string, maxDate: string) {
    const filtPlotEnd = new Date(maxDate);
    filtPlotEnd.setSeconds(filtPlotEnd.getSeconds() + 1);
    return this.plotTimeSeries.filter(
      (item) =>
        new Date(item[this.dateTimeKey]) >= new Date(minDate) &&
        new Date(item[this.dateTimeKey]) <= filtPlotEnd,
    );
  }

  chartData(
    plotData: object[],
    color: string,
    style: string,
    label: string = null,
    hidden: boolean = false,
  ) {
    return {
      label: label,
      data: plotData.map((item) => ({
        x: item[this.dateTimeKey],
        y: item[this.valueKey],
      })),
      borderColor: color,
      backgroundColor: color,
      pointStyle: style,
      borderWidth: 0.5,
      fill: false,
      pointRadius: 5,
      pointHoverRadius: 7,
      hidden: hidden,
    };
  }

  getDatasets(timeSeries: object[]) {
    return [this.chartData(timeSeries, this.defaultColor, this.defaultStyle)];
  }

  updatePlot(minDate: string, maxDate: string) {
    this.resetPlot();

    const timeSeries = this.getDatesTimeSeries(minDate, maxDate);
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const datasets = this.getDatasets(timeSeries);
    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: datasets,
      },
      options: {
        plugins: {
          legend: {
            display: this.showLegend,
            labels: {
              usePointStyle: true,
            },
          },
        },
        scales: this.getChartScales(),
      },
    });
    canvas.style.display = "block";
  }
}

export class SingleGroupedPlotModel extends SimplePlotModel {
  // palettes
  colorPalette = [
    "rgba(187, 22, 163, 1)",
    "rgba(5, 195, 222, 1)",
    "rgba(37, 40, 42, 1)",
    "rgba(0, 146, 203, 1)",
    "rgba(112, 115, 114, 1)",
  ];
  stylePalette = ["circle", "triangle", "cross", "rect"];
  defaultHidden: string[] = [];

  constructor(dataModel: any, plotTypeOptions: string[], chartId: string) {
    super(dataModel, plotTypeOptions, chartId);
    this.showLegend = true;
  }

  singleGroup(timeSeries: object[], key) {
    return timeSeries.reduce((acc, item) => {
      if (!acc[item[key]]) {
        acc[item[key]] = [];
      }
      acc[item[key]].push(item);
      return acc;
    }, {});
  }

  getDatasets(timeSeries: object[]) {
    if (this.hueKey && this.hueKey[this.plotType]) {
      const groupedData = this.singleGroup(
        timeSeries,
        this.hueKey[this.plotType],
      );
      return Object.keys(groupedData).map((key, index) => {
        const groupData = groupedData[key];
        const color = this.colorPalette[index % this.colorPalette.length];
        return this.chartData(groupData, color, this.defaultStyle, key);
      });
    } else if (this.styleKey && this.styleKey[this.plotType]) {
      const groupedData = this.singleGroup(
        timeSeries,
        this.styleKey[this.plotType],
      );
      return Object.keys(groupedData).map((key, index) => {
        const groupData = groupedData[key];
        const style = this.stylePalette[index % this.stylePalette.length];
        return this.chartData(
          groupData,
          this.defaultColor,
          style,
          key,
          this.defaultHidden.includes(key),
        );
      });
    }
  }
}

export class MedicalPlotModel extends SimplePlotModel {
  constructor(dataModel: any, plotTypeOptions: string[], chartId: string) {
    super(dataModel, plotTypeOptions, chartId);
    this.valueKey = "measurement_value";
    this.filterKey = "measurement_type";
    this.dateTimeKey = "measurement_datetime";
  }
}

export class SymptomPlotModel extends SimplePlotModel {
  constructor(dataModel: any, plotTypeOptions: string[], chartId: string) {
    super(dataModel, plotTypeOptions, chartId);
    this.valueKey = "symptom_value";
    this.filterKey = "symptom_name";
    this.dateTimeKey = "symptom_datetime";
  }
}
