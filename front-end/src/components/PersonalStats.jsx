import TopStatContainer from "./TopStatContainer";
import Graph from "./Graph";
import Last5RunsTable from "./Last5RunsTable";
import OtherStats from "./OtherStats";

export default function PersonalStats({
  loadingState,
  activitiesToDisplay,
  currentlyDisplaying,
}) {
  return (
    <>
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
    </>
  );
}
