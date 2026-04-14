import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import AdminUtils from "../../../utils/common/AdminUtils.js";
import { processThroughputDummy } from "./process-dummy.js";

dayjs.extend(isBetween);

const adminUtils = new AdminUtils();

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
    let tasks = [];
    try {
      const json = await adminUtils.getProcessThroughput(startDate, endDate);
      tasks = json.data || [];
      if (tasks.length === 0) tasks = processThroughputDummy;
    } catch (error) {
      console.warn("[ProcessThroughput] Live fetch failed, using dummy:", error.message);
      tasks = processThroughputDummy;
    }
    return filterTasksByDate(tasks, startDate, endDate);
  }
}