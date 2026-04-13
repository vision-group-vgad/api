import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import AdminUtils from "../../../utils/common/AdminUtils.js";

dayjs.extend(isBetween);

const adminUtils = new AdminUtils();

export default class ScheduleEfficiencyService {
  static async getMeetings(startDate, endDate) {
    let meetings = [];
    try {
      const json = await adminUtils.getMeetings(startDate, endDate);
      meetings = json.data || [];
    } catch (error) {
      console.warn("[ScheduleEfficiency] Meetings live fetch failed:", error.message);
    }

    if (startDate && endDate) {
      meetings = meetings.filter(m =>
        dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
      );
    }
    return meetings;
  }

  static async getTasks(startDate, endDate) {
    let tasks = [];
    try {
      const json = await adminUtils.getTaskCompletion(startDate, endDate);
      tasks = json.tasks || [];
    } catch (error) {
      console.warn("[ScheduleEfficiency] Tasks live fetch failed:", error.message);
    }

    if (startDate && endDate) {
      tasks = tasks.filter(task =>
        dayjs(task.date_assigned).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
      );
    }

    const progressTasks = tasks.map(task => ({
      taskId: task.taskId,
      taskTitle: task.taskTitle,
      completionPercentage: task.completionPercentage,
      status: task.status,
      project: task.project,
      dueDate: task.dueDate,
    }));

    return { progressTasks, allTasks: tasks };
  }
}