import dotenv from "dotenv";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

dotenv.config();
dayjs.extend(isBetween);

export default class TaskCompRatesService {
  static async getInRangeAnalytics(startDate, endDate) {
    try {
      const url = new URL(process.env.VGAD_TASK_COMPLETION_API_URL);

      if (startDate) url.searchParams.append("startDate", startDate);
      if (endDate) url.searchParams.append("endDate", endDate);

      const response = await fetch(url.toString(), {
        headers: {
          "x-api-key": process.env.VGAD_API_KEY,
          Accept: process.env.VGAD_ACCEPT,
        },
      });

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const json = await response.json();

      let tasks = json.tasks;

      // Optional: local filtering (if API doesn’t fully enforce it)
      if (startDate && endDate) {
        tasks = tasks.filter(task =>
          dayjs(task.date_assigned).isBetween(
            dayjs(startDate),
            dayjs(endDate),
            null,
            "[]"
          )
        );
      }

      return {
        dateRange: json.dateRange,
        analytics: json.analytics,
        tasks,
      };

    } catch (error) {
      console.error("Task Completion Service Error:", error);
      throw error;
    }
  }
}