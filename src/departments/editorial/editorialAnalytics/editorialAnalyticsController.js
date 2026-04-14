import EditorialAnalyticsService from './editorialAnalyticsService.js';

// ---- Unified Endpoints ----
export const getEditorialSessionAnalytics = async (req, res) => {
  try {
    console.log("➡️ [Controller] session-duration HIT", req.query);

    const {
      startDate, endDate, platform, streamName, sessionMedium, author,
      editor, category,
      page = 1, pageSize = 10 // Default values for pagination
    } = req.query;

    const filters = {
      startDate, endDate, platform, streamName, sessionMedium, author, editor, category,
      page: Number(page), pageSize: Number(pageSize)
    };

    console.log("🟡 [Controller] Calling fetchJoinedData with filters:", filters);
    const result = await EditorialAnalyticsService.fetchJoinedData(filters);
    console.log("✅ [Controller] Data joined, sending response");

    res.status(200).json({
      success: true,
      filters,
      ...result, // data, total, page, pageSize, totalPages
      timestamp: new Date().toISOString(),
    });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getEditorialKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] kpis HIT", req.query);
    const {
      startDate, endDate, platform, streamName, sessionMedium, author, editor, category
    } = req.query;
    const filters = { startDate, endDate, platform, streamName, sessionMedium, author, editor, category };
    console.log("🟡 [Controller] Calling getKPIs with filters:", filters);
    const kpis = await EditorialAnalyticsService.getKPIs(filters);
    console.log("✅ [Controller] KPIs calculated, sending response");
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getEditorialChartData = async (req, res) => {
  try {
    console.log("➡️ [Controller] chart-data HIT", req.query);
    const {
      chartType = 'bar', metric = 'averageDuration', groupBy = 'platform',
      startDate, endDate, author, editor, category, platform, streamName, sessionMedium
    } = req.query;
    const filters = { startDate, endDate, author, editor, category, platform, streamName, sessionMedium };
    console.log("🟡 [Controller] Calling getChartData with:", { chartType, metric, groupBy, ...filters });
    const chartData = await EditorialAnalyticsService.getChartData({ chartType, metric, groupBy, ...filters });
    console.log("✅ [Controller] Chart data ready, sending response");
    res.status(200).json({
      success: true,
      chartType,
      metric,
      groupBy,
      filters,
      chartData,
      timestamp: new Date().toISOString(),
    });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

// ---- Feature-Specific Endpoints ----
export const getCrossPlatformEngagement = async (req, res) => {
  try {
    console.log("➡️ [Controller] cross-platform-engagement HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "platform",
      metric: "averageDuration",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "averageDuration", groupBy: "platform", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getContentROI = async (req, res) => {
  try {
    console.log("➡️ [Controller] content-roi HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "title",
      metric: "averageDuration",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "averageDuration", groupBy: "title", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getAudienceDemographics = async (req, res) => {
  try {
    console.log("➡️ [Controller] audience-demographics HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "sessionMedium",
      metric: "averageDuration",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "pie", metric: "averageDuration", groupBy: "sessionMedium", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getPersonalBylinePerformance = async (req, res) => {
  try {
    console.log("➡️ [Controller] personal-byline-performance HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "author",
      metric: "averageDuration",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "averageDuration", groupBy: "author", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getSourceEffectiveness = async (req, res) => {
  try {
    console.log("➡️ [Controller] source-effectiveness HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "pageReferrer",
      metric: "averageDuration",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "averageDuration", groupBy: "pageReferrer", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getSocialAmplification = async (req, res) => {
  try {
    console.log("➡️ [Controller] social-amplification HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "title",
      metric: "averageDuration",
      startDate, endDate, sessionMedium: "social"
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "averageDuration", groupBy: "title", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getAudienceRetention = async (req, res) => {
  try {
    console.log("➡️ [Controller] audience-retention HIT", req.query);
    const { startDate, endDate } = req.query;
    const chartData = await EditorialAnalyticsService.getChartData({
      groupBy: "title",
      metric: "bounceRate",
      startDate, endDate
    });
    res.status(200).json({ success: true, chartType: "bar", metric: "bounceRate", groupBy: "title", chartData });
    return;
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (res.headersSent) return;
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getPlatforms = async (req, res) => {
  try {
    const platforms = await EditorialAnalyticsService.getPlatforms();
    res.status(200).json({ success: true, platforms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStreams = async (req, res) => {
  try {
    const streams = await EditorialAnalyticsService.getStreams();
    res.status(200).json({ success: true, streams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSessionMediums = async (req, res) => {
  try {
    const mediums = await EditorialAnalyticsService.getSessionMediums();
    res.status(200).json({ success: true, sessionMediums: mediums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuthors = async (req, res) => {
  try {
    const authors = await EditorialAnalyticsService.getAuthors();
    res.status(200).json({ success: true, authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEditors = async (req, res) => {
  try {
    const editors = await EditorialAnalyticsService.getEditors();
    res.status(200).json({ success: true, editors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await EditorialAnalyticsService.getCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};