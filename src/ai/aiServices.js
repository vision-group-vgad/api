import axios from "axios";

// Base URL for internal API calls
const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// Helper functions for API requests
async function makeAPIRequest(endpoint, data, token, roleCode) {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-role-code': roleCode,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error(`Unauthorized access: You don't have permission to access this information.`);
    }
    throw error;
  }
}

async function makeAPIRequestGET(endpoint, token, roleCode) {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-role-code': roleCode,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error(`Unauthorized access: You don't have permission to access this information.`);
    }
    throw error;
  }
}

// DeepSeek AI integration
async function callDeepSeekAI(question) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that analyzes business questions and extracts key information. 
              
              For each question, you must respond with a JSON object containing:
              - intent: specific action or metric requested
              - department: which business department this relates to (finance, editorial, sales, operations, it, administrative, executive, specialized)
              - filters: any date ranges, categories, or filters mentioned
              - confidence: your confidence level (0-1)
              
              Departments:
              - finance: departmental budget, expenses, departmental accounting (NOT strategic company-wide financial health)
              - editorial: content, articles, journalism, publishing, readership, writers, editors
              - sales: campaigns, leads, conversions, revenue attribution, client management, advertising
              - operations: production, manufacturing, logistics, efficiency, equipment, delivery, ticket resolution, support tickets
              - it: servers, networks, security, infrastructure, systems, technology, IT service desk
              - administrative: meetings, schedules, resources, facilities, office management
              - executive: CEO/C-level analytics, company-wide metrics, strategic initiatives, governance, legal exposure, board reporting, workforce analytics, retention rates, compensation benchmarks, financial health trending, revenue performance, market share, ROI analysis, risk management, compliance oversight
              - specialized: HR, legal, compliance, risk management, events
              
              IMPORTANT: Executive queries include CEO Analytics, company-wide financial health, governance, legal risks, board metrics, workforce analytics, retention analysis, compensation benchmarks, strategic performance, market analysis, and high-level business intelligence.
              
              Examples:
              Question: "What are our departmental expenses?"
              Response: {"intent": "departmental_expenses", "department": "finance", "filters": {}, "confidence": 0.95}
              
              Question: "How is our financial health trending?"
              Response: {"intent": "financial_health_trending", "department": "executive", "filters": {}, "confidence": 0.95}
              
              Question: "Show me server performance"  
              Response: {"intent": "server_health", "department": "it", "filters": {}, "confidence": 0.90}
              
              Question: "What are our legal exposure risks?"
              Response: {"intent": "legal_exposure_risk_assessment", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "Give me revenue performance analysis"
              Response: {"intent": "revenue_performance_analysis", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "What's our employee retention rate?"
              Response: {"intent": "employee_retention_rate", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "Show me workforce analytics overview"
              Response: {"intent": "workforce_analytics_overview", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "How are our liquidity ratios performing?"
              Response: {"intent": "liquidity_ratios_performance", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "What's our market share position?"
              Response: {"intent": "market_share_analysis", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "Show me cost optimization opportunities"
              Response: {"intent": "cost_optimization_opportunities", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "What's our ROI on strategic initiatives?"
              Response: {"intent": "roi_strategic_initiatives", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "Give me risk heat map analysis"
              Response: {"intent": "risk_heat_map_analysis", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "How effective are our controls?"
              Response: {"intent": "controls_effectiveness_assessment", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "Show me compliance audit status"
              Response: {"intent": "compliance_audit_status", "department": "executive", "filters": {}, "confidence": 0.90}
              
              Question: "What's our company-wide performance?"
              Response: {"intent": "company_performance_overview", "department": "executive", "filters": {}, "confidence": 0.95}
              
              Question: "Show me governance compliance"
              Response: {"intent": "governance_compliance_status", "department": "executive", "filters": {}, "confidence": 0.90}`
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response.data.choices[0].message.content.trim();
      
      // Try to parse JSON response
      try {
        const aiResult = JSON.parse(content);
        return {
          intent: aiResult.intent || 'unknown',
          department: aiResult.department || 'general',
          filters: aiResult.filters || {},
          confidence: aiResult.confidence || 0.5
        };
      } catch {
        console.error('Failed to parse AI response as JSON:', content);
        return {
          intent: 'parse_error',
          department: 'general', 
          filters: {},
          confidence: 0.1
        };
      }

    } catch (err) {
      lastError = err;
      console.error(`DeepSeek AI attempt ${attempt} failed:`, err.message);
      
      if (attempt < maxRetries && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT')) {
        // Timeout, retry
        const delay = attempt * 1500;
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
  
  throw new Error(`DeepSeek AI API failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
}

// Department handlers
async function handleFinanceQueries(intent, filters, token, roleCode) {
  // Convert data to GET request with query parameters
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  try {
    switch (intent) {
      // Core Financial Metrics - using correct endpoints from test results
      case "financial_health_overview":
      case "financial_performance":
      case "financial_close_metrics":
        return await makeAPIRequestGET("/api/v1/finance/close-metrics", token, roleCode);
      case "cash_flow_analysis":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/cashflow", token, roleCode);
      case "audit_trail_analysis":
        return await makeAPIRequestGET("/api/v1/finance/audit-trail", token, roleCode);
      case "reporting_accuracy":
        return await makeAPIRequestGET("/api/v1/finance/reporting-accuracy", token, roleCode);
      case "profit_loss_analysis":
      case "regional_pnl":
        return await makeAPIRequestGET("/api/v1/finance/regional-pnl", token, roleCode);
      case "pipeline_metrics":
        return await makeAPIRequestGET("/api/v1/finance/pipeline-metrics", token, roleCode);
      
      // Executive Finance APIs  
      case "roi_analysis_by_department":
      case "roi_analysis":
        return await makeAPIRequestGET("/api/v1/executive/roi-analysis", token, roleCode);
      case "liquidity_ratios_analysis":
        return await makeAPIRequestGET("/api/v1/executive/liquidity-ratios", token, roleCode);
      case "cost_optimization":
        return await makeAPIRequestGET("/api/v1/executive/cost-optimization", token, roleCode);
      case "revenue_growth":
      case "revenue_performance":
        return await makeAPIRequestGET("/api/v1/executive/financial-health", token, roleCode);
      
      // Asset Management
      case "asset_depreciation":
      case "asset_depreciation_performance":
        return await makeAPIRequestGET("/api/v1/asset-depreciation", token, roleCode);
      case "capex":
      case "capital_expenditure":
        return await makeAPIRequestGET("/api/v1/capEx/capex-dummy", token, roleCode);
      
      // Forecasting
      case "financial_forecasting_data":
      case "revenue_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      case "net_income_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/net-income", token, roleCode);
      
      // System Health
      case "integration_health":
        return await makeAPIRequestGET("/api/v1/integration-health", token, roleCode);
      
      // Date-dependent APIs with default parameters
      case "budget_variance":
      case "budget_variance_analysis": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/budget-variance?${dateParams}`, token, roleCode);
      }
      case "expense_category":
      case "expense_category_breakdown": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/expense-category?${dateParams}`, token, roleCode);
      }
      case "accounts_receivable_aging":
      case "ap_ar_aging": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/ap-ar-aging?${dateParams}`, token, roleCode);
      }
      case "collection_efficiency": {
        const yearParam = new URLSearchParams({
          year: filters.year || '2025'
        });
        return await makeAPIRequestGET(`/api/v1/collection-efficiency/annual?${yearParam}`, token, roleCode);
      }
      case "bad_debt_ratios": {
        const yearParam = new URLSearchParams({
          year: filters.year || '2025'
        });
        return await makeAPIRequestGET(`/api/v1/bad-debt-ratios/annual?${yearParam}`, token, roleCode);
      }
      case "dso":
      case "days_sales_outstanding": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/dso?${dateParams}`, token, roleCode);
      }
      
      // Legacy endpoints
      case "total_assets_value":
        return await makeAPIRequestGET(getEndpoint("/api/v1/total-assets-value"), token, roleCode);
      case "finance_forecasting":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance-forecasting"), token, roleCode);
      case "gl_reconciliation":
        return await makeAPIRequestGET(getEndpoint("/api/v1/gl-reconciliation"), token, roleCode);
      case "tax_provisioning":
        return await makeAPIRequestGET(getEndpoint("/api/v1/tax-provisioning"), token, roleCode);
      case "statement_variance":
        return await makeAPIRequestGET(getEndpoint("/api/v1/fin-statement-variance"), token, roleCode);
      
      // Additional AI-generated intents
      case "revenue_growth_comparison":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      case "profit_loss_analysis_by_region":
        return await makeAPIRequestGET("/api/v1/finance/regional-pnl", token, roleCode);
      case "financial_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      default:
        throw new Error(`Unknown finance intent: ${intent}`);
    }
  } catch (error) {
    console.error(`Finance query error for intent "${intent}":`, error.message);
    throw error;
  }
}

async function handleEditorialQueries(intent, filters, token, roleCode) {
  // Convert data to GET request with query parameters
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;
  
  // For endpoints that require date ranges, provide defaults
  const getEndpointWithDates = (path) => {
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity"), token, roleCode);
    
    // Content Production
    case "content_production_volume":
    case "content_production":
    case "content_production_analytics":
    case "content_performance":
    case "content_performance_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    
    // Content Freshness & Updates
    case "content_freshness_metrics":
    case "content_freshness":
    case "content_currency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/contentFreshness"), token, roleCode);
    
    // Content Update Frequency
    case "content_update_frequency":
    case "update_frequency":
    case "content_refresh_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/updateFrequency"), token, roleCode);
    
    // Section Performance
    case "section_performance_metrics":
    case "section_performance":
    case "section_performance_analysis":
    case "editorial_section_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    
    // Topic Virality
    case "topic_virality_analysis":
    case "topic_virality":
    case "viral_content":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality"), token, roleCode);
    
    // Visual Content Engagement
    case "visual_content_engagement":
    case "visual_content_engagement_metrics":
    case "visual_engagement":
    case "visual_asset_engagement":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/editorial/visual-engagement"), token, roleCode);
    
    // Visual Asset Usage
    case "visual_asset_usage":
    case "visual_asset_usage_metrics":
    case "visual_usage":
    case "visual_usage_tracking":
    case "usage_tracking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-usage"), token, roleCode);
    
    // Rights Management
    case "rights_management_overview":
    case "rights_management":
    case "content_licensing":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/rights-management"), token, roleCode);
    
    // FALLBACK MAPPINGS TO WORKING ENDPOINTS
    // Breaking News Performance - FALLBACK TO TOPIC VIRALITY
    case "breaking_news_performance":
    case "breaking_news_traction":
    case "breaking_news":
    case "breaking_news_coverage_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality"), token, roleCode);
    
    // Readership Analysis - FALLBACK TO SECTION PERFORMANCE
    case "readership_trend_analysis":
    case "readership_trends":
    case "readership_engagement_trends":
    case "reader_engagement":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    
    // Social Sentiment - FALLBACK TO TOPIC VIRALITY
    case "social_sentiment_analysis":
    case "social_sentiment":
    case "social_media_sentiment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality"), token, roleCode);
    
    // Editorial Error Rate - FALLBACK TO JOURNALIST PRODUCTIVITY
    case "editorial_error_rate":
    case "error_rate":
    case "content_quality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity"), token, roleCode);
    
    // Competitor Analysis - FALLBACK TO SECTION PERFORMANCE
    case "competitor_benchmarking_status":
    case "competitor_benchmarking":
    case "competitive_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    
    // Editorial Backlog - FALLBACK TO CONTENT PRODUCTION
    case "editorial_backlog_management":
    case "backlog_management":
    case "backlog_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    
    // Editing Cycle Times - FALLBACK TO CONTENT PRODUCTION
    case "editing_cycle_times":
    case "editorial_workflow":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    
    // Segment Popularity - FALLBACK TO SECTION PERFORMANCE
    case "segment_popularity":
    case "content_segment_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    
    // Version Control - FALLBACK TO RIGHTS MANAGEMENT
    case "version_control":
    case "content_versioning":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/rights-management"), token, roleCode);
    
    // Newsletter & Calendar - FALLBACK TO CONTENT PRODUCTION
    case "newsletter_virality":
    case "newsletter_performance":
    case "editorial_calendar":
    case "calendar_adherence":
    case "deadline_compliance":
    case "editorial_deadlines":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    
    default:
      // Default to content production for unknown intents
      console.log(`Unknown editorial intent: ${intent}, using default endpoint`);
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
  }
}

