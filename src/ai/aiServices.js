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
      case "financial_close_metrics":
      case "close_metrics":
      case "financial_health_overview":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/close-metrics"), token, roleCode);
      case "audit_trail_analysis":
      case "audit_trail":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/audit-trail"), token, roleCode);
      case "reporting_accuracy":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/reporting-accuracy"), token, roleCode);
      case "profit_loss_by_region":
      case "regional_pnl":
      case "regional_analysis":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/regional-pnl"), token, roleCode);
      case "raw_data":
      case "financial_data":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/raw-data"), token, roleCode);
      case "chart_data":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/chart-data"), token, roleCode);
      case "gl_accounts":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/gl-accounts"), token, roleCode);
      case "document_types":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/document-types"), token, roleCode);
      case "regions":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/regions"), token, roleCode);
      case "diagnostics":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/diagnostics"), token, roleCode);
      case "cash_flow_analysis":
      case "financial_performance_quarterly":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance/close-metrics"), token, roleCode);
      case "pipeline_metrics":
        return await makeAPIRequest("/api/v1/finance/pipeline-metrics", filters, token, roleCode);
      // Legacy endpoints for existing functionality
      case "ap_ar_aging":
        return await makeAPIRequest("/api/v1/ap-ar-aging", filters, token, roleCode);
      case "total_assets_value":
        return await makeAPIRequest("/api/v1/total-assets-value", filters, token, roleCode);
      case "asset_depreciation":
        return await makeAPIRequest("/api/v1/asset-depreciation", filters, token, roleCode);
      case "expense_category":
        return await makeAPIRequest("/api/v1/expense-category", filters, token, roleCode);
      case "budget_variance":
      case "budget_variance_analysis":
        return await makeAPIRequest("/api/v1/budget-variance", filters, token, roleCode);
      case "finance_forecasting":
        return await makeAPIRequest("/api/v1/finance-forecasting", filters, token, roleCode);
      case "gl_reconciliation":
        return await makeAPIRequest("/api/v1/gl-reconciliation", filters, token, roleCode);
      case "tax_provisioning":
        return await makeAPIRequest("/api/v1/tax-provisioning", filters, token, roleCode);
      case "statement_variance":
        return await makeAPIRequest("/api/v1/fin-statement-variance", filters, token, roleCode);
      case "capex":
        return await makeAPIRequest("/api/v1/capEx", filters, token, roleCode);
      case "dso":
        return await makeAPIRequest("/api/v1/dso", filters, token, roleCode);
      case "bad_debt_ratios":
        return await makeAPIRequest("/api/v1/bad-debt-ratios", filters, token, roleCode);
      case "collection_efficiency":
        return await makeAPIRequest("/api/v1/collection-efficiency", filters, token, roleCode);
      case "integration_health":
        return await makeAPIRequest("/api/v1/integration-health", filters, token, roleCode);
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
    case "section_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/section-perfromance"), token, roleCode);
    case "content_publication_rates":
    case "publication_performance_overview":
    case "content_production":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    case "content_engagement":
    case "readership_trends":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/readership-trends/annual?year=2025"), token, roleCode);
    case "editorial_productivity":
    case "editorial_performance_overview":
    case "journalist_productivity":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/journalist-productivity"), token, roleCode);
    case "breaking_news_traction":
    case "breaking_news":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/breaking-news/traction"), token, roleCode);
    case "breaking_news_alternate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/breaking-news"), token, roleCode);
    case "content_publication_count":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/content-production"), token, roleCode);
    case "error_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/error-rate/annual?year=2025"), token, roleCode);
    case "editing_cycle_times":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/editing-cycle-times/annual?year=2025"), token, roleCode);
    case "editorial_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial"), token, roleCode);
    case "segment_popularity":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/segment-popularity"), token, roleCode);
    case "segment_summary":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/segment-summary"), token, roleCode);
    case "social_sentiment":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/social-sentiment/annual?year=2025"), token, roleCode);
    case "version_control":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/version-control/annual?year=2025"), token, roleCode);
    case "topic_virality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/topic-virality"), token, roleCode);
    case "newsletter_virality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/newsletter-virality"), token, roleCode);
    case "backlog_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/backlog-mgt/annual?year=2025"), token, roleCode);
    case "content_freshness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/contentFreshness"), token, roleCode);
    case "update_frequency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/updateFrequency"), token, roleCode);
    case "backlog_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/backlogAnalytics?startDate=2025-01-01&endDate=2025-12-31"), token, roleCode);
    case "visual_engagement":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-engagement?startDate=2025-01-01&endDate=2025-12-31"), token, roleCode);
    case "usage_tracking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/visual-usage"), token, roleCode);
    case "competitor_benchmarking":
      return await makeAPIRequestGET(getEndpoint("/api/v1/editorial/comp-bench/annual?year=2025"), token, roleCode);
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
    case "sales_performance_overview":
    case "sales_trends":
    case "sales_analytics":
    case "supervisor_sales":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity"), token, roleCode);
    case "conversion_funnel_analysis":
    case "conversion_rate_metrics":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/conversion-funnels/in-range"), token, roleCode);
    case "campaign_performance":
    case "marketing_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi"), token, roleCode);
    case "client_lifetime_value_analysis":
    case "client_retention":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/client-lifetime-value/in-range"), token, roleCode);
    case "revenue_performance":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/revenue-attribution/in-range"), token, roleCode);
    case "lead_generation":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/lead-efficiency"), token, roleCode);
    // Additional sales APIs from backup
    case "territory_performance":
      return await makeAPIRequest("/api/v1/sales/territory-performance", filters, token, roleCode);
    case "sales_rep_metrics":
      return await makeAPIRequest("/api/v1/sales/sales-rep-metrics", filters, token, roleCode);
    case "quota_attainment":
      return await makeAPIRequest("/api/v1/sales/quota-attainment", filters, token, roleCode);
    case "pipeline_health":
      return await makeAPIRequest("/api/v1/sales/pipeline-health", filters, token, roleCode);
    case "deal_velocity":
      return await makeAPIRequest("/api/v1/sales/deal-velocity", filters, token, roleCode);
    case "win_loss_analysis":
      return await makeAPIRequest("/api/v1/sales/win-loss-analysis", filters, token, roleCode);
    case "forecast_accuracy":
      return await makeAPIRequest("/api/v1/sales/forecast-accuracy", filters, token, roleCode);
    case "churn_prediction":
      return await makeAPIRequest("/api/v1/sales/churn-prediction", filters, token, roleCode);
    case "market_penetration":
      return await makeAPIRequest("/api/v1/sales/market-penetration", filters, token, roleCode);
    case "cross_sell_upsell":
      return await makeAPIRequest("/api/v1/sales/cross-sell-upsell", filters, token, roleCode);
    case "customer_acquisition_cost":
      return await makeAPIRequest("/api/v1/sales/customer-acquisition-cost", filters, token, roleCode);
    case "sales_cycle_analysis":
      return await makeAPIRequest("/api/v1/sales/sales-cycle-analysis", filters, token, roleCode);
    case "competitive_analysis":
      return await makeAPIRequest("/api/v1/sales/competitive-analysis", filters, token, roleCode);
    case "product_performance":
      return await makeAPIRequest("/api/v1/sales/product-performance", filters, token, roleCode);
    case "channel_effectiveness":
      return await makeAPIRequest("/api/v1/sales/channel-effectiveness", filters, token, roleCode);
    case "sales_enablement":
      return await makeAPIRequest("/api/v1/sales/sales-enablement", filters, token, roleCode);
    case "lead_scoring":
      return await makeAPIRequest("/api/v1/sales/lead-scoring", filters, token, roleCode);
    case "opportunity_analysis":
      return await makeAPIRequest("/api/v1/sales/opportunity-analysis", filters, token, roleCode);
    case "ab_tests":
      return await makeAPIRequest("/api/v1/sales/ab-tests", filters, token, roleCode);
    case "campaign_attribution":
      return await makeAPIRequest("/api/v1/sales/campaign-attribution", filters, token, roleCode);
    case "brand_lift":
      return await makeAPIRequest("/api/v1/sales/brand-lift", filters, token, roleCode);
    case "contract_value_trends":
      return await makeAPIRequest("/api/v1/sales/contract-value-trends", filters, token, roleCode);
    default:
      throw new Error(`Unknown sales intent: ${intent}`);
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/production-yield"), token, roleCode);
    case "equipment_efficiency":
    case "operational_efficiency":
    case "operations_metrics_overview":
    case "machine_oee":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/machine-oee"), token, roleCode);
    case "delivery_timeline_performance":
    case "logistics_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/delivery-timelines"), token, roleCode);
    case "resource_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/parts-utilization"), token, roleCode);
    case "operational_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/machine-oee"), token, roleCode);
    case "material_waste":
      return await makeAPIRequest("/api/v1/operations/OperationsProductionAnalytics/material-waste", filters, token, roleCode);
    default:
      throw new Error(`Unknown operations intent: ${intent}`);
  }
}

