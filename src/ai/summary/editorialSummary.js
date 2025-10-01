// Editorial department summary generator

// --- Editorial Summary Functions ---
function summarizeBacklogAnalytics(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No backlog analytics data found.";
  const count = data.length;
  const avgBacklog = data.reduce((sum, a) => sum + (a.backlogDurationInDays || 0), 0) / count;
  return `Editorial backlog: ${count} articles, avg backlog duration ${avgBacklog.toFixed(1)} days.`;
}

function summarizeBottlenecks(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No bottleneck data found.";
  return `Bottlenecks: ${data.length} draft articles with no activity over threshold days.`;
}

function summarizeStaleReadyArticles(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No stale ready articles found.";
  return `Stale ready articles: ${data.length} ready articles have been in backlog for too long.`;
}

function summarizeContentProduction(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No content production data found.";
  const total = data.total || data.length;
  const avg = data.average || 0;
  return `Content production: ${total} articles published, avg per period: ${avg.toFixed(1)}.`;
}

function summarizeContentProductionTrend(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No content production trend data found.";
  const trend = data.trend || [];
  if (!trend.length) return "No trend data available.";
  const best = trend.reduce((a, b) => (a.count > b.count ? a : b));
  return `Peak content production: ${best.count} articles in period ${best.period}.`;
}

function summarizeEditorialKPIs(data) {
  if (!data || typeof data !== 'object') return "No editorial KPI data found.";
  return `Editorial KPIs: ${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')}.`;
}

function summarizeSessionAnalytics(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No session analytics data found.";
  const avgDuration = data.reduce((sum, s) => sum + (s.duration || 0), 0) / data.length;
  return `Avg session duration: ${avgDuration.toFixed(1)} seconds.`;
}

function summarizeChartData(data) {
  if (!data || typeof data !== 'object') return "No chart data found.";
  if (data.chartType && data.metric && data.groupBy) {
    return `Chart (${data.chartType}) for ${data.metric} grouped by ${data.groupBy}.`;
  }
  return "No chart summary available.";
}

function summarizeReadershipTrends(data) {
  if (!Array.isArray(data) || data.length === 0) return "No readership data found.";
  const totalReaders = data.reduce((sum, r) => sum + (r.readers || 0), 0);
  return `Total readership: ${totalReaders.toLocaleString()} across all tracked periods.`;
}

function summarizeErrorRate(data) {
  if (!Array.isArray(data) || data.length === 0) return "No error rate data found.";
  const totalErrors = data.reduce((sum, e) => sum + (e.errors || 0), 0);
  const totalArticles = data.reduce((sum, e) => sum + (e.articles || 0), 0);
  const errorRate = totalArticles ? (totalErrors / totalArticles) * 100 : 0;
  return `Editorial error rate: ${errorRate.toFixed(2)}% (${totalErrors} errors in ${totalArticles} articles).`;
}

function summarizeJournalistProductivity(data) {
  if (!Array.isArray(data) || data.length === 0) return "No journalist productivity data found.";
  const totalStories = data.reduce((sum, j) => sum + (j.stories || 0), 0);
  const avgStories = totalStories / (data.length || 1);
  return `Journalist productivity: avg ${avgStories.toFixed(1)} stories per journalist.`;
}

function summarizeContentFreshness(data) {
  if (!Array.isArray(data) || data.length === 0) return "No content freshness data found.";
  const freshArticles = data.filter(a => a.is_fresh).length;
  return `Content freshness: ${freshArticles} fresh articles out of ${data.length}.`;
}