async function handleSalesQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;
  
  // For endpoints that require date ranges, provide fixed defaults with GET query params
  const getEndpointWithDates = (path) => {
    const startDate = '2025-01-01';
    const endDate = '2025-09-10';
    return `${path}?startDate=${startDate}&endDate=${endDate}`;
  };

  switch (intent) {
    // Revenue Attribution APIs (requires date range)
    case "revenue_attribution":
    case "revenue_attribution_by_channel": 
    case "revenue_performance":
    case "channel_attribution":
    case "attribution_analysis":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/revenue-attribution/in-range"), token, roleCode);
    
    // Client Lifetime Value APIs (requires date range)
    case "client_lifetime_value_analysis":
    case "client_lifetime_value":
    case "customer_lifetime_value":
    case "clv_analysis":
    case "client_retention":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/client-lifetime-value/in-range"), token, roleCode);
    
    // Conversion Funnel APIs (requires date range)
    case "conversion_funnel_analysis":
    case "conversion_rate_metrics":
    case "conversion_rate_by_channel":
    case "sales_conversion_metrics":
    case "conversion_metrics":
    case "funnel_analysis":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/conversion-funnels/in-range"), token, roleCode);
    
    // CTR APIs (requires date range)
    case "ctr_analysis":
    case "click_through_rate_analysis":
    case "ctr_metrics":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/ctr/in-range"), token, roleCode);
    
    // Campaign Performance APIs
    case "campaign_performance":
    case "campaign_performance_overview":
    case "marketing_performance":
    case "campaign_roi":
    case "marketing_campaigns":
    case "campaign_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi"), token, roleCode);
    
    // Supervisor Sales Analytics APIs - Pipeline Velocity
    case "sales_performance_overview":
    case "sales_performance":
    case "sales_performance_this_quarter":
    case "supervisor_sales":
    case "supervisor_sales_analytics":
    case "supervisor_sales_performance":
    case "pipeline_velocity":
    case "pipeline_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity"), token, roleCode);
    
    // Pipeline Velocity KPIs
    case "pipeline_velocity_kpis":
    case "pipeline_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis"), token, roleCode);
    
    // Quota Attainment APIs
    case "quota_attainment":
    case "quota_achievement":
    case "target_achievement":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment"), token, roleCode);
    
    // Quota Attainment KPIs
    case "quota_attainment_kpis":
    case "quota_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment/kpis"), token, roleCode);
    
    // Account Penetration APIs
    case "account_penetration":
    case "account_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration"), token, roleCode);
    
    // Account Penetration KPIs
    case "account_penetration_kpis":
    case "account_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration/kpis"), token, roleCode);
    
    // Corporate Account Health APIs
    case "corporate_account_health":
    case "account_health":
    case "corporate_accounts":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health"), token, roleCode);
    
    // Corporate Account Health KPIs
    case "corporate_account_health_kpis":
    case "account_health_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health/kpis"), token, roleCode);
    
    // Territory Performance APIs
    case "territory_performance":
    case "territory_performance_metrics":
    case "territory_analysis":
    case "territory_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/territory-performance"), token, roleCode);
    
    // Rate Card & Utilization APIs
    case "rate_card_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/rate-card-utilization"), token, roleCode);
    
    // Impression & Reach APIs
    case "impression_shares":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/impression-shares"), token, roleCode);
    
    // Campaign Attribution APIs
    case "campaign_attribution":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-attribution"), token, roleCode);
    
    // Lead Generation & Efficiency APIs
    case "lead_efficiency":
    case "lead_generation":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/lead-efficiency"), token, roleCode);
    
    // Brand Lift APIs
    case "brand_lift":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/brand-lift"), token, roleCode);
    
    // A/B Testing APIs
    case "ab_tests":
    case "ab_testing":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/ab-tests"), token, roleCode);
    
    // Contract Value APIs
    case "contract_value_trends":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/contract-value-trends"), token, roleCode);
    
    default:
      // Default to campaign-roi for unknown sales intents
      console.log(`Unknown sales intent: ${intent}, defaulting to campaign-roi`);
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi"), token, roleCode);
  }
}

