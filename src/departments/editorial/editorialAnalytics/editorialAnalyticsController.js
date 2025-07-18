import EditorialAnalyticsService from './editorialAnalyticsService.js';
import {
  formatEditorialBarChart,
  formatEditorialLineChart,
  formatEditorialPieChart
} from './editorialAnalyticsUtils.js';

// 🔁 Convert HH:MM:SS string to seconds safely
const toSeconds = (time) => {
  if (typeof time === 'number') return time; // already in seconds
  if (typeof time !== 'string') return 0;
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

// 📅 Get default 30-day date range
const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

// Helper to treat "all" or empty as no filter (undefined)
const normalizeFilter = (val) => {
  if (!val) return undefined;
  return val.toLowerCase() === 'all' ? undefined : val;
};

// 📊 Get All Editorial Sessions + KPI Summary (with pagination)
export const getEditorialSessionAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query.startDate && req.query.endDate
      ? { startDate: req.query.startDate, endDate: req.query.endDate }
      : getDefaultDateRange();

    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 50;
    const offset = (page - 1) * pageSize;

    // Apply normalized filters
    const filters = {
      startDate,
      endDate,
      platform: normalizeFilter(req.query.platform),
      streamName: normalizeFilter(req.query.streamName),
      pageTitle: normalizeFilter(req.query.pageTitle),
      sessionMedium: normalizeFilter(req.query.sessionMedium),
      // Optionally pass limit to service if CMC API supports it
      // limit: pageSize,
      // offset,
    };

    const data = await EditorialAnalyticsService.getEditorialSessionAnalytics(filters);

    // In-memory pagination (if CMC API doesn't support offset/limit)
    const paginatedData = data.slice(offset, offset + pageSize);

    const totalArticles = data.length;

    // Unique value sets
    const uniquePlatforms = new Set();
    const uniquePageTitles = new Set();
    const uniqueSessionMediums = new Set();
    const uniqueStreamNames = new Set();

    // Metrics initialization
    let totalDuration = 0;
    let totalBounceRate = 0;
    let outboundCount = 0;

    paginatedData.forEach(item => {
      uniquePlatforms.add(item.platform);
      uniquePageTitles.add(item.pageTitle);
      uniqueSessionMediums.add(item.sessionMedium);
      uniqueStreamNames.add(item.streamName);

      totalDuration += toSeconds(item.averageDuration);
      totalBounceRate += Number(item.bounceRate || 0);

      if (item.outbound === 'true') outboundCount++;
    });

    const avgDuration = paginatedData.length ? totalDuration / paginatedData.length : 0;
    const bounceRate = paginatedData.length ? totalBounceRate / paginatedData.length : 0;
    const outboundRate = paginatedData.length ? outboundCount / paginatedData.length : 0;

    res.status(200).json({
      success: true,
      filters,
      page,
      pageSize,
      total: totalArticles,
      totalPages: Math.ceil(totalArticles / pageSize),
      kpis: {
        totalArticles: paginatedData.length,
        totalPlatforms: uniquePlatforms.size,
        totalPageTitles: uniquePageTitles.size,
        totalSessionMediums: uniqueSessionMediums.size,
        totalStreams: uniqueStreamNames.size,
        averageDurationInSec: Math.round(avgDuration),
        averageBounceRate: bounceRate.toFixed(2),
        outboundEngagementRate: outboundRate.toFixed(2),
        totalOutboundArticles: outboundCount
      },
      summary: {
        platforms: Array.from(uniquePlatforms),
        streams: Array.from(uniqueStreamNames),
        sessionMediums: Array.from(uniqueSessionMediums),
        pageTitles: Array.from(uniquePageTitles),
        dateRange: `${startDate} to ${endDate}`
      },
      data: paginatedData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in Editorial Analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch editorial analytics',
      error: error.message
    });
  }
};

// 🩺 Environment Diagnostics Endpoint
export const getEditorialDiagnostics = (req, res) => {
  try {
    const diagnostics = {
      hasApiUrl: Boolean(process.env.API_URL),
      hasApiToken: Boolean(process.env.API_TOKEN),
      apiUrlValue: process.env.API_URL || null,
      tokenLength: process.env.API_TOKEN ? process.env.API_TOKEN.length : 0,
      nodeEnv: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      diagnostics,
      message: "Editorial analytics environment diagnostic information",
    });
  } catch (error) {
    console.error("❌ Error in diagnostics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch diagnostics info",
      error: error.message,
    });
  }
};

// 📈 Chart Data Endpoint
export const getEditorialChartData = async (req, res) => {
  try {
    const {
      chartType = 'line',
      metric = 'averageDuration',
      groupBy = 'platform',
      startDate,
      endDate,
      platform,
      sessionMedium,
      streamName
    } = req.query;

    const filters = {
      ...(startDate && endDate ? { startDate, endDate } : getDefaultDateRange()),
      platform: normalizeFilter(platform),
      sessionMedium: normalizeFilter(sessionMedium),
      streamName: normalizeFilter(streamName)
    };

    const rawData = await EditorialAnalyticsService.getEditorialSessionAnalytics(filters);

    let formattedData;
    switch (chartType.toLowerCase()) {
      case 'bar':
        formattedData = formatEditorialBarChart(rawData, metric, groupBy);
        break;
      case 'pie':
        formattedData = formatEditorialPieChart(rawData, metric, groupBy);
        break;
      case 'line':
      default:
        formattedData = formatEditorialLineChart(rawData, metric, groupBy);
        break;
    }

    res.status(200).json({
      success: true,
      chartType,
      metric,
      groupBy,
      filters,
      chartData: formattedData
    });
  } catch (error) {
    console.error('❌ Error generating chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate chart data',
      error: error.message
    });
  }
};