import { generateNetworkEvents } from "./cpuUsageData.js";

const severityOrder = ["Low", "Medium", "High", "Critical"];
const errorTypes = ["Packet Loss", "High Latency", "Connection Drop", "Hardware Failure", "Other"];

export const getCpuUsageTrends = (req, res) => {
  try {
    const data = generateNetworkEvents(300);

    // --- Apply filters ---
    let filtered = data;
    const { errorType, severity } = req.query;

    if (errorType) {
      const errorTypesArray = errorType.split(",");
      filtered = filtered.filter(d => errorTypesArray.includes(d.errorType));
    }

    if (severity) {
      const severitiesArray = severity.split(",");
      filtered = filtered.filter(d => severitiesArray.includes(d.severity));
    }

    // --- Average CPU & Memory per month ---
    const cpuByMonth = {};
    const memoryByMonth = {};

    filtered.forEach(d => {
      const month = d.Date.slice(0, 7); // YYYY-MM
      if (!cpuByMonth[month]) cpuByMonth[month] = [];
      cpuByMonth[month].push(d.cpuUsage);

      if (!memoryByMonth[month]) memoryByMonth[month] = [];
      memoryByMonth[month].push(d.memoryUsage);
    });

    const avgCpuPerMonth = Object.entries(cpuByMonth).map(([month, values]) => ({
      month,
      avgCpu: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    }));

    const avgMemoryPerMonth = Object.entries(memoryByMonth).map(([month, values]) => ({
      month,
      avgMemory: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)
    }));

        // --- Severity distribution ---
    const severityCounts = {};

    filtered.forEach(d => {
      severityCounts[d.severity] = (severityCounts[d.severity] || 0) + 1;
    });

    const totalEvents = filtered.length;

    const severityDistribution = Object.entries(severityCounts).map(([sev, count]) => ({
      severity: sev,
      count,
      percentage: totalEvents > 0 ? ((count / totalEvents) * 100).toFixed(2) : "0.00"
    }));
    // --- Error Type Grouping (counts + downtime, grouped by month) ---
    const errorTypeStats = {};

    filtered.forEach(d => {
      const month = d.Date.slice(0, 7); // YYYY-MM
      if (!errorTypeStats[d.errorType]) errorTypeStats[d.errorType] = {};
      if (!errorTypeStats[d.errorType][month]) {
        errorTypeStats[d.errorType][month] = { count: 0, downtime: 0 };
      }
      errorTypeStats[d.errorType][month].count += 1;
      errorTypeStats[d.errorType][month].downtime += d.downtime;
    });

    const errorTypeDistribution = Object.entries(errorTypeStats).map(([errorType, months]) => ({
      errorType,
      byMonth: Object.entries(months).map(([month, stats]) => ({
        month,
        count: stats.count,
        downtime: stats.downtime.toFixed(2)
      }))
    }));

    // --- Response ---
    res.json({
      totalEvents,
      avgCpuPerMonth,
      avgMemoryPerMonth,
      severityDistribution,
      errorTypeDistribution,
      totalRecords: filtered
    });

  } catch (error) {
    console.error("Error fetching CPU usage trends:", error);
    res.status(500).json({ message: "Failed to fetch CPU usage trends", error: error.message });
  }
};