async function handleOperationsQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    // Map all production-related queries to job-scheduling (working endpoint)
    case "production_yield_analysis":
    case "production_metrics":
    case "production_yield":
    case "operational_efficiency":
    case "operations_metrics_overview":
    case "production_efficiency_metrics":
    case "operational_efficiency_analysis":
    case "equipment_performance_overview":
    case "operational_productivity_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/job-scheduling"), token, roleCode);
    
    // Map equipment queries to setup-time (working endpoint)
    case "equipment_efficiency":
    case "machine_oee":
    case "equipment_uptime_status":
    case "equipment_setup_time_metrics":
    case "setup_time_optimization_status":
    case "equipment_downtime_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/setup-time"), token, roleCode);
    
    // Map delivery/logistics queries to route-efficiency (working endpoint)
    case "delivery_timeline_performance":
    case "delivery_timelines":
    case "logistics_performance":
    case "route_efficiency_analysis":
    case "logistics_performance_overview":
    case "fuel_consumption_trend":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/route-efficiency"), token, roleCode);
    
    // Map resource/parts queries to parts-utilization (working endpoint)
    case "resource_utilization":
    case "parts_utilization":
    case "parts_utilization_rate":
    case "parts_utilization_metrics":
    case "resource_utilization_rate":
    case "resource_utilization_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/parts-utilization"), token, roleCode);
    
    // Map ticket/support queries to ticket-resolution (working endpoint)
    case "ticket_resolution":
    case "ticket_resolution_performance":
    case "ticket_resolution_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution"), token, roleCode);
    
    // Direct working endpoint mappings
    case "setup_time":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/setup-time"), token, roleCode);
    case "job_scheduling":
    case "job_scheduling_efficiency":
    case "job_scheduling_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/job-scheduling"), token, roleCode);
    case "route_efficiency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/route-efficiency"), token, roleCode);
    
    // Remove non-working endpoints and map to working ones
    case "fuel_consumption":
    case "signal_quality_metrics":
    case "up_downtime_logs":
    case "operational_efficiency_trends":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution"), token, roleCode);
    
    default:
      // Default to ticket-resolution for unknown operations queries
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution"), token, roleCode);
  }
}

