import IT from "../../../utils/common/IT.js";
import dummyData from "./dummy-data.js";

class InfraCostsController {
  #it;
  constructor() {
    this.#it = new IT();
  }

  async getInRangeData(startDate, endDate) {
    try {
      const liveData = await this.#it.fetchLiveData('/it/infrastructure-costs');
      if (Array.isArray(liveData) && liveData.length > 0) {
        // Map CMS field names to the schema the frontend expects
        const mapped = liveData.map(obj => ({
          category: obj.category,
          service: obj.service,
          cost: obj.costAmount,
          unit: obj.currency,
          date: obj.billingPeriodStart ? obj.billingPeriodStart.slice(0, 10) : null,
        }));
        const filtered = mapped.filter(obj => !startDate || !endDate || (obj.date && obj.date >= startDate && obj.date <= endDate));
        return filtered.length > 0 ? filtered : mapped;
      }
    } catch (err) {
      console.warn('[InfraCosts] Live fetch failed, using dummy:', err.message);
    }
    return dummyData.filter(obj => obj.date >= startDate && obj.date <= endDate);
  }
}

export default InfraCostsController;
