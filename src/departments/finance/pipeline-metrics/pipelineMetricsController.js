import { generatePipelineMetricsRaw } from "./pipelineMetricsData.js";

export const getPipelineAnalysis = (req, res) => {
  try {
    const data = generatePipelineMetricsRaw(200);
    const { sourceSystem, pipelineJob, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by source system(s)
    if (sourceSystem) {
      const systems = sourceSystem.split(",");
      filteredData = filteredData.filter(d => d?.sourceSystem && systems.includes(d.sourceSystem));
    }

    // Filter by pipeline job(s)
    if (pipelineJob) {
      const jobs = pipelineJob.split(",");
      filteredData = filteredData.filter(d => d?.pipelineJob && jobs.includes(d.pipelineJob));
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-07-01");
    const end = endDate ? new Date(endDate) : new Date("2025-07-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Add per-run metrics
    const dataWithMetrics = filteredData.map(d => {
      const loadSuccessRate = d.recordsExpected
        ? +((d.recordsLoaded / d.recordsExpected) * 100).toFixed(2)
        : 0;
      const errorRate = d.recordsExpected
        ? +((d.errors / d.recordsExpected) * 100).toFixed(2)
        : 0;
      const droppedPct = d.recordsExpected
        ? +((d.dropped / d.recordsExpected) * 100).toFixed(2)
        : 0;
      const manualFixPct = d.errors
        ? +((d.manualFixes / d.errors) * 100).toFixed(2)
        : 0;
      const throughput = d.latency > 0
        ? +(d.recordsLoaded / d.latency).toFixed(2)
        : 0;

      return {
        ...d,
        loadSuccessRate,
        errorRate,
        droppedPct,
        manualFixPct,
        throughput
      };
    });

    // Summary metrics
    const totalExpected = filteredData.reduce((a, d) => a + d.recordsExpected, 0);
    const totalLoaded = filteredData.reduce((a, d) => a + d.recordsLoaded, 0);
    const totalErrors = filteredData.reduce((a, d) => a + d.errors, 0);
    const totalDropped = filteredData.reduce((a, d) => a + d.dropped, 0);
    const totalFixes = filteredData.reduce((a, d) => a + d.manualFixes, 0);
    const avgLatency = filteredData.length
      ? +(filteredData.reduce((a, d) => a + d.latency, 0) / filteredData.length).toFixed(2)
      : 0;

    const summary = {
      totalRuns: filteredData.length,
      totalExpected,
      totalLoaded,
      totalErrors,
      totalDropped,
      totalFixes,
      avgLatency,
      loadSuccessRate: totalExpected
        ? +((totalLoaded / totalExpected) * 100).toFixed(2)
        : 0,
      errorRate: totalExpected
        ? +((totalErrors / totalExpected) * 100).toFixed(2)
        : 0,
      droppedPct: totalExpected
        ? +((totalDropped / totalExpected) * 100).toFixed(2)
        : 0,
      manualFixPct: totalErrors
        ? +((totalFixes / totalErrors) * 100).toFixed(2)
        : 0
    };

    // Monthly trends
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          runs: 0,
          expected: 0,
          loaded: 0,
          errors: 0,
          dropped: 0,
          fixes: 0,
          latencySum: 0
        };
      }
      monthlyMap[month].runs += 1;
      monthlyMap[month].expected += d.recordsExpected;
      monthlyMap[month].loaded += d.recordsLoaded;
      monthlyMap[month].errors += d.errors;
      monthlyMap[month].dropped += d.dropped;
      monthlyMap[month].fixes += d.manualFixes;
      monthlyMap[month].latencySum += d.latency;
    });

    const pipelineTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => {
        const loadSuccessRate = vals.expected
          ? +((vals.loaded / vals.expected) * 100).toFixed(2)
          : 0;
        const errorRate = vals.expected
          ? +((vals.errors / vals.expected) * 100).toFixed(2)
          : 0;
        const droppedPct = vals.expected
          ? +((vals.dropped / vals.expected) * 100).toFixed(2)
          : 0;
        const manualFixPct = vals.errors
          ? +((vals.fixes / vals.errors) * 100).toFixed(2)
          : 0;
        const avgLatency = vals.runs
          ? +(vals.latencySum / vals.runs).toFixed(2)
          : 0;

        return {
          month,
          runs: vals.runs,
          expected: vals.expected,
          loaded: vals.loaded,
          errors: vals.errors,
          dropped: vals.dropped,
          fixes: vals.fixes,
          avgLatency,
          loadSuccessRate,
          errorRate,
          droppedPct,
          manualFixPct
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json({ summary, pipelineTrends, data: dataWithMetrics });

  } catch (error) {
    console.error("Error fetching pipeline analysis:", error);
    res.status(500).json({
      message: "Failed to fetch pipeline analysis",
      error: error.message
    });
  }
};
