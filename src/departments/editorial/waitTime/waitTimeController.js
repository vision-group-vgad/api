import { de } from "date-fns/locale";
import { generateVisitorAnalyticsData } from "../visitor-patterns/visitorPatternData.js";

export const getWaitTimeAnalytics = (req, res) => {
  const { department, visitorType } = req.query;
  const data = generateVisitorAnalyticsData(300);

  // Apply optional filters
  let filtered = data;
  if (visitorType) {
    filtered = filtered.filter(v => v.Visit_Type === visitorType);
  }
  if (department) {
    filtered = filtered.filter(v => v.Department_Visited === department);
  }

  // --- Calculate wait time per visitor ---
  filtered = filtered.map(v => {
    const arrivalDate = new Date(`${v.Visit_Date}T${v.Arrival_Time}Z`);
    const checkInDate = new Date(`${v.Visit_Date}T${v.Check_In_Time}Z`);
    const waitTime = Math.max(0, Math.round((checkInDate - arrivalDate) / 60000)); // in minutes
    return { ...v, Wait_Time: waitTime };
  });

  // --- Histogram bins ---
  const bins = [
    { label: "0-5", min: 0, max: 5 },
    { label: "6-10", min: 6, max: 10 },
    { label: "11-15", min: 11, max: 15 },
    { label: "16-20", min: 16, max: 20 },
    { label: "21-30", min: 21, max: 30 },
    { label: "31+", min: 31, max: Infinity }
  ];
  const waitTimeHistogram = bins.map(bin => ({
    bin: bin.label,
    count: filtered.filter(v => v.Wait_Time >= bin.min && v.Wait_Time <= bin.max).length
  }));

  // --- Average wait time (day, hour, month) ---
  const waitTimeByDay = {};
  const waitTimeByHour = {};
  const waitTimeByMonth = {};

  filtered.forEach(v => {
    // By day
    if (!waitTimeByDay[v.Visit_Date]) waitTimeByDay[v.Visit_Date] = [];
    waitTimeByDay[v.Visit_Date].push(v.Wait_Time);

    // By hour
    const hour = v.Arrival_Time.split(":")[0];
    if (!waitTimeByHour[hour]) waitTimeByHour[hour] = [];
    waitTimeByHour[hour].push(v.Wait_Time);

    // By month
    const month = v.Visit_Date.slice(0, 7); // YYYY-MM
    if (!waitTimeByMonth[month]) waitTimeByMonth[month] = [];
    waitTimeByMonth[month].push(v.Wait_Time);
  });

  const avgWaitTimePerDay = Object.entries(waitTimeByDay).map(([date, waits]) => ({
    date,
    averageWaitTime: (waits.reduce((a, b) => a + b, 0) / waits.length).toFixed(2)
  }));

  const avgWaitTimePerHour = Object.entries(waitTimeByHour).map(([hour, waits]) => ({
    hour: `${hour}:00`,
    averageWaitTime: (waits.reduce((a, b) => a + b, 0) / waits.length).toFixed(2)
  }));

  const avgWaitTimePerMonth = Object.entries(waitTimeByMonth).map(([month, waits]) => ({
    month,
    averageWaitTime: (waits.reduce((a, b) => a + b, 0) / waits.length).toFixed(2)
  }));

  // --- Excessive wait %
  const excessiveWaitThreshold = 10;
  const excessiveWaitCount = filtered.filter(v => v.Wait_Time > excessiveWaitThreshold).length;
  const excessiveWaitPercentage = filtered.length > 0
    ? ((excessiveWaitCount / filtered.length) * 100).toFixed(2)
    : "0.00";

  // --- Department + Visitor Type breakdown ---
  const departmentVisitTypeCounts = {};
  filtered.forEach(v => {
    const dept = v.Department_Visited;
    const type = v.Visit_Type;
    if (!departmentVisitTypeCounts[dept]) {
      departmentVisitTypeCounts[dept] = {};
    }
    departmentVisitTypeCounts[dept][type] = (departmentVisitTypeCounts[dept][type] || 0) + 1;
  });
  const departmentVisitTypeStats = Object.entries(departmentVisitTypeCounts).map(([dept, types]) => ({
    department: dept,
    visitTypes: Object.entries(types).map(([type, count]) => ({
      type,
      count
    }))
  }));  

  res.json({
    totalVisitors: filtered.length,
    departmentVisitTypeStats,
    waitTimeHistogram,
    avgWaitTimePerDay,
    avgWaitTimePerHour,
    avgWaitTimePerMonth,
    excessiveWaitThreshold,
    excessiveWaitCount,
    excessiveWaitPercentage,
    visitors: filtered
  });
};
