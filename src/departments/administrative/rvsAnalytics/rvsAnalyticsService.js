import dotenv from "dotenv";
import buildVGADUrl from "../../../config/url_builder.js";

dotenv.config();

export default class RVSAnalyticsService {
  static async getOverview(department) {
    try {
      const url = buildVGADUrl("administrator/rvs-analytics", {
        department: department && department !== "All" ? department : undefined,
      });

      const response = await fetch(url, {
        headers: {
          "x-api-key": process.env.VGAD_API_KEY,
          Accept: process.env.VGAD_ACCEPT,
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("RVS Service Error:", error);
      throw error;
    }
  }
}