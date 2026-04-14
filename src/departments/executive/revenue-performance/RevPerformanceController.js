import CEO from "../../../utils/common/CEO.js";
import performances from "./dummy-data.js";

class RevenuePerformanceController {
  #ceoObj;
  constructor() {
    this.#ceoObj = new CEO();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );

    const clients = this.#getClientPerformance(data);
    const units = this.#getBusinessUnitPerformance(data);
    const regions = this.#getRegionPerformance(data);
    const revenue = this.#getOverallRevenue(data);

    return {
      data: filteredData,
      summary: {
        overall_revenue: revenue,
        best_region: regions.bestRegion,
        worst_region: regions.worstRegion,
        best_unit: units.bestPerforming,
        worst_unit: units.worstPerforming,
        best_client: clients.bestClient,
        worst_client: clients.worstClient,
      },
    };
  }

  #getClientPerformance(data) {
    const clientAgg = {};

    data.forEach((day) => {
      day.clients.forEach((client) => {
        if (!clientAgg[client.client]) clientAgg[client.client] = 0;
        clientAgg[client.client] += client.revenue;
      });
    });

    const clients = Object.entries(clientAgg).map(([client, revenue]) => ({
      client,
      revenue,
    }));
    clients.sort((a, b) => b.revenue - a.revenue);

    return {
      bestClient: clients[0],
      worstClient: clients[clients.length - 1],
    };
  }

  #getRegionPerformance(data) {
    const regionAgg = {};

    data.forEach((day) => {
      day.regions.forEach((region) => {
        if (!regionAgg[region.region]) regionAgg[region.region] = 0;
        regionAgg[region.region] += region.revenue;
      });
    });

    const regions = Object.entries(regionAgg).map(([region, revenue]) => ({
      region,
      revenue,
    }));
    regions.sort((a, b) => b.revenue - a.revenue);

    return {
      bestRegion: regions[0],
      worstRegion: regions[regions.length - 1],
    };
  }

  #getBusinessUnitPerformance(data) {
    const aggregate = {};
    data.forEach((day) => {
      day.businessUnits.forEach((unit) => {
        if (!aggregate[unit.name]) aggregate[unit.name] = 0;
        aggregate[unit.name] += unit.revenue;
      });
    });

    const units = Object.entries(aggregate).map(([name, revenue]) => ({
      name,
      revenue,
    }));
    units.sort((a, b) => b.revenue - a.revenue); // descending

    return {
      bestPerforming: units[0],
      worstPerforming: units[units.length - 1],
    };
  }

  #getOverallRevenue(data) {
    const totalActual = data.reduce((sum, day) => sum + day.totalRevenue, 0);
    const totalProjected = data.reduce(
      (sum, day) => sum + day.projectedRevenue,
      0
    );

    return { totalActual, totalProjected };
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

export default RevenuePerformanceController;
