import rvsAnalyticsService from "./rvsAnalyticsService.js";

// RESOURCE UTILIZATION CONTROLLERS
export const getResourceKPIs = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] resource-kpis HIT", req.query);
    const filters = req.query;
    const kpis = await rvsAnalyticsService.getResourceKPIs(filters);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResourceChartData = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] resource-chart HIT", req.query);
    const { metric, groupBy, ...filters } = req.query;
    const chartData = await rvsAnalyticsService.getResourceChartData({ metric, groupBy, ...filters });
    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResourceList = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] resource-list HIT", req.query);
    const filters = req.query;
    const result = await rvsAnalyticsService.fetchAllResources(filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SPACE OPTIMIZATION CONTROLLERS
export const getSpaceKPIs = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] space-kpis HIT", req.query);
    const filters = req.query;
    const kpis = await rvsAnalyticsService.getSpaceKPIs(filters);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSpaceChartData = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] space-chart HIT", req.query);
    const { metric, groupBy, ...filters } = req.query;
    const chartData = await rvsAnalyticsService.getSpaceChartData({ metric, groupBy, ...filters });
    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSpaceList = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] space-list HIT", req.query);
    const filters = req.query;
    const result = await rvsAnalyticsService.fetchAllSpaces(filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VENDOR PERFORMANCE CONTROLLERS
export const getVendorKPIs = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] vendor-kpis HIT", req.query);
    const filters = req.query;
    const kpis = await rvsAnalyticsService.getVendorKPIs(filters);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorChartData = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] vendor-chart HIT", req.query);
    const { metric, groupBy, ...filters } = req.query;
    const chartData = await rvsAnalyticsService.getVendorChartData({ metric, groupBy, ...filters });
    res.status(200).json({ success: true, data: chartData });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorList = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] vendor-list HIT", req.query);
    const filters = req.query;
    const result = await rvsAnalyticsService.fetchAllVendors(filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// COMBINED ANALYTICS CONTROLLERS
export const getRVSOverview = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] overview HIT", req.query);
    const filters = req.query;
    
    // Get all KPIs in parallel
    const [resourceKPIs, spaceKPIs, vendorKPIs] = await Promise.all([
      rvsAnalyticsService.getResourceKPIs(filters),
      rvsAnalyticsService.getSpaceKPIs(filters),
      rvsAnalyticsService.getVendorKPIs(filters)
    ]);

    const overview = {
      resources: resourceKPIs,
      spaces: spaceKPIs,
      vendors: vendorKPIs,
      summary: {
        totalResources: resourceKPIs.totalResources,
        totalSpaces: spaceKPIs.totalSpaces,
        totalVendors: vendorKPIs.totalVendors,
        avgResourceUtilization: resourceKPIs.avgUtilizationRate,
        avgSpaceOccupancy: spaceKPIs.avgOccupancyRate,
        avgVendorPerformance: vendorKPIs.avgServiceQuality,
        totalMonthlyCost: resourceKPIs.totalMonthlyCost + spaceKPIs.totalSpaceCost + vendorKPIs.totalActualCost
      }
    };

    res.status(200).json({ success: true, data: overview });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DROPDOWN FILTER CONTROLLERS
export const getDepartments = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] departments HIT");
    const departments = await rvsAnalyticsService.getDepartments();
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResourceTypes = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] resource-types HIT");
    const types = await rvsAnalyticsService.getResourceTypes();
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] locations HIT");
    const locations = await rvsAnalyticsService.getLocations();
    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceTypes = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] service-types HIT");
    const types = await rvsAnalyticsService.getServiceTypes();
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorNames = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] vendor-names HIT");
    const names = await rvsAnalyticsService.getVendorNames();
    res.status(200).json({ success: true, data: names });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SPECIFIC ANALYTICS CONTROLLERS
export const getResourceUtilizationAnalytics = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] resource-utilization HIT", req.query);
    const filters = req.query;
    const { metric = "utilization_rate", groupBy = "department" } = req.query;
    
    const [kpis, chartData] = await Promise.all([
      rvsAnalyticsService.getResourceKPIs(filters),
      rvsAnalyticsService.getResourceChartData({ metric, groupBy, ...filters })
    ]);

    res.status(200).json({ 
      success: true, 
      data: { 
        kpis, 
        chartData,
        metric,
        groupBy 
      } 
    });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSpaceOptimizationAnalytics = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] space-optimization HIT", req.query);
    const filters = req.query;
    const { metric = "occupancy_rate", groupBy = "department_id" } = req.query;
    
    const [kpis, chartData] = await Promise.all([
      rvsAnalyticsService.getSpaceKPIs(filters),
      rvsAnalyticsService.getSpaceChartData({ metric, groupBy, ...filters })
    ]);

    res.status(200).json({ 
      success: true, 
      data: { 
        kpis, 
        chartData,
        metric,
        groupBy 
      } 
    });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendorPerformanceAnalytics = async (req, res) => {
  try {
    console.log("➡️ [RVS Controller] vendor-performance HIT", req.query);
    const filters = req.query;
    const { metric = "service_quality_score", groupBy = "service_type" } = req.query;
    
    const [kpis, chartData] = await Promise.all([
      rvsAnalyticsService.getVendorKPIs(filters),
      rvsAnalyticsService.getVendorChartData({ metric, groupBy, ...filters })
    ]);

    res.status(200).json({ 
      success: true, 
      data: { 
        kpis, 
        chartData,
        metric,
        groupBy 
      } 
    });
  } catch (error) {
    console.error("❌ [RVS Controller] Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};