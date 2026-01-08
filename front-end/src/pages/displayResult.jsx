import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import "../App.css";
import Footer from "../components/Footer";
import Graph from "../components/Graph";

import {
  filterActivitiesByType,
  getAccessToken,
  getAthlete,
  getAthleteActivities,
  getAthleteClubs,
  getClubActivities,
  refreshAccessToken,
} from "../components/helpers.js";
import Last5RunsTable from "../components/Last5RunsTable.jsx";
import TopStatContainer from "../components/TopStatContainer.jsx";
import OtherStats from "../components/OtherStats.jsx";
import SliderToggle from "../components/SliderToggle.jsx";

function DisplayResults() {
  const [athlete, setAthlete] = useState({});
  const [allActivities, setAllActivities] = useState([]);
  const [activitiesToDisplay, setActivitiesToDisplay] = useState([]);
  const [currentlyDisplaying, setCurrentlyDisplaying] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [memberOfQualifiedClub, setMemberOfQualifiedClub] = useState(false);
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
    // const athleteClubs = await getAthleteClubs(stravaData.accessToken);
    const athleteClubs = [
      // DEV MODE
      {
        id: 231696,
        resource_state: 2,
        name: "New Balance Run Club",
        profile_medium:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/231696/10568969/6/medium.jpg",
        profile:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/231696/10568969/6/large.jpg",
        cover_photo:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/231696/5199650/24/large.jpg",
        cover_photo_small:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/231696/5199650/24/small.jpg",
        activity_types: ["Run", "VirtualRun", "Wheelchair"],
        activity_types_icon: "sports_run_normal",
        dimensions: [
          "distance",
          "num_activities",
          "best_activities_distance",
          "elev_gain",
          "moving_time",
          "velocity",
        ],
        sport_type: "running",
        localized_sport_type: "Running",
        city: "Boston",
        state: "Massachusetts",
        country: "United States",
        private: false,
        member_count: 184380,
        featured: false,
        verified: true,
        url: "NewBalanceRunClub",
      },
      {
        id: 1229955,
        resource_state: 2,
        name: "Good Growth",
        profile_medium:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/1229955/30492293/1/medium.jpg",
        profile:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/1229955/30492293/1/large.jpg",
        cover_photo:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/1229955/30492313/3/large.jpg",
        cover_photo_small:
          "https://dgalywyr863hv.cloudfront.net/pictures/clubs/1229955/30492313/3/small.jpg",
        activity_types: [],
        activity_types_icon: "sports_multi_normal",
        dimensions: ["moving_time", "num_activities", "distance", "elev_gain"],
        sport_type: "other",
        localized_sport_type: "Multisport",
        city: "Exeter",
        state: "England",
        country: "United Kingdom",
        private: false,
        member_count: 21,
        featured: false,
        verified: false,
        url: "good-growth",
      },
      {
        id: 1406254,
        resource_state: 2,
        name: "test1",
        profile_medium: "avatar/club/medium.png",
        profile: "avatar/club/large.png",
        cover_photo: null,
        cover_photo_small: null,
        activity_types: [
          "Handcycle",
          "EBikeRide",
          "VirtualRide",
          "Velomobile",
          "Ride",
        ],
        activity_types_icon: "sports_bike_normal",
        dimensions: [
          "distance",
          "num_activities",
          "best_activities_distance",
          "velocity",
          "elev_gain",
          "moving_time",
        ],
        sport_type: "cycling",
        localized_sport_type: "Cycling",
        city: "Wolverhampton",
        state: "England",
        country: "United Kingdom",
        private: false,
        member_count: 1,
        featured: false,
        verified: false,
        url: "testclub92",
      },
    ];

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
          loadingState={loadingState}
          clubs={memberOfQualifiedClub}
        />
        <TopStatContainer
          loadingState={loadingState}
          activities={activitiesToDisplay}
          currentlyDisplaying={currentlyDisplaying}
        />

        <div className="graph-collection">
          <Graph
            data={activitiesToDisplay}
            graphNum={1}
            time={"month"}
            title={"Monthly Total (km)"}
            lineGraph={true}
            loadingState={loadingState}
            currentlyDisplaying={currentlyDisplaying}
          />
          <Graph
            data={activitiesToDisplay}
            graphNum={2}
            time={"day"}
            title={"Daily Total (km)"}
            lineGraph={false}
            loadingState={loadingState}
          />
        </div>
        <div className="bottom-stat-collection">
          <Last5RunsTable
            loadingState={loadingState}
            activities={activitiesToDisplay}
            currentlyDisplaying={currentlyDisplaying}
          />
          <OtherStats
            loadingState={loadingState}
            activities={activitiesToDisplay}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DisplayResults;