async function handleITQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    case "server_health":
    case "system_performance":
    case "system_metrics_overview":
    case "server_performance":
    case "server_load":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
    case "storage_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/storage"), token, roleCode);
    case "cyber_security_posture":
    case "cyber_posture":
    case "cyber_security":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/cycber-sec-router/in-range"), token, roleCode);
    case "network_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load"), token, roleCode);
    case "infrastructure_cost_analysis":
    case "infrastructure_costs":
    case "infra_costs":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/infrastructure-costs"), token, roleCode);
    case "patch_compliance":
      return await makeAPIRequest("/api/v1/patch-compliance", filters, token, roleCode);
    case "system_health":
      return await makeAPIRequest("/api/v1/system-health", filters, token, roleCode);
    case "infrastructure":
      return await makeAPIRequest("/api/v1/infrastructure", filters, token, roleCode);
    case "ticket_sla":
      return await makeAPIRequest("/api/v1/IT/sla", filters, token, roleCode);
    case "sys_health_score":
      return await makeAPIRequest("/api/v1/it/sys-health-score", filters, token, roleCode);
    case "cpu_usage":
      return await makeAPIRequest("/api/v1/it/cpu-usage", filters, token, roleCode);
    case "user_satisfaction":
      return await makeAPIRequest("/api/v1/it/satisfaction", filters, token, roleCode);
    case "asset_inventory":
      return await makeAPIRequest("/api/v1/it/assets-inventory", filters, token, roleCode);
    case "server_storage_patch":
      return await makeAPIRequest("/api/v1/it/ServerStoragePatch", filters, token, roleCode);
    default:
      throw new Error(`Unknown IT intent: ${intent}`);
  }
}

