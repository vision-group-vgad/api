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

export const getResourceUtilizationAnalytics = async (req, res) => {
  try {
    const data = await RVSAnalyticsService.getResourceUtilizationAnalytics(req.query);
    res.json({ data });
  } catch (error) {
    console.error("[RVS] getResourceUtilizationAnalytics error:", error);
    res.status(500).json({ error: "Failed to fetch resource utilization analytics" });
  }
};

export const getVendorPerformanceAnalytics = async (req, res) => {
  try {
    const data = await RVSAnalyticsService.getVendorPerformanceAnalytics(req.query);
    res.json({ data });
  } catch (error) {
    console.error("[RVS] getVendorPerformanceAnalytics error:", error);
    res.status(500).json({ error: "Failed to fetch vendor performance analytics" });
  }
};

export const getSpaceOptimizationAnalytics = async (req, res) => {
  try {
    const data = await RVSAnalyticsService.getSpaceOptimizationAnalytics(req.query);
    res.json({ data });
  } catch (error) {
    console.error("[RVS] getSpaceOptimizationAnalytics error:", error);
    res.status(500).json({ error: "Failed to fetch space optimization analytics" });
  }
};

const notImplemented = (name) => (req, res) =>
  res.status(501).json({ success: false, message: `${name} not yet implemented` });

export const getResourceKPIs = notImplemented("getResourceKPIs");
export const getResourceChartData = notImplemented("getResourceChartData");
export const getResourceList = notImplemented("getResourceList");
export const getSpaceKPIs = notImplemented("getSpaceKPIs");
export const getSpaceChartData = notImplemented("getSpaceChartData");
export const getSpaceList = notImplemented("getSpaceList");
export const getVendorKPIs = notImplemented("getVendorKPIs");
export const getVendorChartData = notImplemented("getVendorChartData");
export const getVendorList = notImplemented("getVendorList");
export const getDepartments = notImplemented("getDepartments");
export const getResourceTypes = notImplemented("getResourceTypes");
export const getLocations = notImplemented("getLocations");
export const getServiceTypes = notImplemented("getServiceTypes");
export const getVendorNames = notImplemented("getVendorNames");