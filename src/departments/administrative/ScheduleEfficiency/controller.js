import { getMeetingsSummary, getTasksSummary } from "./service.js";

/**
 * GET /executive/summary
 * Returns executive meetings summary
 */
export const getExecutiveMeetingSummary = (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Accept optional date range
    const summary = getMeetingsSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching meetings summary:", error);
    res.status(500).json({ error: "Failed to fetch meetings summary" });
  }
};

/**
 * GET /executive/tasks
 * Returns executive tasks summary (progress bars + table)
 */
export const getExecutiveTasks = (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Accept optional date range
    const summary = getTasksSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching tasks summary:", error);
    res.status(500).json({ error: "Failed to fetch tasks summary" });
  }
};
