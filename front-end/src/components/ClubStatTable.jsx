import "./ClubStatTable.css";

export default function ClubStatTable({ tableData, filter }) {
  // sort data based on filter
  const sortKeyMap = {
    total: "totalDistance",
    walk: "walkTotalDistance",
    run: "runTotalDistance",
    ride: "rideTotalDistance",
    weighted: "weightedTotalDistance",
  };

  function sortAthletes(data, filter) {
    const key = sortKeyMap[filter.toLowerCase()];

    return [...data].sort((a, b) => {
      return Number(b[key]) - Number(a[key]);
    });
  }

  const sortedTableData = sortAthletes(tableData, filter);

  return (
    <table
      className="clubs-stats-table bordered"
      style={{ borderCollapse: "collapse" }}
    >
      <thead>
        {/* show totals only on mobile (not individual activity totals) */}
        <tr>
          <th>Name</th>
          <th>{filter} (km)</th>
        </tr>
      </thead>
      <tbody>
        {sortedTableData.map((athlete) => (
          <tr key={athlete.name}>
            <td className="club-stats-athlete-name-column">{athlete.name}</td>
            {/* <td>{athlete.numWalks}</td> */}
            {filter === "Walk" && <td>{athlete.walkTotalDistance}</td>}

            {/* <td>{athlete.numruns}</td> */}
            {filter === "Run" && <td>{athlete.runTotalDistance}</td>}

            {/* <td>{athlete.numRides}</td> */}
            {filter === "Ride" && <td>{athlete.rideTotalDistance}</td>}

            {filter === "Total" && <td>{athlete.totalDistance}</td>}
            {filter === "Weighted" && <td>{athlete.weightedTotalDistance}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
