import { generateVisitorAnalyticsData } from "./visitorPatternData.js";

export const getVisitorPatterns = (req, res) => {
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

  // --- Peak visiting hours ---
  const visitsByHour = {};
  filtered.forEach(v => {
    const hour = parseInt(v.Arrival_Time.split(":")[0], 10);
    visitsByHour[hour] = (visitsByHour[hour] || 0) + 1;
  });
  const peakHours = Object.keys(visitsByHour)
    .map(hour => ({
      hour: parseInt(hour, 10),
      visits: visitsByHour[hour]
    }))
    .sort((a, b) => a.hour - b.hour);

  // --- Peak visiting days ---
  const visitsByDay = {};
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  filtered.forEach(v => {
    const dateObj = new Date(v.Visit_Date);
    const dayName = daysOfWeek[dateObj.getDay()];
    visitsByDay[dayName] = (visitsByDay[dayName] || 0) + 1;
  });
  const peakDays = daysOfWeek.map(day => ({
    day,
    visits: visitsByDay[day] || 0
  }));

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
    peakHours,
    peakDays,
    departmentVisitTypeStats,
    visitors: filtered
  });
};
