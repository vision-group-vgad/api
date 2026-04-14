import performances from "./dummy-data.js";

class MarketShareController {
  constructor() {
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );

    const gender = this.#getBestGender(data);
    const units = this.#getBusinessUnitPerformance(data);
    const regions = this.#getRegionPerformance(data);
    const mktShare = this.#getOverallOrganizationShare(data);
    const mktSize = this.#getOverallAveragePopulation(data);

    return {
      data: filteredData,
      summary: {
        market_size: mktSize,
        overall_market_share: mktShare,
        best_region: regions.bestRegion,
        worst_region: regions.worstRegion,
        best_unit: units.bestPerforming,
        worst_unit: units.worstPerforming,
        best_gender: gender,
      },
    };
  }

  #getOverallAveragePopulation(data) {
    if (!Array.isArray(data) || data.length === 0) return 0;

    const totalMarketSize = data.reduce((sum, week) => {
      const marketSize = Number(week.marketSize) || 0;
      return sum + marketSize;
    }, 0);

    return (totalMarketSize / data.length).toFixed(0);
  }

  #getBusinessUnitPerformance(data) {
    const unitAgg = {};

    data.forEach((week) => {
      week.businessUnits.forEach((unit) => {
        if (!unitAgg[unit.name]) unitAgg[unit.name] = 0;
        unitAgg[unit.name] += unit.marketSharePercent;
      });
    });

    const units = Object.entries(unitAgg).map(([name, total]) => ({
      name,
      avgShare: total / data.length,
    }));
    units.sort((a, b) => b.avgShare - a.avgShare);

    return {
      bestUnit: units[0],
      worstUnit: units[units.length - 1],
    };
  }

  #getOverallOrganizationShare(data) {
    const totalShare = data.reduce(
      (sum, week) => sum + week.organizationMarketShare,
      0
    );
    return (totalShare / data.length).toFixed(2);
  }

  #getBestGender(data) {
    const genderAgg = { male: 0, female: 0 };

    data.forEach((week) => {
      genderAgg.male += week.genderSegmentation.male;
      genderAgg.female += week.genderSegmentation.female;
    });

    const maleAvg = genderAgg.male / data.length;
    const femaleAvg = genderAgg.female / data.length;

    return maleAvg >= femaleAvg
      ? { bestGender: "male", avgShare: maleAvg.toFixed(2) }
      : { bestGender: "female", avgShare: femaleAvg.toFixed(2) };
  }

  #getRegionPerformance(data) {
    const regionAgg = {};

    data.forEach((week) => {
      week.regions.forEach((region) => {
        if (!regionAgg[region.name]) regionAgg[region.name] = 0;
        regionAgg[region.name] += region.marketSharePercent;
      });
    });

    const regions = Object.entries(regionAgg).map(([name, total]) => ({
      name,
      avgShare: total / data.length,
    }));
    regions.sort((a, b) => b.avgShare - a.avgShare);

    return {
      bestRegion: regions[0],
      worstRegion: regions[regions.length - 1],
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#ceoObj.getInRangeSalesAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(
      performances,
      startDate,
      endDate
    );
    return processedAnalytics;
  }
}

export default MarketShareController;
