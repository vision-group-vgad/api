import { generateFeedbackDataRaw } from "./feedbackData.js";

export const getFeedbackAnalysis = (req, res) => {
  try {
    const data = generateFeedbackDataRaw(300);
    const { eventName, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by event name(s)
    if (eventName) {
      const events = eventName.split(",");
      filteredData = filteredData.filter(
        d => d?.eventName && events.includes(d.eventName)
      );
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Summary metrics
    const totalParticipants = filteredData.length;
    const totalAttended = filteredData.filter(d => d.attended).length;
    const totalFeedback = filteredData.filter(d => d.gaveFeedback).length;

    const avgCSAT =
      totalFeedback > 0
        ? (
            filteredData
              .filter(d => d.gaveFeedback && d.rating !== null)
              .reduce((a, d) => a + d.rating, 0) / totalFeedback
          ).toFixed(2)
        : 0;

    const promoters = filteredData.filter(d => d.rating >= 4).length;
    const detractors = filteredData.filter(d => d.rating <= 2).length;
    const nps =
      totalFeedback > 0
        ? (((promoters - detractors) / totalFeedback) * 100).toFixed(2)
        : 0;

    const summary = {
      totalParticipants,
      totalAttended,
      totalFeedback,
      avgCSAT: +avgCSAT,
      nps: +nps
    };

    // Ratings distribution with counts + percentages
    const ratingCounts = [1, 2, 3, 4, 5].map(r => {
      const count = filteredData.filter(
        d => d.gaveFeedback && d.rating === r
      ).length;
      const percentage = totalFeedback
        ? +((count / totalFeedback) * 100).toFixed(2)
        : 0;

      return {
        rating: r,
        count,
        percentage
      };
    });

    // Session-level feedback
    const sessionMap = {};
    filteredData.forEach(d => {
      if (d.gaveFeedback && d.rating !== null) {
        if (!sessionMap[d.sessionTitle]) {
          sessionMap[d.sessionTitle] = { totalScore: 0, count: 0 };
        }
        sessionMap[d.sessionTitle].totalScore += d.rating;
        sessionMap[d.sessionTitle].count += 1;
      }
    });

    const sessions = Object.entries(sessionMap).map(([sessionTitle, vals]) => ({
      sessionTitle,
      avgScore: +(vals.totalScore / vals.count).toFixed(2),
      participants: vals.count
    }));

    res.json({
      dataLength: filteredData.length,
      summary,
      ratings: ratingCounts,
      sessions,
      data: filteredData
    });
  } catch (error) {
    console.error("Error fetching feedback analysis:", error);
    res.status(500).json({
      message: "Failed to fetch feedback analysis",
      error: error.message
    });
  }
};
