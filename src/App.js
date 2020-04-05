import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import Timeseries from "./components/timeseries";
import Filter from "./container/Filter";
import { Container } from "@material-ui/core";

export default function App() {
	const [fetched, setFetched] = useState(false);
	const [timeseries, setTimeseries] = useState([]);
	const [statewiseData, setStatewiseData] = useState([]);

	useEffect(() => {
		if (fetched === false) {
			getData();
		}
	}, [fetched]);

	const getData = async () => {
		try {
			const [response, stateDistrictWiseResponse] = await Promise.all([
				axios.get("https://api.covid19india.org/data.json"),
				axios.get("https://api.covid19india.org/state_district_wise.json"),
			]);

			setTimeseries(response.data.cases_time_series);
			setStatewiseData(
				response.data.statewise
				// .filter(row => row["state"].toLowerCase().trim() !== "total")
				// .map(row => {
				//   row["confirmed"] = parseInt(row["confirmed"], 10);
				//   return row;
				// })
			);

			setFetched(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container
			maxWidth="lg"
			className="App"
			style={{ "margin-bottom": "10px" }}
		>
			<h1>COVID-19 Dashboard</h1>
			<h5>
				{" "}
				This site does not make any claim on accuracy but depends on
				api.covid19india.org for data
			</h5>
			<hr />
			<Filter data={statewiseData} />

			<hr />
			<Timeseries timeseries={timeseries} />
		</Container>
	);
}
