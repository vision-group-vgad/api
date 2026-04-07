import buildVGADUrl from "../../../config/url_builder.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";

dayjs.extend(isBetween);

export default class ScheduleEfficiencyService {
  static async getMeetings(startDate, endDate) {
    const url = buildVGADUrl("administrator/meetings", { startDate, endDate });

    const res = await fetch(url, {
      headers: {
        "x-api-key": process.env.VGAD_API_KEY,
        Accept: process.env.VGAD_ACCEPT,
      },
    });
    if (!res.ok) throw new Error(`Meetings API responded with ${res.status}`);
    const json = await res.json();
    let meetings = json.data || [];

    if (startDate && endDate) {
      meetings = meetings.filter(m =>
        dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
      );
    }
    return meetings;
  }

  static async getTasks(startDate, endDate) {
    const url = buildVGADUrl("administrator/task-completion", { startDate, endDate });

    const res = await fetch(url, {
      headers: {
        "x-api-key": process.env.VGAD_API_KEY,
        Accept: process.env.VGAD_ACCEPT,
      },
    });
    if (!res.ok) throw new Error(`Tasks API responded with ${res.status}`);
    const json = await res.json();
    let tasks = json.tasks || [];

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