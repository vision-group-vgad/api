import SalesMarketing from "../../../utils/common/SalesMkting.js";
import revenueData from "./dummy-data.js";

class RevenueAttributionController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const totalRevenue = filteredData.reduce((total, week) => {
      const weekTotal = week.revenue.reduce(
        (sum, segment) => sum + segment.amount,
        0
      );
      return total + weekTotal;
    }, 0);

    return {
      data: filteredData,
      summary: {
        total_revenue: totalRevenue,
        revenue_sources: filteredData[0].revenue.length,
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const liveData = await this.#salesMkt.getRevenueAttributionData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn(
        "Using fallback revenue attribution data due to live fetch error:",
        error.message
      );
    }

    return this.#processData(revenueData, startDate, endDate);
  }
}

export default RevenueAttributionController;
