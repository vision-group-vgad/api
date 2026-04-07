import dotenv from "dotenv";
import buildVGADUrl from "../../../config/url_builder.js";

dotenv.config();

export default class VisitorPatternService {
  static async getVisitorPatterns(filters = {}) {
    try {
      const url = buildVGADUrl("administrator/visitor-patterns", {
        department:
          filters.department && filters.department !== "All"
            ? filters.department
            : undefined,
        visitorType: filters.visitorType || undefined,
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
      console.error("Visitor Pattern Service Error:", error);
      throw error;
    }
  }
}