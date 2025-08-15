import { generateVisitorAnalyticsData } from "./visitorPatternData.js";

export const getVisitorAnalytics = (req, res) => {
  const { department, visitorType } = req.query;
  const data = generateVisitorAnalyticsData(300);

  // Optional filter by visitor type and department
  let filtered = data;
  if (visitorType) {
    filtered = filtered.filter(v => v.Visit_Type === visitorType);
  }
  if (department) {
    filtered = filtered.filter(v => v.Department_Visited === department);
  }

  // --- Identify peak visiting hours ---
  const visitsByHour = {};
  filtered.forEach(v => {
    const hour = parseInt(v.Arrival_Time.split(":")[0], 10); // get hour from "HH:MM:SS"
    visitsByHour[hour] = (visitsByHour[hour] || 0) + 1;
  });

  // Sort hours in ascending order for chart plotting
  const hourlyStats = Object.keys(visitsByHour)
    .map(hour => ({
      hour: parseInt(hour, 10),
      visits: visitsByHour[hour]
    }))
    .sort((a, b) => a.hour - b.hour);

  // --- Identify peak days of the week ---
  const visitsByDay = {};
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  filtered.forEach(v => {
    const dateObj = new Date(v.Visit_Date);
    const dayName = daysOfWeek[dateObj.getDay()];
    visitsByDay[dayName] = (visitsByDay[dayName] || 0) + 1;
  });

  // Prepare peakDays array sorted by day order (Sunday to Saturday)
  const peakDays = daysOfWeek.map(day => ({
    day,
    visits: visitsByDay[day] || 0
  }));

  // --- Categorize and count visits by department and Visit Type ---
  const departmentVisitTypeCounts = {};
  filtered.forEach(v => {
    const dept = v.Department_Visited;
    const type = v.Visit_Type;
    if (!departmentVisitTypeCounts[dept]) {
      departmentVisitTypeCounts[dept] = {};
    }
    departmentVisitTypeCounts[dept][type] = (departmentVisitTypeCounts[dept][type] || 0) + 1;
  });

  // Convert to array for easier charting
  const departmentVisitTypeStats = Object.entries(departmentVisitTypeCounts).map(([dept, types]) => ({
    department: dept,
    visitTypes: Object.entries(types).map(([type, count]) => ({
      type,
      count
    }))
  }));

  res.json({
    totalVisitors: filtered.length,
    peakHours: hourlyStats,
    peakDays,
    departmentVisitTypeStats,
    raw: filtered
  });
};