import SpecializedRoles from "../../../utils/common/SpecializedRoles.js";
import assessments from "./dummy-data.js";

class MitigationEffController {
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
      summary: this.#generateOverallRiskSummary(filteredData),
    };
  }

  #generateOverallRiskSummary(data) {
    const summary = {
      totalRisks: 0,
      mitigatedRisks: 0,
      avgMitigationEffectiveness: 0,
      topIneffectiveControls: {},
      avgResidualRiskScore: 0,
    };

    let totalEffectiveness = 0;
    let totalResidualScore = 0;

    data.forEach((entry) => {
      entry.departments.forEach((dept) => {
        summary.totalRisks += dept.totalRisks;
        summary.mitigatedRisks += dept.mitigatedRisks;
        totalEffectiveness += dept.mitigationEffectiveness;
        totalResidualScore += dept.residualRiskScore;

        dept.topIneffectiveControls.forEach((control) => {
          summary.topIneffectiveControls[control] =
            (summary.topIneffectiveControls[control] || 0) + 1;
        });
      });
    });

    const totalDepartments = data.reduce(
      (sum, entry) => sum + entry.departments.length,
      0
    );

    summary.avgMitigationEffectiveness = totalDepartments
      ? parseFloat((totalEffectiveness / totalDepartments).toFixed(2))
      : 0;

    summary.avgResidualRiskScore = totalDepartments
      ? parseFloat((totalResidualScore / totalDepartments).toFixed(2))
      : 0;

    summary.topIneffectiveControls = Object.entries(
      summary.topIneffectiveControls
    )
      .sort((a, b) => b[1] - a[1])
      .map(([control]) => control);

    return summary;
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#specializedRoles.getInRangeAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(
      assessments,
      startDate,
      endDate
    );
    return processedAnalytics;
  }
}

export default MitigationEffController;
