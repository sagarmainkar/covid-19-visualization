import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import BarChart from "../components/barchart";

const Filter = props => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    margin: {
      height: theme.spacing(3)
    }
  }));

  const classes = useStyles();

  const [condition, setCondition] = useState(50);

  function handleChangeFilter(value) {
    console.log(`In change ${value}`);
    setCondition(value);
  }

  function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired
  };

  const PrettoSlider = withStyles({
    root: {
      color: "#52af77",
      height: 8
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: "#fff",
      border: "2px solid currentColor",
      marginTop: -8,
      marginLeft: -12,
      "&:focus, &:hover, &$active": {
        boxShadow: "inherit"
      }
    },
    active: {},
    valueLabel: {
      left: "calc(-50% + 4px)"
    },
    track: {
      height: 8,
      borderRadius: 4
    },
    rail: {
      height: 8,
      borderRadius: 4
    }
  })(Slider);

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item lg={4} md={6} xs={9}>
          <Typography gutterBottom>
            Filter States with Confirmed Cases greater than:
          </Typography>
        </Grid>

        <Grid item lg={2} md={3} xs={3}>
          <Slider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={50}
            min={5}
            max={500}
            onChangeCommitted={(e, val) => handleChangeFilter(val)}
          />
        </Grid>
        <Grid item xs={12}>
          <hr />
        </Grid>
        {/* <Grid item sm={12} md={12} lg={12} xs={12} xl={12}>
          <BarChart data={props.data} condition={condition} />
        </Grid> */}
      </Grid>
      <BarChart data={props.data} condition={condition} />
    </div>
  );
};

export default Filter;
