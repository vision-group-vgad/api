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
              - finance: budget, revenue, expenses, accounting, financial reports, P&L, cash flow, audit
              - editorial: content, articles, journalism, publishing, readership, writers, editors
              - sales: campaigns, leads, conversions, revenue attribution, client management, advertising
              - operations: production, manufacturing, logistics, efficiency, equipment, delivery
              - it: servers, networks, security, infrastructure, systems, technology
              - administrative: meetings, schedules, resources, facilities, office management
              - executive: company-wide metrics, strategic initiatives, leadership dashboards
              - specialized: HR, legal, compliance, risk management, events
              
              Examples:
              Question: "What are our financial metrics?"
              Response: {"intent": "financial_health_overview", "department": "finance", "filters": {}, "confidence": 0.95}
              
              Question: "Show me server performance"  
              Response: {"intent": "server_health", "department": "it", "filters": {}, "confidence": 0.90}`
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
      case "financial_health_overview":
      case "financial_performance":
      case "cash_flow_analysis":
      case "financial_close_metrics":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance"), token, roleCode);
      case "budget_variance":
      case "budget_variance_analysis":
        return await makeAPIRequestGET(getEndpoint("/api/v1/budget-variance"), token, roleCode);
      case "revenue_growth":
      case "revenue_performance":
        return await makeAPIRequestGET(getEndpoint("/api/v1/executive/revenue-performance"), token, roleCode);
      case "ap_ar_aging":
        return await makeAPIRequestGET(getEndpoint("/api/v1/ap-ar-aging"), token, roleCode);
      case "total_assets_value":
        return await makeAPIRequestGET(getEndpoint("/api/v1/total-assets-value"), token, roleCode);
      case "asset_depreciation":
        return await makeAPIRequestGET(getEndpoint("/api/v1/asset-depreciation"), token, roleCode);
      case "expense_category":
        return await makeAPIRequestGET(getEndpoint("/api/v1/expense-category"), token, roleCode);
      case "finance_forecasting":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance-forecasting"), token, roleCode);
      case "gl_reconciliation":
        return await makeAPIRequestGET(getEndpoint("/api/v1/gl-reconciliation"), token, roleCode);
      case "tax_provisioning":
        return await makeAPIRequestGET(getEndpoint("/api/v1/tax-provisioning"), token, roleCode);
      case "statement_variance":
        return await makeAPIRequestGET(getEndpoint("/api/v1/fin-statement-variance"), token, roleCode);
      case "capex":
        return await makeAPIRequestGET(getEndpoint("/api/v1/capEx"), token, roleCode);
      case "dso":
        return await makeAPIRequestGET(getEndpoint("/api/v1/dso"), token, roleCode);
      case "bad_debt_ratios":
        return await makeAPIRequestGET(getEndpoint("/api/v1/bad-debt-ratios"), token, roleCode);
      case "collection_efficiency":
        return await makeAPIRequestGET(getEndpoint("/api/v1/collection-efficiency"), token, roleCode);
      case "integration_health":
        return await makeAPIRequestGET(getEndpoint("/api/v1/integration-health"), token, roleCode);
      case "pipeline_metrics":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/pipeline-metrics"), token, roleCode);
      case "reporting_accuracy":
        return await makeAPIRequestGET(getEndpoint("/api/v1/reporting-accu-piechart"), token, roleCode);
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

  switch (intent) {
    case "content_performance":
    case "content_performance_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial"), token, roleCode);
    case "section_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    case "content_production":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    case "readership_trends":
    case "readership_engagement_trends":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/readership-trends"), token, roleCode);
    case "journalist_productivity":
    case "journalist_productivity_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity"), token, roleCode);
    case "breaking_news_traction":
    case "breaking_news":
    case "breaking_news_coverage_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/breaking-news"), token, roleCode);
    case "breaking_news_alternate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/breakingNews"), token, roleCode);
    case "error_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/error-rate"), token, roleCode);
    case "editing_cycle_times":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/editing-cycle-times"), token, roleCode);
    case "segment_popularity":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/segment-popularity"), token, roleCode);
    case "segment_summary":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/segment-summary"), token, roleCode);
    case "social_sentiment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/social-sentiment"), token, roleCode);
    case "version_control":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/version-control"), token, roleCode);
    case "topic_virality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality"), token, roleCode);
    case "newsletter_virality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/newsletter-virality"), token, roleCode);
    case "backlog_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/backlog-mgt"), token, roleCode);
    case "content_freshness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/contentFreshness"), token, roleCode);
    case "update_frequency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/updateFrequency"), token, roleCode);
    case "backlog_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/backlogAnalytics"), token, roleCode);
    case "visual_engagement":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-engagement"), token, roleCode);
    case "usage_tracking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-usage"), token, roleCode);
    case "competitor_benchmarking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/comp-bench"), token, roleCode);
    case "editorial_calendar":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/editorial-calendar-adherence"), token, roleCode);
    case "rights_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/rights-management"), token, roleCode);
    case "deadline_compliance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/deadline-compliance"), token, roleCode);
    default:
      throw new Error(`Unknown editorial intent: ${intent}`);
  }
}

async function handleSalesQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;
  
  // For endpoints that require date ranges, provide defaults
  const getEndpointWithDates = (path) => {
    const params = new URLSearchParams(filters);
    if (!params.has('start-date') && !params.has('startDate')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      params.set('start-date', thirtyDaysAgo.toISOString().split('T')[0]);
    }
    if (!params.has('end-date') && !params.has('endDate')) {
      const today = new Date();
      params.set('end-date', today.toISOString().split('T')[0]);
    }
    return `${path}?${params.toString()}`;
  };

  switch (intent) {
    // Revenue Attribution APIs (requires date range)
    case "revenue_attribution":
    case "revenue_attribution_by_channel":
    case "revenue_performance":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/revenue-attribution/in-range"), token, roleCode);
    
    // Client Lifetime Value APIs (requires date range)
    case "client_lifetime_value_analysis":
    case "client_lifetime_value":
    case "client_retention":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/client-lifetime-value/in-range"), token, roleCode);
    
    // Territory Performance APIs (requires date range)
    case "territory_performance":
    case "territory_performance_metrics":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/territory-performance/in-range"), token, roleCode);
    
    // Campaign Performance APIs
    case "campaign_performance":
    case "campaign_performance_overview":
    case "marketing_performance":
    case "campaign_roi":
    case "marketing_campaigns":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi"), token, roleCode);
    
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/ab-tests"), token, roleCode);
    
    // Click-Through Rate APIs (requires date range)
    case "ctr":
    case "click_through_rate":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/ctr/in-range"), token, roleCode);
    
    // Conversion Funnel APIs (requires date range)
    case "conversion_funnel_analysis":
    case "conversion_rate_metrics":
    case "conversion_rate_by_channel":
    case "sales_conversion_metrics":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/conversion-funnels/in-range"), token, roleCode);
    
    // Supervisor Sales Analytics APIs
    case "sales_performance_overview":
    case "sales_performance":
    case "supervisor_sales":
    case "supervisor_sales_analytics":
    case "supervisor_sales_performance":
    case "sales_performance_this_quarter":
    case "pipeline_velocity":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity"), token, roleCode);
    
    case "pipeline_velocity_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis"), token, roleCode);
    
    case "quota_attainment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment"), token, roleCode);
    
    case "quota_attainment_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment/kpis"), token, roleCode);
    
    case "account_penetration":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration"), token, roleCode);
    
    case "account_penetration_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration/kpis"), token, roleCode);
    
    case "corporate_account_health":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health"), token, roleCode);
    
    case "corporate_account_health_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health/kpis"), token, roleCode);
    
    // Territory Performance - map to existing working API
    case "territory_analysis":
    case "territory_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity"), token, roleCode);
    
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
    case "production_yield_analysis":
    case "production_metrics":
    case "production_yield":
    case "operational_efficiency":
    case "operations_metrics_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics"), token, roleCode);
    case "equipment_efficiency":
    case "machine_oee":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics"), token, roleCode);
    case "delivery_timeline_performance":
    case "delivery_timelines":
    case "logistics_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/delivery-timelines"), token, roleCode);
    case "resource_utilization":
    case "parts_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/parts-utilization"), token, roleCode);
    case "ticket_resolution":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution"), token, roleCode);
    case "setup_time":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/setup-time"), token, roleCode);
    case "job_scheduling":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/job-scheduling"), token, roleCode);
    case "route_efficiency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/route-efficiency"), token, roleCode);
    case "fuel_consumption":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/fuel-consumption"), token, roleCode);
    case "signal_quality_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/signal-quality-metrics"), token, roleCode);
    case "up_downtime_logs":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/up-downtime-logs"), token, roleCode);
    default:
      throw new Error(`Unknown operations intent: ${intent}`);
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
  // Convert filters to query parameters for GET requests  
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    case "task_completion_rates":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/task-comp-rates"), token, roleCode);
    case "process_throughput":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/process-throughput"), token, roleCode);
    case "meeting_analytics":
    case "meeting_effectiveness_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/meetingAnalytics"), token, roleCode);
    case "schedule_efficiency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/scheduleEfficiency"), token, roleCode);
    case "visitor_patterns_analysis":
    case "visitor_patterns_and_facility_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/visitor-patterns"), token, roleCode);
    case "administrative_metrics_overview":
    case "administrative_analytics_overview":
    case "administrative_efficiency_metrics":
    case "rvs_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics"), token, roleCode);
    case "wait_time":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/wait-time"), token, roleCode);
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics"), token, roleCode);
    case "revenue_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/revenue-performance"), token, roleCode);
    case "financial_health":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/financial-health"), token, roleCode);
    case "liquidity_ratios":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/liquidity-ratios"), token, roleCode);
    case "cost_optimization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/cost-optimization"), token, roleCode);
    case "roi_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/roi-analysis"), token, roleCode);
    case "risk_heatmap":
    case "risk_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/risk-heatmap"), token, roleCode);
    case "control_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/control-effectiveness"), token, roleCode);
    case "compliance_tasks":
    case "compliance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/tasks"), token, roleCode);
    case "compliance_policies":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/policies"), token, roleCode);
    case "compliance_audits":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/audits"), token, roleCode);
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
