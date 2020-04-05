import React, { useState, useEffect } from "react";
import renderChart from "vega-embed";
import { Container } from "@material-ui/core";

function BubblePlot(props) {
  const [data, setData] = useState([]);

  let spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    width: "container",
    autosize: {
      type: "fit",

      resize: true
    },
    data: {
      name: "statedata"
    },
    transform: [
      { filter: { not: { field: "state", equal: "Total" } } },
      { calculate: "toNumber(datum.confirmed)", as: "confirmed" },
      { calculate: "toNumber(datum.active)", as: "active" },
      { calculate: "toNumber(datum.deaths)", as: "deaths" }
    ],
    selection: {
      view: { type: "interval", bind: "scales" }
    },
    mark: "circle",
    encoding: {
      y: {
        field: "confirmed",
        type: "quantitative"
      },
      x: {
        field: "active",
        type: "quantitative"
      },
      size: { field: "deaths", type: "quantitative" },
      color: { value: "#000" }
    }
  };

  useEffect(() => {
    if (props.data.length > 1) setData(props.data);
  }, [props.data]);

  useEffect(() => {
    renderChart("#bubble_chart", spec).then(results => {
      results.view.insert("bardata", data).run();
      results.view.width(
        document.getElementById("bubble_chart").offsetWidth - 100
      );
      results.view.height(
        document.getElementById("bubble_chart").offsetHeight - 10
      );

      window.onresize = function(event) {
        results.view.width(
          document.getElementById("bubble_chart").offsetWidth - 100
        );
        results.view.run();
      };
    });
  }, [data.length]);

  return <Container id="bubble_chart" maxWidth="md" />;
}

export default BubblePlot;
