import IT from "../../../utils/common/IT.js";
import dummy_data from "./system_health_jan_aug_2025.js";

class SysHealthCont {
  #it;
  constructor() {
    this.#it = new IT();
  }

  #processAnalytics(data) {
    return data;
  }

  async getInRangeData(startDate, endDate) {
    // const data = await this.#it.getInRangeAnalytics(startDate, endDate)
    const filteredAnalytics = dummy_data.dailyData.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const summary = dummy_data.summary;
    return {
      dailyData: filteredAnalytics,
      summary,
    };
  }
}

export default SysHealthCont;