async function handleAdministrativeQueries(intent, filters, token, roleCode) {
  // Convert filters to query parameters for GET requests  
  const queryParams = new URLSearchParams(filters).toString();
  const getEndpoint = (path) => `${path}${queryParams ? '?' + queryParams : ''}`;

  switch (intent) {
    case "task_completion_rates":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/task-comp-rates/in-range"), token, roleCode);
    case "meeting_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/meetingAnalytics"), token, roleCode);
    case "visitor_patterns_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/visitor-patterns"), token, roleCode);
    case "administrative_metrics_overview":
    case "administrative_analytics_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/overview"), token, roleCode);
    case "process_throughput":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/process-throughput/in-range"), token, roleCode);
    default:
      throw new Error(`Unknown administrative intent: ${intent}`);
  }
}

async function handleExecutiveQueries(intent, filters, token, roleCode) {
  switch (intent) {
    case "company_wide_kpis": {
      const query = new URLSearchParams(filters).toString();
      return await makeAPIRequestGET(`/api/v1/executive/company-wide-kpis/in-range${query ? `?${query}` : ''}`, token, roleCode);
    }
    case "strategic_initiatives_progress":
    case "strategic_initiatives":
    case "strategic_performance": {
      const query = new URLSearchParams(filters).toString();
      return await makeAPIRequestGET(`/api/v1/executive/strategic-init-tracking/in-range${query ? `?${query}` : ''}`, token, roleCode);
    }
    case "market_share_analysis":
    case "market_share": {
      const query = new URLSearchParams(filters).toString();
      return await makeAPIRequestGET(`/api/v1/executive/market-share/in-range${query ? `?${query}` : ''}`, token, roleCode);
    }
    case "company_performance_overview":
    case "company_performance":
    case "executive_dashboard": {
      const query = new URLSearchParams(filters).toString();
      return await makeAPIRequestGET(`/api/v1/executive/company-wide-kpis/in-range${query ? `?${query}` : ''}`, token, roleCode);
    }
    case "executive_dashboard_overview":
    case "ceo_analytics": {
      const query = new URLSearchParams(filters).toString();
      return await makeAPIRequestGET(`/api/v1/executive/CEOAnalytics/governance-compliance${query ? `?${query}` : ''}`, token, roleCode);
    }
    case "financial_performance_quarterly":
    case "financial_health":
      return await makeAPIRequestGET("/api/v1/finance/close-metrics", token, roleCode);
    // Additional executive APIs from backup
    case "revenue_performance":
      return await makeAPIRequest("/api/v1/executive/revenue-performance", filters, token, roleCode);
    case "liquidity_ratios":
      return await makeAPIRequest("/api/v1/executive/liquidity-ratios", filters, token, roleCode);
    case "cost_optimization":
      return await makeAPIRequest("/api/v1/executive/cost-optimization", filters, token, roleCode);
    case "roi_analysis":
      return await makeAPIRequest("/api/v1/executive/roi-analysis", filters, token, roleCode);
    case "risk_heatmap":
    case "risk_management":
      return await makeAPIRequest("/api/v1/executives/risk-heatmap", filters, token, roleCode);
    case "control_effectiveness":
      return await makeAPIRequest("/api/v1/executives/control-effectiveness", filters, token, roleCode);
    case "compliance_tasks":
    case "compliance_overview":
      return await makeAPIRequest("/api/v1/executives/compliance/tasks", filters, token, roleCode);
    case "compliance_policies":
      return await makeAPIRequest("/api/v1/executives/compliance/policies", filters, token, roleCode);
    case "compliance_audits":
      return await makeAPIRequest("/api/v1/executives/compliance/audits", filters, token, roleCode);
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
      return await makeAPIRequest("/api/v1/administrative/rvsAnalytics/vendors", { ...filters, delay_days: 0 }, token, roleCode);
    case "space_optimization":
      return await makeAPIRequest("/api/v1/administrative/rvsAnalytics/spaces", filters, token, roleCode);
    case "server_load":
    case "server_load_kpis":
      return await makeAPIRequest("/api/v1/server-load", filters, token, roleCode);
    case "storage_kpis":
      return await makeAPIRequest("/api/v1/storageUtilization", filters, token, roleCode);
    case "patch_compliance_kpis":
      return await makeAPIRequest("/api/v1/patch-compliance", filters, token, roleCode);
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