const intentMap = {
  // Journalist Productivity
  editorial_team_productivity: summarizeJournalistProductivity,
  journalist_productivity: summarizeJournalistProductivity,
  journalist_productivity_metrics: summarizeJournalistProductivity,
  journalist_productivity_analysis: summarizeJournalistProductivity,
  journalist_productivity_insights: summarizeJournalistProductivity,
  editorial_productivity: summarizeJournalistProductivity,
  team_productivity_metrics: summarizeJournalistProductivity,

  // Content Production
  content_production_volume: summarizeContentProduction,
  content_production: summarizeContentProduction,
  content_production_analytics: summarizeContentProduction,
  content_performance: summarizeContentProduction,
  content_performance_metrics: summarizeContentProduction,

  // Content Freshness
  content_freshness_metrics: summarizeContentFreshness,
  content_freshness: summarizeContentFreshness,
  content_currency: summarizeContentFreshness,

  // Content Update Frequency
  content_update_frequency: summarizeContentProductionTrend,
  update_frequency: summarizeContentProductionTrend,
  content_refresh_rate: summarizeContentProductionTrend,

  // Section Performance
  section_performance_metrics: summarizeChartData,
  section_performance: summarizeChartData,
  section_performance_analysis: summarizeChartData,
  editorial_section_performance: summarizeChartData,

  // Topic Virality
  topic_virality_analysis: summarizeChartData,
  topic_virality: summarizeChartData,
  viral_content: summarizeChartData,

  // Visual Content Engagement
  visual_content_engagement: summarizeChartData,
  visual_content_engagement_metrics: summarizeChartData,
  visual_engagement: summarizeChartData,
  visual_asset_engagement: summarizeChartData,

  // Visual Asset Usage
  visual_asset_usage: summarizeChartData,
  visual_asset_usage_metrics: summarizeChartData,
  visual_usage: summarizeChartData,
  visual_usage_tracking: summarizeChartData,
  usage_tracking: summarizeChartData,

  // Rights Management
  rights_management_overview: summarizeChartData,
  rights_management: summarizeChartData,
  content_licensing: summarizeChartData,

  // Breaking News Performance
  breaking_news_performance: summarizeChartData,
  breaking_news_traction: summarizeChartData,
  breaking_news: summarizeChartData,
  breaking_news_coverage_effectiveness: summarizeChartData,

  // Readership Analysis
  readership_trend_analysis: summarizeReadershipTrends,
  readership_trends: summarizeReadershipTrends,
  readership_engagement_trends: summarizeReadershipTrends,
  reader_engagement: summarizeReadershipTrends,

  // Social Sentiment
  social_sentiment_analysis: summarizeChartData,
  social_sentiment: summarizeChartData,
  social_media_sentiment: summarizeChartData,

  // Editorial Error Rate
  editorial_error_rate: summarizeErrorRate,
  error_rate: summarizeErrorRate,
  content_quality: summarizeErrorRate,

  // Competitor Analysis
  competitor_benchmarking_status: summarizeChartData,
  competitor_benchmarking: summarizeChartData,
  competitive_analysis: summarizeChartData,

  // Editorial Backlog
  editorial_backlog_management: summarizeBacklogAnalytics,
  backlog_management: summarizeBacklogAnalytics,
  backlog_analytics: summarizeBacklogAnalytics,

  // Editing Cycle Times
  editing_cycle_times: summarizeContentProductionTrend,
  editorial_workflow: summarizeContentProductionTrend,

  // Segment Popularity
  segment_popularity: summarizeChartData,
  content_segment_analysis: summarizeChartData,

  // Version Control
  version_control: summarizeChartData,
  content_versioning: summarizeChartData,

  // Newsletter & Calendar
  newsletter_virality: summarizeContentProductionTrend,
  newsletter_performance: summarizeContentProductionTrend,
  editorial_calendar: summarizeContentProductionTrend,
  calendar_adherence: summarizeContentProductionTrend,
  deadline_compliance: summarizeContentProductionTrend,
  editorial_deadlines: summarizeContentProductionTrend,

  // Fallbacks for custom analytics
  backlogDetails: summarizeBacklogAnalytics,
  bottlenecks: summarizeBottlenecks,
  staleReadyArticles: summarizeStaleReadyArticles,
  content_production_trend: summarizeContentProductionTrend,
  editorial_kpis: summarizeEditorialKPIs,
  session_analytics: summarizeSessionAnalytics,
  chart_data: summarizeChartData,
};

function generateEditorialSummary(intent, data) {
  if (!data) return "No editorial data found.";
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No editorial summary available for this query.";
}

export default generateEditorialSummary;
