import dotenv from "dotenv";
dotenv.config();

export default class WaitTimeService {
  static async getWaitTimeAnalytics(filters = {}) {
    try {
      const url = new URL(process.env.VGAD_WAIT_TIME_API_URL);

      // Attach query params if provided
      if (filters.department) {
        url.searchParams.append("department", filters.department);
      }

      if (filters.visitorType) {
        url.searchParams.append("visitorType", filters.visitorType);
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
    } catch (err) {
      console.error("Wait Time Service Error:", err);
      throw err;
    }
  }
}