import React, { useState, useEffect } from "react";
import renderChart from "vega-embed";
import { Container } from "@material-ui/core";

const BarChart = (props) => {
	const [data, setData] = useState(0);

	const spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v4.json",
		title:
			"Confirmed cases by State (Click on a state to view corresponding details in side chart)",

		data: {
			name: "bardata",
		},
		transform: [
			{ calculate: "toNumber(datum.confirmed)", as: "confirmed" },
			{ calculate: "toNumber(datum.active)", as: "active" },
			{ calculate: "toNumber(datum.deaths)", as: "deaths" },
			{ calculate: "toNumber(datum.recovered)", as: "recovered" },

			{ fold: ["active", "confirmed", "recovered", "deaths"] },
			{
				filter: {
					and: [
						{ field: "confirmed", gt: props.condition },
						{ not: { field: "statecode", equal: "TT" } },
					],
				},
			},
		],
		hconcat: [
			{
				layer: [
					{
						selection: {
							brush: {
								type: "single",
								encodings: ["y"],
								fields: ["state"],
								init: { state: "Maharashtra" },
							},
						},
						mark: { type: "bar" },
						encoding: {
							x: {
								field: "confirmed",
								type: "quantitative",
								title: "",

								axis: {
									grid: false,
									ticks: false,
									labels: false,
								},
							},
							y: {
								field: "state",
								type: "nominal",
								sort: { field: "confirmed", order: "descending" },
							},
							color: {
								field: "confirmed",
								type: "quantitative",
								legend: null, //{ title: "Case Type" }
							},
							tooltip: [
								{
									field: "confirmed",
									type: "quantitative",
									title: "Confirmed Cases",
								},
							],
							// ,
							// tooltip: [
							//   { field: "deaths", type: "quantitative" },
							//   { field: "recovered", type: "quantitative" },
							//   { field: "active", type: "quantitative" },
							//   { field: "confirmed", type: "quantitative" },
							//   { field: "TotalCases", type: "quantitative" }
							// ]
						},
					},
					{
						mark: {
							type: "text",
							align: "right",
						},
						encoding: {
							x: {
								field: "confirmed",
								type: "quantitative",
							},
							y: {
								field: "state",
								type: "nominal",
								sort: { field: "confirmed", order: "descending" },
							},
							text: {
								field: "confirmed",
								type: "quantitative",
								format: ".0f",
							},
							color: {
								condition: {
									test: { field: "confirmed", gt: 200 },
									value: "white",
								},
								value: "black",
							},
						},
					},
				],
			},
			{
				mark: { type: "bar", tooltip: true },

				transform: [
					{
						filter: {
							selection: "brush",
						},
					},
				],
				encoding: {
					x: {
						field: "key",
						type: "nominal",
						sort: { field: "value", order: "descending" },
					},
					y: {
						field: "value",
						type: "quantitative",
					},
					color: {
						field: "key",
						type: "nominal",
						legend: null,
					},
				},
			},
		],
	};
	useEffect(() => {
		if (props.data.length > 1) setData(props.data);
	}, [props.data]);

	useEffect(() => {
		const opts = {
			renderer: "svg",
			actions: false,
		};
		window.onresize = function (event) {
			renderChart("#bar_graph", spec, opts).then((results) => {
				let totalWidth = document.getElementById("bar_graph").offsetWidth - 200;
				const firstGraphWidth = Math.floor(totalWidth * 0.75);
				const secondGraphWidth = Math.floor(totalWidth - firstGraphWidth);
				spec.hconcat[0]["width"] = firstGraphWidth;
				spec.hconcat[1]["width"] = secondGraphWidth;
				results.view.height(
					document.getElementById("bar_graph").offsetHeight - 10
				);
				results.view.insert("bardata", data).run();
			});
		};

		renderChart("#bar_graph", spec, opts).then((results) => {
			let totalWidth = document.getElementById("bar_graph").offsetWidth - 200;
			const firstGraphWidth = Math.floor(totalWidth * 0.75);
			const secondGraphWidth = Math.floor(totalWidth - firstGraphWidth);
			spec.hconcat[0]["width"] = firstGraphWidth;
			spec.hconcat[1]["width"] = secondGraphWidth;
			results.view.height(
				document.getElementById("bar_graph").offsetHeight - 10
			);
			results.view.insert("bardata", data).run();
			window.dispatchEvent(new Event("resize"));
			// results.view.width(
			//   document.getElementById("bar_graph").offsetWidth - 100
			// );

			// window.onresize = function(event) {
			//   results.view.width(
			//     document.getElementById("bar_graph").offsetWidth - 100
			//   );
			//   results.view.run();
			// };
		});
	});

	return <Container id="bar_graph" lg={12} />;
};

export default BarChart;