async function handleITQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    // Server Performance & Load
    case "server_health":
    case "server_performance":
    case "server_infrastructure_performance":
    case "system_performance":
    case "system_metrics_overview":
    case "server_load":
    case "server_health_metrics":
    case "system_performance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
    
    // Server Load KPIs
    case "server_load_kpis":
    case "server_performance_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load/kpis"), token, roleCode);
    
    // Storage Utilization
    case "storage_utilization":
    case "storage_utilization_report":
    case "storage_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/storage"), token, roleCode);
    
    // Storage KPIs
    case "storage_kpis":
    case "storage_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/storage/kpis"), token, roleCode);
    
    // Patch Compliance
    case "patch_compliance":
    case "patch_compliance_status":
    case "patch_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/patch-compliance"), token, roleCode);
    
    // Patch Compliance KPIs
    case "patch_compliance_kpis":
    case "patch_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/patch-compliance/kpis"), token, roleCode);
    
    // SLA Metrics
    case "sla_metrics":
    case "service_level_agreement":
    case "sla_overview":
    case "ticket_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/overview"), token, roleCode);
    
    // SLA by Priority
    case "sla_by_priority":
    case "priority_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/by-priority"), token, roleCode);
    
    // SLA by Agent
    case "sla_by_agent":
    case "agent_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/by-agent"), token, roleCode);
    
    // User Satisfaction
    case "user_satisfaction":
    case "user_satisfaction_metrics":
    case "it_satisfaction":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/satisfaction"), token, roleCode);
    
    // Assets Inventory
    case "asset_inventory":
    case "assets_inventory":
    case "it_assets":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/assets-inventory"), token, roleCode);
    
    // Cybersecurity
    case "cyber_security_posture":
    case "cyber_posture":
    case "cyber_security":
    case "cybersecurity_posture_overview":
    case "cyber_sec_router":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/cycber-sec-router"), token, roleCode);
    
    // Infrastructure Costs
    case "infrastructure_costs":
    case "infrastructure_cost_analysis":
    case "infra_costs":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/infrastructure-costs"), token, roleCode);
    
    // System Health Score (with date range handling)
    case "sys_health_score":
    case "system_health_score": {
      const healthParams = new URLSearchParams(filters);
      if (!healthParams.has('start-date')) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        healthParams.set('start-date', thirtyDaysAgo.toISOString().split('T')[0]);
      }
      if (!healthParams.has('end-date')) {
        const today = new Date();
        healthParams.set('end-date', today.toISOString().split('T')[0]);
      }
      return await makeAPIRequestGET(`/api/v1/it/sys-health-score/in-range?${healthParams.toString()}`, token, roleCode);
    }
    
    // Legacy endpoints (fallback to newer ones)
    case "system_health":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
    case "infrastructure":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/infrastructure-costs"), token, roleCode);
    case "cpu_usage":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/cpu-usage"), token, roleCode);
    case "server_storage_patch":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
    
    default:
      // Default to server load for unknown IT intents
      console.log(`Unknown IT intent: ${intent}, defaulting to server-load`);
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
  }
}

