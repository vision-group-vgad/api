import SalesMarketing from "../../../utils/common/SalesMkting.js";
import customers from "./dummy-data.js";

class CLVController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.joinDate >= startDate && obj.joinDate <= endDate
    );
    const totalCLV = filteredData.reduce(
      (total, customer) => total + customer.clv,
      0
    );

    return {
      data: filteredData,
      summary: {
        total_clv: totalCLV,
        no_of_clients: filteredData.length,
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#salesMkt.getInRangeSalesAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(customers, startDate, endDate);
    return processedAnalytics;
  }
}

export default CLVController;
