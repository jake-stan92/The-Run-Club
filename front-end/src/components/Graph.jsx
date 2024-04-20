import React from "react";
import { useEffect } from "react";
import "./Graph.css";
import Chart from "chart.js/auto";
import { getMonthlyTotals, getWeekNum } from "../components/helpers.js";
import LoadingIcon from "./LoadingIcon.jsx";

const Graph = (props) => {
  const monthlyTotals = getMonthlyTotals(props.data);
  useEffect(() => {
    let currentWeekNum = getWeekNum(new Date());
    let chartLocation = document.getElementById(`graph${props.graphNum}`);
    if (props.lineGraph) {
      const myChart = new Chart(chartLocation, {
        type: "bar",
        data: {
          labels: monthlyTotals.map((row) => row[props.time]),
          datasets: [
            {
              label: props.title,
              data: monthlyTotals.map((row) => row.distance),
              order: 1,
              yAxisID: "y",
              backgroundColor: "#fc5200",
            },
            {
              label: "Total Runs",
              data: monthlyTotals.map((row) => row.count),
              type: "line",
              order: 0,
              yAxisID: "y1",
              borderWidth: 2, // change line width here
              backgroundColor: "black",
            },
          ],
        },
        options: {
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              grid: {
                drawOnChartArea: false, // only want 1 set of grid lines
              },
            },
          },
        },
      });
      return () => {
        myChart.destroy();
      };
    } else {
      const myChart = new Chart(chartLocation, {
        type: "bar",
        data: {
          labels: monthlyTotals.map((row) => row[props.time]),
          datasets: [
            {
              label: `${props.title} - Week${currentWeekNum}`,
              data: monthlyTotals.map((row) => row.distance),
              order: 1,
              yAxisID: "y",
              backgroundColor: "#fc5200",
            },
          ],
        },
        options: {
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
            },
          },
        },
      });
      return () => {
        myChart.destroy();
      };
    }
    // when component unmounts // prevents console error of already used chart canvas
  }, [monthlyTotals]);

  return (
    <div className="graph-container">
      {!props.loadingState ? (
        <canvas id={`graph${props.graphNum}`}></canvas>
      ) : (
        <LoadingIcon />
      )}
    </div>
  );
};

export default Graph;
