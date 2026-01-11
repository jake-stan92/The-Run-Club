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
  setStatType,
  clubs,
}) => {
  const [runActive, setRunActive] = useState(true);
  const [walkActive, setWalkActive] = useState(false);
  const [cycleActive, setCycleActive] = useState(false);
  const [clubsActive, setClubsActive] = useState(false);

  const handleToggle = (e) => {
    if (e.target.value === "walking") {
      // e.target.value = "off";
      setStatType("personal");
      populateWalks();
      setRunActive(false);
      setWalkActive(true);
      setCycleActive(false);
      setClubsActive(false);
    } else if (e.target.value === "running") {
      // e.target.value = "on";
      setStatType("personal");
      populateRuns();
      setRunActive(true);
      setWalkActive(false);
      setCycleActive(false);
      setClubsActive(false);
    } else if (e.target.value === "cycling") {
      setStatType("personal");
      populateRides();
      setCycleActive(true);
      setRunActive(false);
      setWalkActive(false);
      setClubsActive(false);
    } else if (e.target.value === "clubs") {
      setStatType("clubs");
      setCycleActive(false);
      setRunActive(false);
      setWalkActive(false);
      setClubsActive(true);
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
                <>
                  <input
                    type="radio"
                    name="activity"
                    value="clubs"
                    id="clubs-radio"
                  />
                  <label
                    htmlFor="clubs-radio"
                    className={clubsActive ? "label-active" : ""}
                  >
                    <img
                      className={clubsActive ? "active" : ""}
                      src={groupIcon}
                    />
                  </label>
                </>
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
