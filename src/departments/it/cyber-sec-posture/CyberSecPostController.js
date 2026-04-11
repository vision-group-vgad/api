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
    try {
      const liveData = await this.#it.fetchLiveData('/it/cybersecurity');
      if (Array.isArray(liveData) && liveData.length > 0) {
        const filtered = liveData.filter(obj => !startDate || !endDate || (obj.date >= startDate && obj.date <= endDate));
        return filtered.length > 0 ? filtered : liveData;
      }
    } catch (err) {
      console.warn('[CyberSecPost] Live fetch failed, using dummy:', err.message);
    }
    return dummy_data.filter(obj => obj.date >= startDate && obj.date <= endDate);
  }
}

export default CyberSecPostController;
