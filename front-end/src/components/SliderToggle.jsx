import React from "react";
import { useState } from "react";
import "./SliderToggle.css";
import runningIcon from "../assets/images/running-man.svg";
import walkingIcon from "../assets/images/person-walking.svg";
import cyclingIcon from "../assets/images/cycling-man.svg";
import groupIcon from "../assets/images/group-icon.svg";

const SliderToggle = ({
  populateRides,
  populateRuns,
  populateWalks,
  loadingState,
  clubs,
}) => {
  const [runActive, setRunActive] = useState(true);
  const [walkActive, setWalkActive] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);

  const handleToggle = (e) => {
    if (e.target.value === "walking") {
      // e.target.value = "off";
      populateWalks();
      setRunActive(false);
      setWalkActive(true);
      setCycleActive(false);
    } else if (e.target.value === "running") {
      // e.target.value = "on";
      populateRuns();
      setRunActive(true);
      setWalkActive(false);
      setCycleActive(false);
    } else if (e.target.value === "cycling") {
      populateRides();
      setCycleActive(true);
      setRunActive(false);
      setWalkActive(false);
    }
  };
  return (
    <>
      {!loadingState ? (
        <>
          <form action="#" onChange={handleToggle}>
            <div className="slider-container">
              <input
                type="radio"
                name="activity"
                value="walking"
                id="walking-radio"
              />
              <label
                htmlFor="walking-radio"
                className={walkActive ? "label-active" : ""}
              >
                <img className={walkActive ? "active" : ""} src={walkingIcon} />
              </label>
              <input
                type="radio"
                name="activity"
                value="running"
                id="running-radio"
              />
              <label
                htmlFor="running-radio"
                className={runActive ? "label-active" : ""}
              >
                <img className={runActive ? "active" : ""} src={runningIcon} />
              </label>
              <input
                type="radio"
                name="activity"
                value="cycling"
                id="cycling-radio"
              />
              <label
                htmlFor="cycling-radio"
                className={cycleActive ? "label-active" : ""}
              >
                <img
                  className={cycleActive ? "active" : ""}
                  src={cyclingIcon}
                />
              </label>
              {clubs && (
                <a href="/clubs">
                  <img src={groupIcon}></img>
                </a>
              )}
            </div>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SliderToggle;
