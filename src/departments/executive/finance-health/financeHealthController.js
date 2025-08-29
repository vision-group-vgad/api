// financialHealthController.js
import { generateFinancialHealthRaw } from "./financeHealthData.js";

export const getFinancialHealth = (req, res) => {
  try {
    const data = generateFinancialHealthRaw(200);
    const { department, startDate, endDate } = req.query;
    let filteredData = data;

    // Filter by department
    if (department) {
      const departments = department.split(",");
      filteredData = filteredData.filter(
        (d) => d?.department && departments.includes(d.department)
      );
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter((d) => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Aggregate by month dynamically (only months with data)
    const monthlyMap = {};
    filteredData.forEach((d) => {
      if (!d?.date) return;
      const monthKey = d.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { revenue: 0, cogs: 0, expenses: 0 };
      }
      monthlyMap[monthKey].revenue += d.revenue || 0;
      monthlyMap[monthKey].cogs += d.cogs || 0;
      monthlyMap[monthKey].expenses += d.expenses || 0;
    });

    // Build trends only for months with data
    const netProfitTrend = [];
    const grossProfitTrend = [];
    let totalNetProfit = 0;
    let totalGrossProfit = 0;

    Object.entries(monthlyMap).forEach(([month, values]) => {
      const { revenue = 0, cogs = 0, expenses = 0 } = values;
      if (revenue === 0 && cogs === 0 && expenses === 0) return; // skip empty months

      const netProfit = revenue - cogs - expenses;
      const grossProfit = revenue - cogs;

      netProfitTrend.push({ month, value: netProfit });
      grossProfitTrend.push({ month, value: grossProfit });

      totalNetProfit += netProfit;
      totalGrossProfit += grossProfit;
    });

    // Compute Cash Flow Runway
    const avgCashReserves =
      filteredData.reduce((a, d) => a + (d.cashReserves || 0), 0) /
      (filteredData.length || 1);
    const avgMonthlyBurn =
      filteredData.reduce((a, d) => a + (d.monthlyBurn || 0), 0) /
      (filteredData.length || 1);
    const cashFlowRunwayMonths = avgMonthlyBurn
      ? (avgCashReserves / avgMonthlyBurn).toFixed(1)
      : "0";

    // Cash Flow by Activity
    const totalInvesting = filteredData.reduce(
      (a, d) => a + (d.cashFlowInvesting || 0),
      0
    );
    const totalFinancing = filteredData.reduce(
      (a, d) => a + (d.cashFlowFinancing || 0),
      0
    );

    const summary = {
      totalRecords: filteredData.length,
      netProfit: totalNetProfit,
      grossProfit: totalGrossProfit,
      cashFlowRunwayMonths,
      cashFlowByActivity: {
        operating: totalNetProfit,
        investing: totalInvesting,
        financing: totalFinancing,
      },
      netProfitTrend,
      grossProfitTrend,
    };

    res.json({ summary, data: filteredData });
  } catch (error) {
    console.error("Error fetching financial health:", error);
    res.status(500).json({
      message: "Failed to fetch financial health",
      error: error.message,
    });
  }
};
