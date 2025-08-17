import { generateVisitorAnalyticsData } from "../visitor-patterns/visitorPatternData.js";

export const getVisitorWaitTimes = (req, res) => {
  const { department, visitorType, waitTimeInterval } = req.query;
  const data = generateVisitorAnalyticsData(300);

  // Optional filter by visitor type and department
  let filtered = data;
  if (visitorType) {
    filtered = filtered.filter(v => v.Visit_Type === visitorType);
  }
  if (department) {
    filtered = filtered.filter(v => v.Department_Visited === department);
  }

  // --- Calculate wait times for each visitor ---
  filtered.forEach(v => {
    // Wait_Time in minutes between Arrival_Time and Check_In_Time
    const arrivalDate = new Date(`${v.Visit_Date}T${v.Arrival_Time}Z`);
    const checkInDate = new Date(`${v.Visit_Date}T${v.Check_In_Time}Z`);
    v.Wait_Time = Math.max(0, Math.round((checkInDate - arrivalDate) / 60000)); // in minutes
  });

  // --- Group/Filter by wait time intervals if provided ---
  let waitTimeFiltered = filtered;
  if (waitTimeInterval) {
    // Example: waitTimeInterval="0-5" or "6-15"
    const [min, max] = waitTimeInterval.split("-").map(Number);
    waitTimeFiltered = filtered.filter(v => v.Wait_Time >= min && v.Wait_Time <= max);
  }

  // --- Calculate average wait time per Visit Type ---
  const waitTimeStats = {};
  filtered.forEach(v => {
    const type = v.Visit_Type;
    if (!waitTimeStats[type]) {
      waitTimeStats[type] = { totalWait: 0, count: 0 };
    }
    waitTimeStats[type].totalWait += v.Wait_Time;
    waitTimeStats[type].count += 1;
  });
  const averageWaitTimes = Object.entries(waitTimeStats).map(([type, stats]) => ({
    visitType: type,
    averageWaitTime: stats.count ? (stats.totalWait / stats.count).toFixed(2) : "0"
  }));

  res.json({
    totalVisitors: filtered.length,
    averageWaitTimes,
    waitTimeFiltered,
    raw: filtered
  });
};