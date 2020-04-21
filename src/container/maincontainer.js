import React, { useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import StateBarChart from "../components/barchart";
import IndiaMap from "../components/indiamap";

const MainContainer = props => {
  const [showMap, setShowMap] = React.useState(true);
  const handleChange = event => {
    setShowMap(!showMap);
  };

  return (
    <div className="container-fluid">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          checked={showMap}
          class="custom-control-input"
          id="toggleViewButton"
          onChange={e => handleChange(e)}
        />
        <label class="custom-control-label" for="toggleViewButton">
          Visualize data as a :{showMap ? "Bar Chart" : "Map"}
        </label>
      </div>
      {showMap ? (
        <IndiaMap data={props.data} />
      ) : (
        <StateBarChart data={props.data} />
      )}
    </div>
  );
};

export default MainContainer;
