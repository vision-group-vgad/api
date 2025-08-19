import IT from "../../../utils/common/IT.js";
import dummy_data from "./cybersecurity_posture_jan_aug_2025.js";

class CyberSecPostController {
  #it;
  constructor() {
    this.#it = new IT();
  }

  #processAnalytics(data) {
    return data;
  }

  async getInRangeData(startDate, endDate) {
    // const data = await this.#it.getInRangeAnalytics(startDate, endDate)
    const filteredAnalytics = dummy_data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    return filteredAnalytics;
  }
}

export default CyberSecPostController;
