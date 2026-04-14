import CEO from "../../../utils/common/CEO.js";
import initiatives from "./dummy-data.js";

class StrategicInitTrackingController {
  #ceoObj;
  constructor() {
    this.#ceoObj = new CEO();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.startDate >= startDate && obj.startDate <= endDate
    );

    const ownerDepts = this.#getTopOwnersDepartments(data);
    const statusCounts = this.#getInitiativeCountsByStatus(data);

    return {
      data: filteredData,
      summary: {
        most_completed_owner: ownerDepts.topOwners.Completed,
        most_halted_owner: ownerDepts.topOwners.Halted,
        most_completed_dept: ownerDepts.topDepartments.Completed,
        most_halted_dept: ownerDepts.topDepartments.Halted,
        status_counts: statusCounts,
      },
    };
  }

  #getInitiativeCountsByStatus(data) {
    const statusCounts = {};

    data.forEach((record) => {
      const { status } = record;
      if (!statusCounts[status]) statusCounts[status] = 0;
      statusCounts[status]++;
    });

    return statusCounts;
  }

  #getTopOwnersDepartments(data) {
    const ownerCounts = { Completed: {}, Halted: {} };
    const deptCounts = { Completed: {}, Halted: {} };

    data.forEach((record) => {
      const { status, owner, department } = record;
      if (status === "Completed" || status === "Halted") {
        if (!ownerCounts[status][owner]) ownerCounts[status][owner] = 0;
        ownerCounts[status][owner]++;

        if (!deptCounts[status][department]) deptCounts[status][department] = 0;
        deptCounts[status][department]++;
      }
    });

    const getTop = (counts) =>
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;

    return {
      topOwners: {
        Completed: getTop(ownerCounts.Completed),
        Halted: getTop(ownerCounts.Halted),
      },
      topDepartments: {
        Completed: getTop(deptCounts.Completed),
        Halted: getTop(deptCounts.Halted),
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#ceoObj.getInRangeSalesAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(
      initiatives,
      startDate,
      endDate
    );
    return processedAnalytics;
  }
}

export default StrategicInitTrackingController;