async function handleAdministrativeQueries(intent, filters, token, roleCode) {
  // Add default date range if not provided for date-range endpoints
  const defaultFilters = {
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    ...filters
  };
  
  // Convert filters to query parameters for GET requests  
  const queryParams = new URLSearchParams(defaultFilters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    // Task completion and management
    case "task_completion_rate":
    case "task_completion_rates": 
    case "task_completion_performance":
    case "task_management_efficiency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/task-comp-rates/in-range"), token, roleCode);
    
    // Process throughput and efficiency
    case "process_throughput":
    case "process_throughput_analytics":
    case "process_efficiency_status":
    case "administrative_productivity":
    case "administrative_productivity_overview":
    case "process_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/process-throughput/in-range"), token, roleCode);
    
    // Meeting and schedule analytics  
    case "meeting_analytics":
    case "meeting_effectiveness_rate":
    case "meeting_schedule_efficiency":
    case "meeting_efficiency_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/meetingAnalytics"), token, roleCode);
    
    case "schedule_efficiency":
    case "schedule_optimization_insights":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/scheduleEfficiency"), token, roleCode);
    
    // Visitor management
    case "visitor_patterns_analysis":
    case "visitor_patterns":
    case "visitor_patterns_trending":
    case "visitor_management_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/visitor-patterns"), token, roleCode);
    
    case "wait_time":
    case "average_wait_time":
    case "average_wait_time_analysis":
    case "visitor_wait_times":
    case "visitor_wait_time_trends":
    case "wait_time_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/wait-time"), token, roleCode);
    
    // General administrative analytics
    case "administrative_metrics_overview":
    case "administrative_analytics_overview":
    case "administrative_efficiency_metrics":
    case "administrative_performance_overview":
    case "rvs_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics"), token, roleCode);
    
    default:
      throw new Error(`Unknown administrative intent: ${intent}`);
  }
}

