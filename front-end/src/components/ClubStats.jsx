import { filterActivitiesByType, getTotalDistance } from "./helpers";

export default function ClubStats({ allClubsData }) {
  console.log(allClubsData);
  const formatted = allClubsData[0].clubActivities.map((entry) => ({
    ...entry,
    athleteName: `${entry.athlete.firstname} ${entry.athlete.lastname}`,
  }));

  const groupedArray = Object.values(
    formatted.reduce((acc, entry) => {
      if (!acc[entry.athleteName]) {
        acc[entry.athleteName] = { name: entry.athleteName, activities: [] };
      }
      acc[entry.athleteName].activities.push(entry);
      return acc;
    }, {})
  );

  const tableData = [];
  // Run Walk Ride totals
  groupedArray.forEach((member) => {
    const memberWalks = filterActivitiesByType("Walk", member.activities);
    const memberRuns = filterActivitiesByType("Run", member.activities);
    const memberRides = filterActivitiesByType("Ride", member.activities);

    const walkTotalDistance = Number(getTotalDistance(memberWalks));
    const runTotalDistance = Number(getTotalDistance(memberRuns));
    const rideTotalDistance = Number(getTotalDistance(memberRides));
    const totalDistance =
      walkTotalDistance + runTotalDistance + rideTotalDistance;

    // adjust each activity type to account weighted totals
    const weightedTotalDistance = (
      walkTotalDistance +
      runTotalDistance * 0.75 +
      rideTotalDistance * 0.3
    ).toFixed(2);

    tableData.push({
      name: member.name,
      numWalks: memberWalks.length,
      walkTotalDistance,
      numruns: memberRuns.length,
      runTotalDistance,
      numRides: memberRides.length,
      rideTotalDistance,
      totalDistance,
      weightedTotalDistance,
    });
  });

  console.log(tableData);

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        {/* show totals only on mobile (not individual activity totals) */}
        <tr>
          <th>Name</th>
          {/* <th>Walks</th> */}
          {/* <th>Walk</th> */}
          {/* <th>Runs</th> */}
          {/* <th>Run</th> */}
          {/* <th>Rides</th> */}
          {/* <th>Ride</th> */}
          <th>Total</th>
          <th>Weighted</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((athlete) => (
          <tr key={athlete.name}>
            <td>{athlete.name}</td>
            {/* <td>{athlete.numWalks}</td> */}
            {/* <td>{athlete.walkTotalDistance}</td> */}
            {/* <td>{athlete.numruns}</td> */}
            {/* <td>{athlete.runTotalDistance}</td> */}
            {/* <td>{athlete.numRides}</td> */}
            {/* <td>{athlete.rideTotalDistance}</td> */}
            <td>{athlete.totalDistance}</td>
            <td>{athlete.weightedTotalDistance}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
