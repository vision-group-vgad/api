import SalesMarketing from "../../../utils/common/SalesMkting.js";
import customers from "./dummy-data.js";

class CLVController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const rangeFiltered = data.filter(
      (obj) => obj.joinDate >= startDate && obj.joinDate <= endDate
    );
    const filteredData = rangeFiltered.length > 0 ? rangeFiltered : data;
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
    try {
      const liveData = await this.#salesMkt.getCustomerLifetimeValueData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn("Using fallback CLV data due to live fetch error:", error.message);
    }

    return this.#processData(customers, startDate, endDate);
  }
}

export default CLVController;
