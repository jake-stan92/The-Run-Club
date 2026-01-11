import goldTrophy from "../assets/images/gold-trophy.svg";
import silverTrophy from "../assets/images/silver-trophy.svg";
import bronzeTrophy from "../assets/images/bronze-trophy.svg";

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
        {sortedTableData.map((athlete, index) => (
          <tr key={athlete.name}>
            {/* <td className="club-stats-athlete-name-column">
              {index === 0 ? (
                <img src={goldTrophy} />
              ) : index === 1 ? (
                <img src={silverTrophy} />
              ) : index === 2 ? (
                <img src={bronzeTrophy} />
              ) : null}
              <p>{athlete.name}</p>
            </td> */}
            <td className="club-stats-athlete-name-column">
              {index < 3 ? (
                <img
                  src={[goldTrophy, silverTrophy, bronzeTrophy][index]}
                  alt={`Place ${index + 1}`}
                />
              ) : (
                <p className="clubs-stats-athlete-name-column-img-placeholder">
                  {index + 1}.
                </p>
              )}
              <p>{athlete.name}</p>
            </td>
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
