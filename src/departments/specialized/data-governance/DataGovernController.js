import SpecializedRoles from "../../../utils/common/SpecializedRoles.js";
import reports from "./dummy-data.js";

class DataGovernController {
  #specializedRoles;
  constructor() {
    this.#specializedRoles = new SpecializedRoles();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    return {
      data: filteredData,
      summary: this.#summarizeGovernanceData(filteredData),
    };
  }

  #summarizeGovernanceData(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { error: "Invalid or empty dataset." };
    }

    let totalRecords = 0;
    let totalQuality = 0;
    let compliantCount = 0;
    let nonCompliantCount = 0;
    let totalEntries = 0;
    const departmentStats = {};

    const startDate = data[0].date;
    const endDate = data[data.length - 1].date;

    data.forEach((entry) => {
      entry.departments.forEach((dept) => {
        totalRecords += dept.records_checked;
        totalQuality += dept.data_quality_score;
        totalEntries++;

        if (dept.compliance_status === "Compliant") compliantCount++;
        else nonCompliantCount++;

        if (!departmentStats[dept.department]) {
          departmentStats[dept.department] = {
            totalQuality: 0,
            totalRecords: 0,
            count: 0,
          };
        }
        departmentStats[dept.department].totalQuality +=
          dept.data_quality_score;
        departmentStats[dept.department].totalRecords += dept.records_checked;
        departmentStats[dept.department].count++;
      });
    });

    const departmentAverages = Object.fromEntries(
      Object.entries(departmentStats).map(([dept, stats]) => [
        dept,
        {
          avgQualityScore: (stats.totalQuality / stats.count).toFixed(2),
          avgRecordsChecked: Math.round(stats.totalRecords / stats.count),
        },
      ])
    );

    return {
      dateRange: { start: startDate, end: endDate },
      totalRecordsChecked: totalRecords,
      averageQualityScore: (totalQuality / totalEntries).toFixed(2),
      complianceSummary: {
        compliant: compliantCount,
        nonCompliant: nonCompliantCount,
      },
      departmentAverages,
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    const processedAnalytics = this.#processData(reports, startDate, endDate);
    return processedAnalytics;
  }
}

export default DataGovernController;