async function handleExecutiveQueries(intent, filters, token, roleCode) {
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    case "company_wide_kpis":
    case "company_performance_overview":
    case "company_performance":
    case "company_wide_performance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/company-wide-kpis"), token, roleCode);
    case "strategic_initiatives_progress":
    case "strategic_initiatives":
    case "strategic_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/strategic-init-tracking"), token, roleCode);
    case "market_share_analysis":
    case "market_share":
    case "market_position_competitive_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/market-share"), token, roleCode);
    case "executive_dashboard_overview":
    case "executive_dashboard":
    case "ceo_analytics":
    case "governance_compliance":
    case "governance_compliance_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/governance-compliance"), token, roleCode);
    case "legal_exposure":
    case "legal_exposure_risks":
    case "legal_risk_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/legal-exposure"), token, roleCode);
    case "board_reporting":
    case "board_reporting_metrics":
    case "board_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/board-reporting-metrics"), token, roleCode);
    case "workforce_analytics":
    case "workforce_overview":
    case "employee_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/workforce-analytics"), token, roleCode);
    case "retention_rates":
    case "employee_retention":
    case "retention_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/retention-rates"), token, roleCode);
    case "compensation_benchmarks":
    case "compensation_analysis":
    case "salary_benchmarks":
    case "compensation_comparison":
    case "pay_equity_analysis":
    case "compensation_gap_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/compensation-benchmarks"), token, roleCode);
    case "revenue_performance":
    case "revenue_performance_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/revenue-performance"), token, roleCode);
    case "financial_health":
    case "financial_health_trending":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/financial-health"), token, roleCode);
    case "liquidity_ratios":
    case "liquidity_ratios_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/liquidity-ratios"), token, roleCode);
    case "cost_optimization":
    case "cost_optimization_opportunities":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/cost-optimization"), token, roleCode);
    case "roi_analysis":
    case "roi_strategic_initiatives":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/roi-analysis"), token, roleCode);
    case "risk_heatmap":
    case "risk_management":
    case "risk_heat_map_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/risk-heatmap"), token, roleCode);
    case "control_effectiveness":
    case "controls_effectiveness_assessment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/control-effectiveness"), token, roleCode);
    case "compliance_tasks":
    case "compliance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/tasks"), token, roleCode);
    case "compliance_policies":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/policies"), token, roleCode);
    case "compliance_audits":
    case "compliance_audit_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/audits"), token, roleCode);
    // Additional mappings for better coverage
    case "legal_exposure_risk_assessment":
    case "legal_risk_assessment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/legal-exposure"), token, roleCode);
    case "workforce_analytics_overview":
    case "employee_analytics_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/workforce-analytics"), token, roleCode);
    case "employee_retention_rate":
    case "retention_analysis_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/retention-rates"), token, roleCode);
    case "board_metrics_overview":
    case "board_reporting_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/board-reporting-metrics"), token, roleCode);
    case "ceo_analytics_dashboard":
    case "executive_kpi_summary":
    case "ceo_dashboard_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/governance-compliance"), token, roleCode);
    default:
      throw new Error(`Unknown executive intent: ${intent}`);
  }
}

