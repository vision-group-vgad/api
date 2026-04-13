import ScheduleEfficiencyService from "./service.js";

export const getScheduleEfficiencySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const meetings = await ScheduleEfficiencyService.getMeetings(startDate, endDate);

    const total = meetings.length;
    const held = meetings.filter(m => m.meetingStatus === "Held").length;
    const cancelled = meetings.filter(m => m.meetingStatus === "Cancelled").length;
    const upcoming = meetings.filter(m => m.meetingStatus === "Upcoming" || m.meetingStatus === "Scheduled").length;

    res.status(200).json({
      totalMeetingsHeld: held,
      targetMeetings: total,
      meetingsCompletionRate: total > 0 ? parseFloat(((held / total) * 100).toFixed(1)) : 0,
      cancellationRate: total > 0 ? parseFloat(((cancelled / total) * 100).toFixed(1)) : 0,
      upcomingMeetings: upcoming,
    });
  } catch (err) {
    console.error("Schedule Efficiency Summary Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export const getScheduleEfficiencyTaskProgress = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { progressTasks, allTasks } = await ScheduleEfficiencyService.getTasks(startDate, endDate);
    res.status(200).json({ progressTasks, allTasks });
  } catch (err) {
    console.error("Schedule Efficiency TaskProgress Error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

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