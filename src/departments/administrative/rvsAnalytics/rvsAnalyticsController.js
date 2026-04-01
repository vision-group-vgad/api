import RVSAnalyticsService from "./rvsAnalyticsService.js";

export const getRVSOverview = async (req, res) => {
  try {
    const { department = "All" } = req.query;

    const data = await RVSAnalyticsService.getOverview(department);

    res.json(data);
  } catch (error) {
    console.error("RVS Controller Error:", error);
    res.status(500).json({
      error: "Failed to fetch RVS analytics data",
    });
  }
};