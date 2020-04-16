import React, { useEffect } from "react";
import renderChart from "vega-embed";

const StateDetailsChart = props => {
  const spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    title: "Confirmed cases by State",

    data: {
      name: "statedata"
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
            { not: { field: "statecode", equal: "TT" } },
            { field: "state", equal: props.state }
          ]
        }
      }
    ],
    width: "container",
    height: 500,
    mark: "bar",
    encoding: {
      x: {
        field: "key",
        type: "nominal",
        title: props.state,
        sort: { field: "value", order: "descending" }
      },
      y: {
        field: "value",
        title: "Count",
        type: "quantitative"
      },
      color: {
        field: "key",
        type: "nominal"
      }
    }
  };

  useEffect(() => {
    if (props.data.length > 1) {
      console.log("StateDetailsChart: useEffect");
      const opts = {
        renderer: "svg",
        actions: false
      };
      renderChart("#statedetails_chart", spec, opts).then(results => {
        results.view.height(
          document.getElementById("statedetails_chart").offsetHeight - 10
        );
        results.view.insert("statedata", props.data).run();
      });
    }
  });

  return (
    <div id="statedetails_chart" className="col-sm-12 col-md-4 col-lg-4" />
  );
};

export default StateDetailsChart;
