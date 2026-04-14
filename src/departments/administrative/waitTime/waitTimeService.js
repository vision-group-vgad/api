import AdminUtils from "../../../utils/common/AdminUtils.js";
import { waitTimeDummy } from "./wait-time-dummy.js";

const adminUtils = new AdminUtils();

export default class WaitTimeService {
  static async getWaitTimeAnalytics(filters = {}) {
    try {
      const data = await adminUtils.getWaitTime(filters.department, filters.visitorType);
      if (!data || Object.keys(data).length === 0) return waitTimeDummy;
      return data;
    } catch (error) {
      console.warn("[WaitTime] Live fetch failed, using dummy:", error.message);
      return waitTimeDummy;
    }
  }
}