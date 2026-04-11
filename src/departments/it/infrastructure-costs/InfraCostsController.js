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
    try {
      const liveData = await this.#it.fetchLiveData('/it/infrastructure-costs');
      if (Array.isArray(liveData) && liveData.length > 0) {
        const filtered = liveData.filter(obj => !startDate || !endDate || (obj.date >= startDate && obj.date <= endDate));
        return filtered.length > 0 ? filtered : liveData;
      }
    } catch (err) {
      console.warn('[InfraCosts] Live fetch failed, using dummy:', err.message);
    }
    return dummyData.filter(obj => obj.date >= startDate && obj.date <= endDate);
  }
}

export default InfraCostsController;
