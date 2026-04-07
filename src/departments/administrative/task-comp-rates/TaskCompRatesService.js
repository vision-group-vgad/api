import dotenv from "dotenv";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import buildVGADUrl from "../../../config/url_builder.js";

dotenv.config();
dayjs.extend(isBetween);

const filterTasksByDate = (tasks, startDate, endDate) => {
  if (!startDate || !endDate) return tasks;

  return tasks.filter((task) =>
    dayjs(task.date_assigned).isBetween(
      dayjs(startDate),
      dayjs(endDate),
      null,
      "[]"
    )
  );
};

export default class TaskCompRatesService {
  static async getInRangeAnalytics(startDate, endDate) {
    try {
      const url = buildVGADUrl("administrator/task-completion", {
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

      const {
        tasks = [],
        dateRange,
        analytics,
      } = await response.json();

      const filteredTasks = filterTasksByDate(
        tasks,
        startDate,
        endDate
      );

      return {
        dateRange,
        analytics,
        tasks: filteredTasks,
      };
    } catch (error) {
      console.error("Task Completion Service Error:", error);
      throw error;
    }
  }
}