async function handleSpecializedQueries(intent, filters, token, roleCode) {
  switch (intent) {
    case "risk_exposure":
      return await makeAPIRequest("/api/v1/specialized/risk-exposure", filters, token, roleCode);
    case "mitigation_effectiveness":
      return await makeAPIRequest("/api/v1/specialized/mitigation-effectiveness", filters, token, roleCode);
    case "case_compliance":
      return await makeAPIRequest("/api/v1/specialized/CaseCompliance", filters, token, roleCode);
    case "attendance_rate":
      return await makeAPIRequest("/api/v1/specialized/attendance-rate", filters, token, roleCode);
    case "sponsor_roi":
      return await makeAPIRequest("/api/v1/specialized/sponsor-roi", filters, token, roleCode);
    case "recruitment_funnel":
      return await makeAPIRequest("/api/v1/hr/recruitment-funnel", filters, token, roleCode);
    case "retention_risk":
      return await makeAPIRequest("/api/v1/hr/retention-risk", filters, token, roleCode);
    case "feedback":
      return await makeAPIRequest("/api/v1/specialized/feedback", filters, token, roleCode);
    case "training_effectiveness":
      return await makeAPIRequest("/api/v1/hr/training-effectiveness", filters, token, roleCode);
    case "firebase_roles":
      return await makeAPIRequest("/api/v1/roles", filters, token, roleCode);
    case "firebase_users":
      return await makeAPIRequest("/api/v1/users", filters, token, roleCode);
    default:
      throw new Error(`Unknown specialized intent: ${intent}`);
  }
}

