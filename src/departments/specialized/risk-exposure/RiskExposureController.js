import risks from "./dummy-data.js";

class RiskExposureController {
  constructor() {
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

  #generateOverallRiskSummary(weeklyData) {
    const categories = [
      "Financial",
      "Operational",
      "Market",
      "Cyber / IT",
      "Compliance",
    ];
    const categoryTotals = {};
    const categoryCounts = {};

    categories.forEach((cat) => {
      categoryTotals[cat] = 0;
      categoryCounts[cat] = 0;
    });

    const riskLevelScore = {
      Low: 20,
      Moderate: 50,
      High: 80,
    };

    weeklyData.forEach((week) => {
      week.risk_exposure.forEach((cat) => {
        if (categories.includes(cat.category)) {
          categoryTotals[cat.category] += riskLevelScore[cat.risk_level] || 0;
          categoryCounts[cat.category] += 1;
        }
      });
    });

    const avgCategoryRisk = {};
    categories.forEach((cat) => {
      avgCategoryRisk[cat] =
        categoryCounts[cat] > 0
          ? Math.round(categoryTotals[cat] / categoryCounts[cat])
          : 0;
    });

    const overallRiskPercent = Math.round(
      Object.values(avgCategoryRisk).reduce((a, b) => a + b, 0) /
        categories.length
    );

    let overallRiskLevel = "Low";
    if (overallRiskPercent >= 70) overallRiskLevel = "High";
    else if (overallRiskPercent >= 30) overallRiskLevel = "Moderate";

    const priorityFocus = categories.filter((cat) => avgCategoryRisk[cat] > 50);

    return {
      overall_risk_percent: overallRiskPercent,
      overall_risk_level: overallRiskLevel,
      trend: "Stable",
      priority_focus: priorityFocus,
      recommended_actions: [
        "Focus on categories with higher risk.",
        "Monitor trends and implement mitigation plans.",
        "Review internal controls and risk policies.",
      ],
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#specializedRoles.getInRangeAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(risks, startDate, endDate);
    return processedAnalytics;
  }
}

export default RiskExposureController;
