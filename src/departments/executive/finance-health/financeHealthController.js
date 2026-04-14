// financialHealthController.js
import { generateFinancialHealthRaw } from "./financeHealthData.js";
import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";

const execUtils = new ExecutiveUtils();

export const getFinancialHealth = async (req, res) => {
  try {
    // Try live CMC data first
    try {
      const cmcData = await execUtils.getFinanceHealth();
      return res.json({ summary: cmcData.summary || {}, data: [] });
    } catch (cmcErr) {
      console.error("CMC failed, using dummy:", cmcErr.message);
    }

    // Fallback to dummy
    const data = generateFinancialHealthRaw(200);
    const { department, startDate, endDate } = req.query;
    let filteredData = data;

    if (department) {
      const departments = department.split(",");
      filteredData = filteredData.filter(
        (d) => d?.department && departments.includes(d.department)
      );
    }

    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter((d) => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    const monthlyMap = {};
    filteredData.forEach((d) => {
      if (!d?.date) return;
      const monthKey = d.date.slice(0, 7);
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { revenue: 0, cogs: 0, expenses: 0 };
      }
      monthlyMap[monthKey].revenue += d.revenue || 0;
      monthlyMap[monthKey].cogs += d.cogs || 0;
      monthlyMap[monthKey].expenses += d.expenses || 0;
    });

    const netProfitTrend = [];
    const grossProfitTrend = [];
    let totalNetProfit = 0;
    let totalGrossProfit = 0;

    Object.entries(monthlyMap).forEach(([month, values]) => {
      const { revenue = 0, cogs = 0, expenses = 0 } = values;
      if (revenue === 0 && cogs === 0 && expenses === 0) return;
      const netProfit = revenue - cogs - expenses;
      const grossProfit = revenue - cogs;
      netProfitTrend.push({ month, value: netProfit });
      grossProfitTrend.push({ month, value: grossProfit });
      totalNetProfit += netProfit;
      totalGrossProfit += grossProfit;
    });

    const avgCashReserves =
      filteredData.reduce((a, d) => a + (d.cashReserves || 0), 0) / (filteredData.length || 1);
    const avgMonthlyBurn =
      filteredData.reduce((a, d) => a + (d.monthlyBurn || 0), 0) / (filteredData.length || 1);
    const cashFlowRunwayMonths = avgMonthlyBurn ? (avgCashReserves / avgMonthlyBurn).toFixed(1) : "0";

    const totalInvesting = filteredData.reduce((a, d) => a + (d.cashFlowInvesting || 0), 0);
    const totalFinancing = filteredData.reduce((a, d) => a + (d.cashFlowFinancing || 0), 0);

    const summary = {
      totalRecords: filteredData.length,
      netProfit: totalNetProfit,
      grossProfit: totalGrossProfit,
      cashFlowRunwayMonths,
      cashFlowByActivity: { operating: totalNetProfit, investing: totalInvesting, financing: totalFinancing },
      netProfitTrend,
      grossProfitTrend,
    };

    res.json({ summary, data: filteredData });
  } catch (error) {
    console.error("Error fetching financial health:", error);
    res.status(500).json({ message: "Failed to fetch financial health", error: error.message });
  }
};
