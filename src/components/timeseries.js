import React, { useState, useEffect } from "react";
import renderChart from "vega-embed";
import { Container } from "@material-ui/core";

function TimeSeries(props) {
  const [timeseries, setTimeseries] = useState([]);

  let spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    description: "Corona Virus count over time",
    title: "Corona Virus cases over time",
    width: "container",
    autosize: {
      type: "fit",

      resize: true
    },

    data: {
      name: "tsdata"
    },
    transform: [
      { fold: ["totalconfirmed", "totalrecovered", "totaldeceased"] }
    ],
    encoding: {
      color: {
        condition: {
          selection: "hover",
          field: "key",
          type: "nominal",
          legend: null
        },
        value: "grey"
      },
      opacity: { condition: { selection: "hover", value: 1 }, value: 0.2 }
    },
    layer: [
      {
        encoding: {
          x: { field: "date", type: "temporal", axis: { grid: false } },
          y: { field: "value", type: "quantitative", axis: { grid: false } }
        },

        layer: [
          {
            description:
              "transparent layer to make it easier to trigger selection",
            selection: {
              hover: {
                type: "single",
                on: "mouseover",
                empty: "all",
                fields: ["key"],
                init: { key: "totalconfirmed" }
              }
            },
            mark: {
              type: "line",
              strokeWidth: 8,
              stroke: "transparent",
              tootip: true
            }
          },
          { mark: "line" }
        ]
      },

      {
        encoding: {
          x: { aggregate: "max", field: "date", type: "temporal" },
          y: {
            aggregate: { argmax: "date" },
            field: "value",
            type: "quantitative"
          }
        },
        layer: [
          { mark: { type: "circle" } },

          {
            mark: { type: "text", align: "left", dx: 4 },
            encoding: { text: { field: "key", type: "nominal" } }
          }
        ]
      }
    ]
  };

  const graphData = timeseries => {
    const opts = {
      renderer: "svg",
      actions: false
    };
    renderChart("#ts_container", spec, opts).then(results => {
      results.view.width(document.getElementById("ts_container").offsetWidth);
      results.view.height(
        document.getElementById("ts_container").offsetHeight - 10
      );

      window.onresize = function(event) {
        results.view.width(document.getElementById("ts_container").offsetWidth);
        results.view.run();
      };

      results.view.insert("tsdata", timeseries).run();
    });
  };
  useEffect(() => {
    if (props.timeseries.length > 1) {
      setTimeseries(props.timeseries);
    }
  }, [props.timeseries]);

  useEffect(() => {
    if (timeseries.length > 1) graphData(timeseries);
  }, [timeseries.length]);

  return <Container id="ts_container" maxWidth="md" />;
}

export default TimeSeries;
