import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleEditorialQueries(intent, filters, token, roleCode) {
  // For endpoints that require date ranges, provide defaults
  const getEndpointWithDefaultDates = (path) => {
    const params = new URLSearchParams(filters);
    if (!params.has('startDate')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      params.set('startDate', thirtyDaysAgo.toISOString().split('T')[0]);
    }
    if (!params.has('endDate')) {
      const today = new Date();
      params.set('endDate', today.toISOString().split('T')[0]);
    }
    return `${path}?${params.toString()}`;
  };

  switch (intent) {
    // Editorial Team & Productivity - UPDATED TO WORKING ENDPOINTS
    case "editorial_team_productivity":
    case "journalist_productivity":
    case "journalist_productivity_metrics":
    case "journalist_productivity_analysis":
    case "journalist_productivity_insights":
    case "editorial_productivity":
    case "team_productivity_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity", filters), token, roleCode);
    
    // Content Production
    case "content_production_volume":
    case "content_production":
    case "content_production_analytics":
    case "content_performance":
    case "content_performance_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production", filters), token, roleCode);
    
    // Content Freshness & Updates
    case "content_freshness_metrics":
    case "content_freshness":
    case "content_currency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/contentFreshness", filters), token, roleCode);
    
    // Content Update Frequency
    case "content_update_frequency":
    case "update_frequency":
    case "content_refresh_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/updateFrequency", filters), token, roleCode);
    
    // Section Performance
    case "section_performance_metrics":
    case "section_performance":
    case "section_performance_analysis":
    case "editorial_section_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance", filters), token, roleCode);
    
    // Topic Virality
    case "topic_virality_analysis":
    case "topic_virality":
    case "viral_content":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality", filters), token, roleCode);
    
    // Visual Content Engagement
    case "visual_content_engagement":
    case "visual_content_engagement_metrics":
    case "visual_engagement":
    case "visual_asset_engagement":
      return await makeAPIRequestGET(getEndpointWithDefaultDates("/api/v1/editorial/visual-engagement"), token, roleCode);
    
    // Visual Asset Usage
    case "visual_asset_usage":
    case "visual_asset_usage_metrics":
    case "visual_usage":
    case "visual_usage_tracking":
    case "usage_tracking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-usage", filters), token, roleCode);
    
    // Rights Management
    case "rights_management_overview":
    case "rights_management":
    case "content_licensing":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/rights-management", filters), token, roleCode);
    
    // FALLBACK MAPPINGS TO WORKING ENDPOINTS
    // Breaking News Performance - FALLBACK TO TOPIC VIRALITY
    case "breaking_news_performance":
    case "breaking_news_traction":
    case "breaking_news":
    case "breaking_news_coverage_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality", filters), token, roleCode);
    
    // Readership Analysis - FALLBACK TO SECTION PERFORMANCE
    case "readership_trend_analysis":
    case "readership_trends":
    case "readership_engagement_trends":
    case "reader_engagement":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance", filters), token, roleCode);
    
    // Social Sentiment - FALLBACK TO TOPIC VIRALITY
    case "social_sentiment_analysis":
    case "social_sentiment":
    case "social_media_sentiment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality", filters), token, roleCode);
    
    // Editorial Error Rate - FALLBACK TO JOURNALIST PRODUCTIVITY
    case "editorial_error_rate":
    case "error_rate":
    case "content_quality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity", filters), token, roleCode);
    
    // Competitor Analysis - FALLBACK TO SECTION PERFORMANCE
    case "competitor_benchmarking_status":
    case "competitor_benchmarking":
    case "competitive_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance", filters), token, roleCode);
    
    // Editorial Backlog - FALLBACK TO CONTENT PRODUCTION
    case "editorial_backlog_management":
    case "backlog_management":
    case "backlog_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production", filters), token, roleCode);
    
    // Editing Cycle Times - FALLBACK TO CONTENT PRODUCTION
    case "editing_cycle_times":
    case "editorial_workflow":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production", filters), token, roleCode);
    
    // Segment Popularity - FALLBACK TO SECTION PERFORMANCE
    case "segment_popularity":
    case "content_segment_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance", filters), token, roleCode);
    
    // Version Control - FALLBACK TO RIGHTS MANAGEMENT
    case "version_control":
    case "content_versioning":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/rights-management", filters), token, roleCode);
    
    // Newsletter & Calendar - FALLBACK TO CONTENT PRODUCTION
    case "newsletter_virality":
    case "newsletter_performance":
    case "editorial_calendar":
    case "calendar_adherence":
    case "deadline_compliance":
    case "editorial_deadlines":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production", filters), token, roleCode);
    
    default:
      // Default to content production for unknown intents
      console.log(`Unknown editorial intent: ${intent}, using default endpoint`);
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production", filters), token, roleCode);
  }
}