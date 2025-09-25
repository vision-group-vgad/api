import { generateInsightAdoptionDataRaw } from "./insightAdoptionData.js";

export const getInsightAdoptionAnalysis = (req, res) => {
  try {
    const data = generateInsightAdoptionDataRaw(200);
    const { insightName, department, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by insight name(s)
    if (insightName) {
      const insights = insightName.split(",");
      filteredData = filteredData.filter(
        d => d?.insightName && insights.includes(d.insightName)
      );
    }

    // Filter by department(s)
    if (department) {
      const depts = department.split(",");
      filteredData = filteredData.filter(
        d => d?.department && depts.includes(d.department)
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

    // Add per-insight metrics
    const dataWithMetrics = filteredData.map(d => {
      const adoptionScore = d.views
        ? +((d.downloads / d.views) * 100).toFixed(2)
        : 0;

      return {
        ...d,
        adoptionScore
      };
    });

    // Summary metrics
    const totalInsights = filteredData.length;
    const totalViews = filteredData.reduce((a, d) => a + d.views, 0);
    const totalDownloads = filteredData.reduce((a, d) => a + d.downloads, 0);

    const summary = {
      totalInsights,
      totalViews,
      totalDownloads,
      overallAdoptionRate: totalViews
        ? +((totalDownloads / totalViews) * 100).toFixed(2)
        : 0,
      avgViewsPerInsight: totalInsights ? +(totalViews / totalInsights).toFixed(2) : 0,
      avgDownloadsPerInsight: totalInsights ? +(totalDownloads / totalInsights).toFixed(2) : 0
    };

    // Monthly adoption trends
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = { views: 0, downloads: 0, insights: 0 };
      }
      monthlyMap[month].views += d.views;
      monthlyMap[month].downloads += d.downloads;
      monthlyMap[month].insights += 1;
    });

    const adoptionTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => ({
        month,
        totalViews: vals.views,
        totalDownloads: vals.downloads,
        avgAdoptionRate: vals.views
          ? +((vals.downloads / vals.views) * 100).toFixed(2)
          : 0,
        totalInsights: vals.insights
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Department breakdown (aggregate across all filtered records)
    const departmentBreakdown = {};
    filteredData.forEach(d => {
      if (!departmentBreakdown[d.department]) {
        departmentBreakdown[d.department] = { views: 0, downloads: 0 };
      }
      departmentBreakdown[d.department].views += d.views;
      departmentBreakdown[d.department].downloads += d.downloads;
    });

    res.json({ summary, adoptionTrends, departmentBreakdown, data: dataWithMetrics });

  } catch (error) {
    console.error("Error fetching insight adoption analysis:", error);
    res.status(500).json({
      message: "Failed to fetch insight adoption analysis",
      error: error.message
    });
  }
};