// Legacy intent handler for backward compatibility
async function handleLegacyIntents(intent, filters, token, roleCode) {
  switch (intent) {
    case "vendor_early_deliveries":
      return await makeAPIRequestGET("/api/v1/administrative/rvsAnalytics", token, roleCode);
    case "space_optimization":
      return await makeAPIRequestGET("/api/v1/administrative/rvsAnalytics", token, roleCode);
    case "server_load":
    case "server_load_kpis":
      return await makeAPIRequestGET("/api/v1/server-load", token, roleCode);
    case "storage_kpis":
      return await makeAPIRequestGET("/api/v1/storageUtilization", token, roleCode);
    case "patch_compliance_kpis":
      return await makeAPIRequestGET("/api/v1/patch-compliance", token, roleCode);
    default:
      throw new Error(`Unknown legacy intent: ${intent}`);
  }
}

// --- Main AI Service Function ---
export async function askAI(question, roleCode = null, token = null) {
  const aiResult = await callDeepSeekAI(question);

  // Validate AI response confidence
  if (aiResult.confidence && aiResult.confidence < 0.6) {
    throw new Error(`I'm not confident I understood your question correctly. Please rephrase it or be more specific. (Confidence: ${Math.round(aiResult.confidence * 100)}%)`);
  }

  let data = null;
  let additionalInsights = null;

  // Enhanced intent matching with department-based routing
  const { intent, department, filters = {} } = aiResult;

  try {
    switch (department) {
      case "administrative":
        data = await handleAdministrativeQueries(intent, filters, token, roleCode);
        break;
      case "operations":
        data = await handleOperationsQueries(intent, filters, token, roleCode);
        break;
      case "sales":
        data = await handleSalesQueries(intent, filters, token, roleCode);
        break;
      case "finance":
        data = await handleFinanceQueries(intent, filters, token, roleCode);
        break;
      case "it":
        data = await handleITQueries(intent, filters, token, roleCode);
        break;
      case "editorial":
        data = await handleEditorialQueries(intent, filters, token, roleCode);
        break;
      case "executive":
        data = await handleExecutiveQueries(intent, filters, token, roleCode);
        break;
      case "specialized":
        data = await handleSpecializedQueries(intent, filters, token, roleCode);
        break;
      case "legacy":
        data = await handleLegacyIntents(intent, filters, token, roleCode);
        break;
      default:
        // Try legacy handler as fallback for unknown departments
        try {
          data = await handleLegacyIntents(intent, filters, token, roleCode);
        } catch {
          throw new Error(`Unknown department: ${department}`);
        }
    }

    // Generate additional insights
    additionalInsights = generateDataInsights(data);

  } catch (error) {
    console.error(`Error fetching ${department} analytics for "${intent}":`, error.message);
    throw new Error(`Failed to fetch ${department} analytics for "${intent}": ${error.message}`);
  }

  return {
    intent: aiResult.intent,
    department: aiResult.department,
    confidence: aiResult.confidence,
    data: data,
    hasData: !!(data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)),
    insights: additionalInsights,
    filters: filters,
    question: question
  };
}

// Generate additional insights from data
function generateDataInsights(data) {
  const insights = [];
  
  if (!data || data.length === 0) {
    return ["No data available for the requested query."];
  }

  // Basic statistical insights
  if (typeof data[0] === 'object') {
    const numericFields = Object.keys(data[0]).filter(key => 
      typeof data[0][key] === 'number'
    );
    
    numericFields.forEach(field => {
      const values = data.map(item => item[field]).filter(v => v != null);
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        insights.push(`${field}: Average ${avg.toFixed(2)}, Range ${min}-${max}`);
      }
    });
  }
  
  insights.push(`Total records: ${data.length}`);
  return insights.slice(0, 5); // Limit to 5 insights
}
