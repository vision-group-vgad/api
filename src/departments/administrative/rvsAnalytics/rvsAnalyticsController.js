import RVSAnalyticsService from "./rvsAnalyticsService.js";

export const getRVSOverview = async (req, res) => {
  try {
    // Get department filter from query, default to "All"
    const { department = "All" } = req.query;

    // Fetch combined RVS data from the service
    const data = await RVSAnalyticsService.getCombinedOverview(department);

    res.json({
      department,
      data,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch RVS overview",
      error: err.message,
    });
  }
};