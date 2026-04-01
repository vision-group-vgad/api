import dotenv from "dotenv";
dotenv.config();

export default class RVSAnalyticsService {
  static async getOverview(department) {
    try {
      const url = new URL(process.env.VGAD_RVS_API_URL);

      // Optional filter
      if (department && department !== "All") {
        url.searchParams.append("department", department);
      }

      const response = await fetch(url.toString(), {
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