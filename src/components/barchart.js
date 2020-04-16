import React, { useState, useEffect } from "react";
import renderChart from "vega-embed";
import StateDetailsChart from "./statedetailschart";

const StateBarChart = props => {
  const [data, setData] = useState(0);
  const [selectedState, setSelectedState] = useState("");

  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    title: "Confirmed cases by State",
    width: "container",
    height: 500,
    data: {
      name: "bardata"
    },
    transform: [
      { calculate: "toNumber(datum.confirmed)", as: "confirmed" },
      { calculate: "toNumber(datum.active)", as: "active" },
      { calculate: "toNumber(datum.deaths)", as: "deaths" },
      { calculate: "toNumber(datum.recovered)", as: "recovered" },
      {
        calculate:
          "toNumber(datum.confirmed) + toNumber(datum.active) +toNumber(datum.recovered)+toNumber(datum.deaths) ",
        as: "TotalCases"
      },
      { fold: ["active", "confirmed", "recovered", "deaths"] },
      {
        filter: {
          and: [
            { field: "confirmed", gt: props.condition },
            { not: { field: "statecode", equal: "TT" } }
          ]
        }
      }
    ],

    layer: [
      {
        selection: {
          brush: {
            type: "single",
            encodings: ["y"],
            fields: ["state"],
            init: { state: "Maharashtra" }
          }
        },
        mark: { type: "bar" },
        encoding: {
          x: {
            aggregate: "sum",
            field: "value",
            type: "quantitative",
            title: "",

            axis: {
              grid: false,
              ticks: false,
              labels: false
            }
          },
          y: {
            field: "state",
            type: "nominal",
            sort: { op: "sum", field: "value", order: "descending" }
          },
          color: {
            field: "confirmed",
            type: "quantitative",
            legend: null
          },
          tooltip: [
            { field: "deaths", type: "quantitative" },
            { field: "recovered", type: "quantitative" },
            { field: "active", type: "quantitative" },
            { field: "confirmed", type: "quantitative" },
            { field: "TotalCases", type: "quantitative" }
          ]
        }
      },
      {
        mark: {
          type: "text",
          align: "left",
          baseline: "middle",
          dx: 3
        },
        encoding: {
          x: {
            aggregate: "sum",
            field: "value",
            type: "quantitative"
          },
          y: {
            field: "state",
            type: "nominal",
            sort: { op: "sum", field: "value", order: "descending" }
          },
          text: {
            aggregate: "sum",
            field: "value",
            type: "quantitative",
            format: ".0f"
          }
        }
      }
    ]
  };

  useEffect(() => {
    if (props.data.length > 1) {
      setData(props.data);
      setSelectedState(props.data[1].state);
    }
  }, [props.data]);

  useEffect(() => {
    console.log("BarChart: useEffect");
    const opts = {
      renderer: "svg",
      actions: false
    };

    renderChart("#bar_graph", spec, opts).then(results => {
      results.view.height(
        document.getElementById("bar_graph").offsetHeight - 10
      );
      results.view.insert("bardata", data).run();
      results.view.addEventListener("click", (name, value) => {
        // console.log(value);
        if (value.datum) {
          setSelectedState(value.datum.state);
        }
      });
    });
  });

  return (
    <div className="container">
      <div className="row">
        <div id="bar_graph" className="col-sm-12 col-md-8 col-lg-8" />

        <StateDetailsChart
          state={selectedState}
          data={data}
          condition={props.condition}
        />
      </div>
    </div>
  );
};

export default StateBarChart;
