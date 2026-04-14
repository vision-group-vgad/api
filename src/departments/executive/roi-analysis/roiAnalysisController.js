// roiController.js
import { generateRoiData } from "./roiAnalysisData.js";

export const getRoiAnalysis = (req, res) => {
  try {
    const data = generateRoiData(200);
    const { vendor, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by vendor
    if (vendor) {
      const vendors = vendor.split(",");
      filteredData = filteredData.filter(d => d?.vendor && vendors.includes(d.vendor));
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
    const totalProcessingCost = filteredData.reduce((a, d) => a + d.processingCost, 0);
    const totalProcessingTime = filteredData.reduce((a, d) => a + d.processingTime, 0);
    const totalException = filteredData.reduce((a, d) => a + d.exceptionRate, 0);
    const totalSavings = filteredData.reduce((a, d) => a + d.savings, 0);
    const totalCost = filteredData.reduce((a, d) => a + d.automationCost, 0);

    const summary = {
      totalRecords: filteredData.length,
      avgProcessingCost: +(totalProcessingCost / (filteredData.length || 1)).toFixed(2),
      avgProcessingTime: Math.round(totalProcessingTime / (filteredData.length || 1)),
      avgExceptionRate: +(totalException / (filteredData.length || 1)).toFixed(2),
      totalSavings,
      totalCost,
      roi: totalCost ? +(((totalSavings - totalCost) / totalCost) * 100).toFixed(2) : 0
    };

    // Monthly trends
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { processingCost: 0, processingTime: 0, exceptionRate: 0, roi: 0, totalSavings: 0, totalCost: 0, count: 0 };
      monthlyMap[month].processingCost += d.processingCost;
      monthlyMap[month].processingTime += d.processingTime;
      monthlyMap[month].exceptionRate += d.exceptionRate;
      monthlyMap[month].totalSavings += d.savings;
      monthlyMap[month].totalCost += d.automationCost;
      monthlyMap[month].count += 1;
    });

    const roiTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => {
        return {
          month,
          avgProcessingCost: +(vals.processingCost / vals.count).toFixed(2),
          avgProcessingTime: Math.round(vals.processingTime / vals.count),
          avgExceptionRate: +(vals.exceptionRate / vals.count).toFixed(2),
          roi: vals.totalCost ? +(((vals.totalSavings - vals.totalCost) / vals.totalCost) * 100).toFixed(2) : 0
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
