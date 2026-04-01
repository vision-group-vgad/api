import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";

export default class ProcessThroughputService {
  static async getInRangeTasks(startDate, endDate) {
    try {
      const url = new URL(process.env.VGAD_THROUGH_PUT_API_URL);
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
      const tasks = json.data;

      // Optional: filter again locally if API doesn't handle it
      let filteredTasks = tasks;
      if (startDate && endDate) {
        filteredTasks = tasks.filter(task =>
          dayjs(task.request_date).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
        );
      }

      return filteredTasks;
    } catch (err) {
      console.error("Process Throughput Service Error:", err);
      throw err;
    }
  }
}