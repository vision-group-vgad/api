import IT from "../../../utils/common/IT.js";
import dummyData from "./dummy-data.js";

class InfraCostsController {
  #it;
  constructor() {
    this.#it = new IT();
  }

  #processAnalytics(data) {
    return data;
  }

  async getInRangeData(startDate, endDate) {
    // const data = await this.#it.getInRangeAnalytics(startDate, endDate)
    const filteredAnalytics = dummyData.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    return filteredAnalytics;
  }
}

export default InfraCostsController;
