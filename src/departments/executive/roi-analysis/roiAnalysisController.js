// roiController.js
import { generateRoiData } from "./roiAnalysisData.js";

export const getRoiAnalysis = (req, res) => {
  try {
    const data = generateRoiData(200);
    const { category, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by category
    if (category) {
      const categories = category.split(",");
      filteredData = filteredData.filter(d => d?.category && categories.includes(d.category));
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-01-01");
    const end = endDate ? new Date(endDate) : new Date("2025-12-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Summary metrics
    const totalInvestment = filteredData.reduce((a, d) => a + d.investment, 0);
    const totalRevenue = filteredData.reduce((a, d) => a + d.revenue, 0);
    const totalProfit = totalRevenue - totalInvestment;
    const roi = totalInvestment ? +((totalProfit / totalInvestment) * 100).toFixed(2) : 0;

    const summary = {
      totalRecords: filteredData.length,
      totalInvestment,
      totalRevenue,
      totalProfit,
      roi
    };

    // Monthly trends
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7);
      if (!monthlyMap[month]) {
        monthlyMap[month] = { investment: 0, revenue: 0, count: 0 };
      }
      monthlyMap[month].investment += d.investment;
      monthlyMap[month].revenue += d.revenue;
      monthlyMap[month].count += 1;
    });

    const roiTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => {
        const profit = vals.revenue - vals.investment;
        return {
          month,
          avgInvestment: Math.round(vals.investment / vals.count),
          avgRevenue: Math.round(vals.revenue / vals.count),
          avgProfit: Math.round(profit / vals.count),
          roi: vals.investment ? +((profit / vals.investment) * 100).toFixed(2) : 0
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json({ summary, roiTrends, data: filteredData });

  } catch (error) {
    console.error("Error fetching ROI analysis:", error);
    res.status(500).json({
      message: "Failed to fetch ROI analysis",
      error: error.message
    });
  }
};
