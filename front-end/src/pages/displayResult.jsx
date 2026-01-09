import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import "../App.css";
import Footer from "../components/Footer";

import {
  filterActivitiesByType,
  getAccessToken,
  getAthlete,
  getAthleteActivities,
  getAthleteClubs,
  getClubActivities,
  refreshAccessToken,
} from "../components/helpers.js";
import SliderToggle from "../components/SliderToggle.jsx";
import PersonalStats from "../components/PersonalStats.jsx";
import ClubStats from "../components/ClubStats.jsx";

function DisplayResults() {
  const [athlete, setAthlete] = useState({});
  const [allActivities, setAllActivities] = useState([]);
  const [activitiesToDisplay, setActivitiesToDisplay] = useState([]);
  const [currentlyDisplaying, setCurrentlyDisplaying] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [memberOfQualifiedClub, setMemberOfQualifiedClub] = useState(false);
  const [statType, setStatType] = useState("personal");
  const navigate = useNavigate();
  const { state } = useLocation();
  let qualifyingClubs = [];

  // define outside of use effect to avoid errors
  const bigAPICall = async () => {
    setLoadingState(true);

    let stravaData = null;

    // 1. Check localStorage for existing tokens
    const storedTokens = localStorage.getItem("stravaTokens");
    if (storedTokens) {
      stravaData = JSON.parse(storedTokens);
    }

    // 2. If we have tokens, check expiry
    if (stravaData) {
      const isExpired = Date.now() / 1000 > stravaData.expiresAt - 60; // refresh 1 min early to avoid errors

      if (isExpired) {
        // 3. Refresh expired token
        const refreshed = await refreshAccessToken(stravaData.refreshToken);

        if (!refreshed) {
          navigate("/error", {
            replace: true,
            state: { message: "Session expired. Please re-authorise." },
          });
          return;
        }

        stravaData = refreshed;
        localStorage.setItem("stravaTokens", JSON.stringify(refreshed));
      }
    }

    // 4. No stored token → try OAuth code
    if (!stravaData) {
      if (!state?.code) {
        navigate("/error", {
          replace: true,
          state: { message: "Missing Strava authorisation code" },
        });
        return;
      }

      const tokenResponse = await getAccessToken(state.code);

      if (!tokenResponse) {
        navigate("/error", {
          replace: true,
          state: { message: "Failed to get access token, please try again" },
        });
        return;
      }

      stravaData = tokenResponse;
      localStorage.setItem("stravaTokens", JSON.stringify(tokenResponse));
    }

    // obtain user data
    const athlete = await getAthlete(stravaData.accessToken);
    if (athlete) {
      setAthlete(athlete);
      // console.log(athlete);
    } else {
      navigate("/error", {
        replace: true,
        state: {
          message: "Failed to get athlete data, please try again",
        },
      });
    }

    // obtain activities for auth user
    let activities;
    const cachedActivities = sessionStorage.getItem("cached-strava-activities");
    if (cachedActivities) {
      const parsed = JSON.parse(cachedActivities);
      if (Date.now() < parsed.expires) {
        // in date, use
        activities = parsed.activities;
        console.log("present and valid, using cached data");
      } else {
        // Expired, retrieve new
        activities = await getAthleteActivities(stravaData.accessToken);
        sessionStorage.setItem(
          "cached-strava-activities",
          JSON.stringify({
            activities: activities,
            expires: Date.now() + 10 * 60 * 1000,
          })
        );
        console.log("present but expired, retrieve new");
      }
    } else {
      activities = await getAthleteActivities(stravaData.accessToken);
      sessionStorage.setItem(
        "cached-strava-activities",
        JSON.stringify({
          activities: activities,
          expires: Date.now() + 10 * 60 * 1000,
        })
      );
      console.log("retrieved brand new data as none present");
    }

    if (activities) {
      setAllActivities(activities);
    } else {
      navigate("/error", {
        replace: true,
        state: {
          message:
            "Failed to get athlete activities, please tick both boxes on authorisation screen.",
        },
      });
    }

    // get clubs for auth athlete:
    let athleteClubs = [];
    const cachedclubs = sessionStorage.getItem("strava-cached-clubs");
    if (cachedclubs) {
      const parsed = JSON.parse(cachedclubs);
      if (Date.now() < parsed.expires) {
        // in date, use
        console.log(parsed);
        athleteClubs = parsed.clubs;
        console.log("clubs present and valid, using cached data");
      } else {
        // Expired, retrieve new
        athleteClubs = await getAthleteClubs(stravaData.accessToken);
        sessionStorage.setItem(
          "strava-cached-clubs",
          JSON.stringify({
            clubs: athleteClubs,
            expires: Date.now() + 10 * 60 * 1000,
          })
        );
        console.log("clubs present but expired, retrieve new");
      }
    } else {
      athleteClubs = await getAthleteClubs(stravaData.accessToken);
      sessionStorage.setItem(
        "strava-cached-clubs",
        JSON.stringify({
          clubs: athleteClubs,
          expires: Date.now() + 10 * 60 * 1000,
        })
      );
      console.log("clubs fetched brand new");
    }

    if (athleteClubs.length > 0) {
      const ggID = 1229955;
      const albID = 1406254;
      const ggClub = athleteClubs.find((club) => club.id === ggID);
      const albClub = athleteClubs.find((club) => club.id === albID);

      if (ggClub) {
        console.log("found gg club memebership");
        qualifyingClubs.push(ggClub);
      }

      if (albClub) {
        console.log("found alb club membership");
        qualifyingClubs.push(albClub);
      }

      console.log(qualifyingClubs);

      if (ggClub || albClub) {
        setMemberOfQualifiedClub(true);
      }
    }
    // const clubActivities = await getClubActivities(
    //   stravaData.accessToken,
    //   1406254 // get this dynamically
    // );
    const allRuns = filterActivitiesByType("Run", activities);
    setActivitiesToDisplay(allRuns);
    setLoadingState(false);
    setCurrentlyDisplaying("Runs");
  };

  useEffect(() => {
    bigAPICall();
  }, []);

  const populateWalks = () => {
    const allWalks = filterActivitiesByType("Walk", allActivities);
    setActivitiesToDisplay(allWalks);
    setCurrentlyDisplaying("Walks");
  };

  const populateRuns = () => {
    const allRuns = filterActivitiesByType("Run", allActivities);
    setActivitiesToDisplay(allRuns);
    setCurrentlyDisplaying("Runs");
  };

  const populateRides = () => {
    const allRides = filterActivitiesByType(
      ["Ride", "VirtualRide"],
      allActivities
    );
    setActivitiesToDisplay(allRides);
    setCurrentlyDisplaying("Rides");
  };

  return (
    <>
      <Header athlete={athlete} />
      <div className="main">
        <SliderToggle
          populateRuns={populateRuns}
          populateWalks={populateWalks}
          populateRides={populateRides}
          setStatType={setStatType}
          loadingState={loadingState}
          clubs={memberOfQualifiedClub}
        />
        {statType === "personal" && (
          <PersonalStats
            loadingState={loadingState}
            activitiesToDisplay={activitiesToDisplay}
            currentlyDisplaying={currentlyDisplaying}
          />
        )}

        {statType === "clubs" && <ClubStats />}
      </div>
      <Footer />
    </>
  );
}

export default DisplayResults;
