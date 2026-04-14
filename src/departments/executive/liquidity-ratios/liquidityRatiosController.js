// liquidityRatiosController.js
import { generateLiquidityRatiosRaw } from "./liquidityRatiosData.js";

export const getLiquidityRatios = (req, res) => {
  try {
    const data = generateLiquidityRatiosRaw(200);
    const { businessUnit, startDate, endDate } = req.query;
    let filteredData = data;

    // Filter by business unit
    if (businessUnit) {
      const units = businessUnit.split(",");
      filteredData = filteredData.filter(d => d?.businessUnit && units.includes(d.businessUnit));
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Helper: assign status based on thresholds
    const getStatus = (value, type) => {
      switch (type) {
        case "currentRatio":
          if (value >= 1.5) return "green";
          if (value >= 1) return "yellow";
          return "red";
        case "quickRatio":
          if (value >= 1) return "green";
          if (value >= 0.8) return "yellow";
          return "red";
        case "cashRatio":
          if (value >= 0.5) return "green";
          if (value >= 0.25) return "yellow";
          return "red";
        case "debtToEquity":
          if (value <= 1) return "green";
          if (value <= 2) return "yellow";
          return "red";
        default:
          return "";
      }
    };

    // Aggregate monthly trends
    const monthlyMap = {};
    filteredData.forEach(d => {
      const monthKey = d.date.slice(0, 7);
      if (!monthlyMap[monthKey]) monthlyMap[monthKey] = [];
      monthlyMap[monthKey].push(d);
    });

    const currentRatioTrend = [];
    const quickRatioTrend = [];
    const cashRatioTrend = [];
    const debtToEquityTrend = [];

    Object.entries(monthlyMap).forEach(([month, records]) => {
      const totalCurrentAssets = records.reduce((a, r) => a + (r.currentAssets || 0), 0);
      const totalCurrentLiabilities = records.reduce((a, r) => a + (r.currentLiabilities || 0), 0);
      const totalInventory = records.reduce((a, r) => a + (r.inventory || 0), 0);
      const totalCash = records.reduce((a, r) => a + (r.cash || 0), 0);
      const totalLiabilities = records.reduce((a, r) => a + (r.totalLiabilities || 0), 0);
      const totalEquity = records.reduce((a, r) => a + (r.equity || 0), 0);

      const currentRatio = totalCurrentLiabilities ? totalCurrentAssets / totalCurrentLiabilities : 0;
      const quickRatio = totalCurrentLiabilities ? (totalCurrentAssets - totalInventory) / totalCurrentLiabilities : 0;
      const cashRatio = totalCurrentLiabilities ? totalCash / totalCurrentLiabilities : 0;
      const debtToEquity = totalEquity ? totalLiabilities / totalEquity : 0;

      currentRatioTrend.push({ month, value: Number(currentRatio.toFixed(2)) });
      quickRatioTrend.push({ month, value: Number(quickRatio.toFixed(2)) });
      cashRatioTrend.push({ month, value: Number(cashRatio.toFixed(2)) });
      debtToEquityTrend.push({ month, value: Number(debtToEquity.toFixed(2)) });
    });

    // Latest ratios (most recent record)
    const latestRecord = filteredData.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b, filteredData[0] || {});

    const latest = latestRecord?.currentAssets
      ? {
          currentRatio: {
            value: Number((latestRecord.currentAssets / latestRecord.currentLiabilities).toFixed(2)),
            status: getStatus(latestRecord.currentAssets / latestRecord.currentLiabilities, "currentRatio")
          },
          quickRatio: {
            value: Number(((latestRecord.currentAssets - latestRecord.inventory) / latestRecord.currentLiabilities).toFixed(2)),
            status: getStatus((latestRecord.currentAssets - latestRecord.inventory) / latestRecord.currentLiabilities, "quickRatio")
          },
          cashRatio: {
            value: Number((latestRecord.cash / latestRecord.currentLiabilities).toFixed(2)),
            status: getStatus(latestRecord.cash / latestRecord.currentLiabilities, "cashRatio")
          },
          debtToEquity: {
            value: Number((latestRecord.totalLiabilities / latestRecord.equity).toFixed(2)),
            status: getStatus(latestRecord.totalLiabilities / latestRecord.equity, "debtToEquity")
          }
        }
      : {};

    const summary = {
      totalRecords: filteredData.length,
      latest,
      trends: {
        currentRatioTrend,
        quickRatioTrend,
        cashRatioTrend,
        debtToEquityTrend
      }
    };

    res.json({ summary, data: filteredData });
  } catch (error) {
    console.error("Error fetching liquidity ratios:", error);
    res.status(500).json({ message: "Failed to fetch liquidity ratios", error: error.message });
  }
};
