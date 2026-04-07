import dotenv from "dotenv";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import buildVGADUrl from "../../../config/url_builder.js";

dotenv.config();
dayjs.extend(isBetween);

const filterTasksByDate = (tasks, startDate, endDate) => {
  if (!startDate || !endDate) return tasks;

  return tasks.filter((task) =>
    dayjs(task.request_date).isBetween(
      dayjs(startDate),
      dayjs(endDate),
      null,
      "[]"
    )
  );
};

export default class ProcessThroughputService {
  static async getInRangeTasks(startDate, endDate) {
    try {
      const url = buildVGADUrl("administrator/process-throughput", {
        startDate,
        endDate,
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

      const { data: tasks = [] } = await response.json();

      return filterTasksByDate(tasks, startDate, endDate);
    } catch (error) {
      console.error("Process Throughput Service Error:", error);
      throw error;
    }
  }
}