import ScheduleEfficiencyService from "./service.js";

export const getScheduleEfficiency = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [meetings, tasksData] = await Promise.all([
      ScheduleEfficiencyService.getMeetings(startDate, endDate),
      ScheduleEfficiencyService.getTasks(startDate, endDate),
    ]);

    res.status(200).json({
      meetings,
      progressTasks: tasksData.progressTasks,
      allTasks: tasksData.allTasks,
    });
  } catch (err) {
    console.error("Schedule Efficiency Controller Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};