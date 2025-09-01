import { generateAttendanceDataRaw } from "./attendanceRateData.js";

export const getAttendanceAnalysis = (req, res) => {
  try {
    const data = generateAttendanceDataRaw(200);
    const { eventName, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by event name(s)
    if (eventName) {
      const events = eventName.split(",");
      filteredData = filteredData.filter(d => d?.eventName && events.includes(d.eventName));
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Add per-event metrics
    const dataWithMetrics = filteredData.map(d => {
      const noShow = d.totalRegistrations - d.totalAttendees;
      const attendanceRate = d.totalRegistrations
        ? +((d.totalAttendees / d.totalRegistrations) * 100).toFixed(2)
        : 0;
      const seatUtilization = d.totalSeats
        ? +((d.totalAttendees / d.totalSeats) * 100).toFixed(2)
        : 0;

      return {
        ...d,
        noShow,
        attendanceRate,
        seatUtilization
      };
    });

    // Summary metrics
    const totalRegistrations = filteredData.reduce((a, d) => a + d.totalRegistrations, 0);
    const totalAttendees = filteredData.reduce((a, d) => a + d.totalAttendees, 0);
    const totalSeats = filteredData.reduce((a, d) => a + d.totalSeats, 0);

    const summary = {
      totalEvents: filteredData.length,
      totalRegistrations,
      totalAttendees,
      noShow: totalRegistrations - totalAttendees,
      attendanceRate: totalRegistrations
        ? +((totalAttendees / totalRegistrations) * 100).toFixed(2)
        : 0,
      seatUtilization: totalSeats
        ? +((totalAttendees / totalSeats) * 100).toFixed(2)
        : 0
    };

    // Monthly metrics (totals and averages)
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          totalEvents: 0,
          totalRegistrations: 0,
          totalAttendees: 0,
          totalSeats: 0
        };
      }
      monthlyMap[month].totalEvents += 1;
      monthlyMap[month].totalRegistrations += d.totalRegistrations;
      monthlyMap[month].totalAttendees += d.totalAttendees;
      monthlyMap[month].totalSeats += d.totalSeats;
    });

    const attendanceTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => {
        const noShow = vals.totalRegistrations - vals.totalAttendees;
        const attendanceRate = vals.totalRegistrations
          ? +((vals.totalAttendees / vals.totalRegistrations) * 100).toFixed(2)
          : 0;
        const seatUtilization = vals.totalSeats
          ? +((vals.totalAttendees / vals.totalSeats) * 100).toFixed(2)
          : 0;

        return {
          month,
          totalEvents: vals.totalEvents,
          totalRegistrations: vals.totalRegistrations,
          totalAttendees: vals.totalAttendees,
          noShow,
          attendanceRate,
          seatUtilization
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json({ summary, attendanceTrends, data: dataWithMetrics });

  } catch (error) {
    console.error("Error fetching attendance analysis:", error);
    res.status(500).json({
      message: "Failed to fetch attendance analysis",
      error: error.message
    });
  }
};
