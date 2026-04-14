import SalesMarketing from "../../../utils/common/SalesMkting.js";
import territories from "./dummy-data.js";

class TerritoryPerformController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const rangeFiltered = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const filteredData = rangeFiltered.length > 0 ? rangeFiltered : data;
    const totalRevenue = filteredData.reduce(
      (total, territory) => total + territory.total_revenue,
      0
    );

    const regionSet = new Set();
    filteredData.forEach((territory) => {
      regionSet.add(territory.region);
    });

    return {
      data: filteredData,
      summary: {
        best_region: this.#getBestPerformingRegion(filteredData),
        regions: Array.from(regionSet),
        avg_revenue_per_region: Math.round(totalRevenue / regionSet.size),
      },
    };
  }

  #getBestPerformingRegion(data, metric = "total_revenue") {
    if (!data || data.length === 0) return null;

    const regionMap = data.reduce((acc, record) => {
      if (!acc[record.region]) {
        acc[record.region] = { ...record };
      } else {
        acc[record.region].total_revenue += record.total_revenue;
        acc[record.region].gross_profit += record.gross_profit;
        acc[record.region].net_profit += record.net_profit;
        acc[record.region].total_sales += record.total_sales;
        acc[record.region].prospected_clients += record.prospected_clients;
        acc[record.region].sales += record.sales;
        acc[record.region].profit_margin_percent =
          (acc[record.region].profit_margin_percent +
            record.profit_margin_percent) /
          2;
        acc[record.region].sales_conversion_rate_percent =
          (acc[record.region].sales_conversion_rate_percent +
            record.sales_conversion_rate_percent) /
          2;
        acc[record.region].average_sale_value =
          (acc[record.region].average_sale_value + record.average_sale_value) /
          2;
        acc[record.region].customer_acquisition_cost =
          (acc[record.region].customer_acquisition_cost +
            record.customer_acquisition_cost) /
          2;
        acc[record.region].return_on_marketing_investment =
          (acc[record.region].return_on_marketing_investment +
            record.return_on_marketing_investment) /
          2;
      }
      return acc;
    }, {});

    const sortedRegions = Object.values(regionMap).sort(
      (a, b) => b[metric] - a[metric]
    );

    return sortedRegions[0];
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const liveData = await this.#salesMkt.getTerritoryPerformanceData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn(
        "Using fallback territory performance data due to live fetch error:",
        error.message
      );
    }

    return this.#processData(territories, startDate, endDate);
  }
}

export default TerritoryPerformController;
