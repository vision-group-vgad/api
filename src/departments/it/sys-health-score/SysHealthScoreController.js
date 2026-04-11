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
    try {
      const liveData = await this.#it.fetchLiveData('/it/system-health');
      if (Array.isArray(liveData) && liveData.length > 0) {
        const filtered = liveData.filter(obj => !startDate || !endDate || (obj.date >= startDate && obj.date <= endDate));
        return { dailyData: filtered.length > 0 ? filtered : liveData, summary: {} };
      }
    } catch (err) {
      console.warn('[SysHealthScore] Live fetch failed, using dummy:', err.message);
    }
    const filteredAnalytics = dummy_data.dailyData.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const summary = dummy_data.summary;
    return { dailyData: filteredAnalytics, summary };
  }
}

export default SysHealthCont;
