// costOptimizationController.js
import { generateCostOptimizationData } from "./costOptimizationData.js";
import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";

const execUtils = new ExecutiveUtils();

export const getCostOptimization = async (req, res) => {
  try {
    // Try live CMC data first
    try {
      const cmcData = await execUtils.getCostOptimization();
      return res.json({ summary: cmcData.summary || [], legalSpendTrend: [], data: [] });
    } catch (cmcErr) {
      console.error("❌ [CostOpt] CMC failed, using dummy:", cmcErr.message);
    }

    // Fallback to dummy
    const data = generateCostOptimizationData(200);
    const { department, startDate, endDate } = req.query;
    let filteredData = data;

    if (department) {
      const departments = department.split(",");
      filteredData = filteredData.filter(d => d?.department && departments.includes(d.department));
    }

    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");
    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    const summary = {};
    filteredData.forEach(d => {
      if (!summary[d.department]) summary[d.department] = { budget: 0, actualSpend: 0, legalSpend: 0 };
      summary[d.department].budget += d.budget || 0;
      summary[d.department].actualSpend += d.actualSpend || 0;
      summary[d.department].legalSpend += d.legalSpend || 0;
    });

    const summaryArray = Object.entries(summary).map(([department, vals]) => {
      const variancePercent = vals.budget ? ((vals.budget - vals.actualSpend) / vals.budget * 100).toFixed(2) : 0;
      return { department, ...vals, variancePercent: parseFloat(variancePercent) };
    });

    const legalSpendTrendMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7);
      if (!legalSpendTrendMap[month]) legalSpendTrendMap[month] = { legalSpend: 0, actualSpend: 0, budget: 0 };
      legalSpendTrendMap[month].legalSpend += d.legalSpend || 0;
      legalSpendTrendMap[month].actualSpend += d.actualSpend || 0;
      legalSpendTrendMap[month].budget += d.budget || 0;
    });

    const legalSpendTrend = Object.entries(legalSpendTrendMap)
      .map(([month, vals]) => {
        const variancePercent = vals.budget ? ((vals.budget - vals.actualSpend) / vals.budget * 100).toFixed(2) : 0;
        return { month, ...vals, variancePercent: parseFloat(variancePercent) };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json({ summary: summaryArray, legalSpendTrend, data: filteredData });
  } catch (error) {
    console.error("Error fetching cost optimization:", error);
    res.status(500).json({ message: "Failed to fetch cost optimization", error: error.message });
  }
};
