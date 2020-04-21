import React, { useEffect, useRef, useCallback } from "react";
import renderChart from "vega-embed";
import { useResizeObserver } from "../utils/hooks";

const IndiaMap = props => {
  const spec = {
    width: "container",
    height: 500,
    padding: { top: 0, left: 0, right: 0, bottom: 0 },

    data: [
      {
        name: "indiadata"
      },
      {
        name: "indiaArea",
        url: "maps/india.json",
        format: { type: "topojson", feature: "india" },
        transform: [
          {
            type: "geopath",
            projection: "projection"
          },

          {
            type: "lookup",
            from: "indiadata",
            key: "state",
            fields: ["properties.st_nm"],
            as: ["cases"]
          },

          {
            type: "formula",
            as: "density",
            expr: "datum.cases.confirmed"
          }
        ]
      }
    ],

    projections: [
      {
        name: "projection",
        type: "mercator",
        scale: 500,
        center: [95, 23]
      }
    ],
    signals: [
      {
        name: "hover",
        init: null,
        streams: [
          { type: "shape:mouseover", expr: "datum" },
          { type: "shape:mouseout", expr: "null" }
        ]
      },
      {
        name: "title",
        init: null,
        streams: [
          {
            type: "hover",
            expr: "hover ? hover.NAME"
          }
        ]
      },
      {
        name: "mapSelection",
        on: [{ events: "shape:click", update: "datum" }]
      }
    ],
    scales: [
      {
        name: "color",
        type: "quantize",
        domain: [0, 3202],
        reverse: false,
        range: { scheme: "blues", count: 20 }
      }
    ],
    legends: [
      {
        fill: "color",
        offset: 0,
        type: "gradient",
        gradientLength: {
          signal: "clamp(height, 65, 200)"
        },
        title: "Corona Cases of State",
        orient: "top-left"
      }
    ],
    marks: [
      {
        type: "shape",
        from: { data: "indiaArea" },
        encode: {
          enter: {
            path: { field: "layout_path" },
            fill: { value: "#aaaaaa" },
            stroke: { value: "black" },
            tooltip: {
              signal:
                "{'State': datum.properties.st_nm,  'Confirmed': datum.cases.confirmed ,'Active': datum.cases.active,'Recovered': datum.cases.recovered,'Deaths':datum.cases.deaths}"
            }
          },
          update: {
            path: { field: "path" },
            stroke: { value: "white" },
            fill: { scale: "color", field: "density" },
            zindex: { value: 0 }
          },
          hover: {
            strokeWidth: { value: 1 },
            stroke: { value: "firebrick" },
            zindex: { value: 1 },
            fill: { value: "red" }
          },
          exit: {
            stroke: { value: "white" }
          }
        },
        transform: [{ type: "geoshape", projection: "projection" }]
      },

      {
        type: "text",
        interactive: false,
        encode: {
          enter: {
            x: { value: 895 },
            y: { value: 0 },
            fill: { value: "black" },
            fontSize: { value: 20 },
            align: { value: "right" }
          },
          update: {
            text: { signal: "title" }
          }
        }
      }
    ]
  };
  // const wrapperRef = useRef();
  // const dimensions = useResizeObserver(wrapperRef);

  // const graphData = useCallback(() => {
  //   if (!dimensions) return;
  //   const width = dimensions.width;
  //   const height = dimensions.height;

  //   spec.projections.scale = Math.floor((width * 3) / 4);
  //   spec.projections.center = [Math.floor(width / 2, height / 2)];
  // }, [dimensions]);

  useEffect(() => {
    console.log("IndiaMap: useEffect");
    console.log(window.width);
    if (props.data.length > 1) {
      const opts = {
        renderer: "svg",
        actions: false
      };
      const data = transformData(props.data.filter(d => d.statecode !== "TT"));
      spec.scales[0].domain[1] = data.sort(
        (a, b) => a.confirmed > b.confirmed
      )[0].confirmed;

      spec.scales[0].range.count = Math.floor(spec.scales[0].domain[1] / 37);
      renderChart("#map_chart", spec, opts).then(results => {
        results.view.height(
          document.getElementById("map_chart").offsetHeight - 10
        );

        results.view.insert("indiadata", data).run();
      });
    }
  });

  const transformData = data =>
    data.map(d => {
      d.confirmed = +d.confirmed;
      d.active = +d.active;
      d.recovered = +d.recovered;
      d.deaths = +d.deaths;
      return d;
    });

  return <div id="map_chart" className="container-fluid" />;
};

export default IndiaMap;
