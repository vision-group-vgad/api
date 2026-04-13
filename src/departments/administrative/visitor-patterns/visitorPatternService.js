import AdminUtils from "../../../utils/common/AdminUtils.js";
import { visitorPatternsDummy } from "./visitor-dummy.js";

const adminUtils = new AdminUtils();

export default class VisitorPatternService {
  static async getVisitorPatterns(filters = {}) {
    try {
      const data = await adminUtils.getVisitorPatterns(filters.department, filters.visitorType);
      if (!data || Object.keys(data).length === 0) return visitorPatternsDummy;
      return data;
    } catch (error) {
      console.warn("[VisitorPatterns] Live fetch failed, using dummy:", error.message);
      return visitorPatternsDummy;
    }
  }
}