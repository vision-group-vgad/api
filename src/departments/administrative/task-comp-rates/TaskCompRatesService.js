import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import { data as tasksDummy } from "./tasks-dummy.js";
import AdminUtils from "../../../utils/common/AdminUtils.js";

dayjs.extend(isBetween);

const adminUtils = new AdminUtils();

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
    let tasks = [];
    let dateRange, analytics;
    try {
      const json = await adminUtils.getTaskCompletion(startDate, endDate);
      tasks = json.tasks || [];
      dateRange = json.dateRange;
      analytics = json.analytics;
    } catch (error) {
      console.warn("[TaskCompRates] Live fetch failed, using dummy:", error.message);
      tasks = tasksDummy;
    }

    const filteredTasks = filterTasksByDate(tasks, startDate, endDate);

    return {
      dateRange,
      analytics,
      tasks: filteredTasks,
    };
  }
}