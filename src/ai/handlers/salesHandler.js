import { makeAPIRequestGET, getEndpoint, getEndpointWithDates } from './baseHandler.js';

export async function handleSalesQueries(intent, filters, token, roleCode) {
  // Clean and validate filters to prevent 400 errors
  const cleanFilters = {};
  
  if (filters && typeof filters === 'object') {
    Object.keys(filters).forEach(key => {
      let value = filters[key];
      
      // Fix common parameter issues
      if (key === 'time_period') {
        // Fix common typos and normalize values
        if (value === 'thhis_quarter' || value === 'this_quarter') {
          value = 'current_quarter';
        } else if (value === 'this_month') {
          value = 'current_month';
        } else if (value === 'this_year') {
          value = 'current_year';
        }
      }
      
      // Only include valid, non-empty values
      if (value !== null && value !== undefined && value !== '') {
        cleanFilters[key] = value;
      }
    });
  }
  
  console.log('🔧 Sales Query Debug:', {
    originalFilters: filters,
    cleanedFilters: cleanFilters,
    queryParams: new URLSearchParams(cleanFilters).toString()
  });

  switch (intent) {
    // Revenue Attribution APIs (requires date range)
    case "revenue_attribution":
    case "revenue_attribution_by_channel": 
    case "revenue_attribution_analysis":
    case "revenue_performance":
    case "channel_attribution":
    case "attribution_analysis":
    case "revenue_by_channel":
    case "revenue_breakdown_by_marketing_channel":
    case "revenue_breakdown_by_channel":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/revenue-attribution/in-range"), token, roleCode);
    
    // Client Lifetime Value APIs (requires date range)
    case "client_lifetime_value_analysis":
    case "client_lifetime_value":
    case "customer_lifetime_value":
    case "customer_lifetime_value_analysis":
    case "customer_lifetime_value_metrics":
    case "clv_analysis":
    case "client_retention":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/client-lifetime-value/in-range"), token, roleCode);
    
    // Conversion Funnel APIs (requires date range)
    case "conversion_funnel_analysis":
    case "conversion_funnel_performance":
    case "conversion_rate_metrics":
    case "conversion_rate_by_channel":
    case "conversion_rates_by_channel":
    case "sales_conversion_metrics":
    case "conversion_metrics":
    case "funnel_analysis":
    case "lead_conversion_rate":
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
    case "campaign_roi_summary":
    case "marketing_campaigns":
    case "campaign_analytics":
    case "advertising_campaign_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi", cleanFilters), token, roleCode);
    
    // Supervisor Sales Analytics APIs - Pipeline Velocity
    case "sales_performance_overview":
    case "sales_performance":
    case "sales_performance_this_quarter":
    case "sales_performance_summary":
    case "supervisor_sales":
    case "supervisor_sales_analytics":
    case "supervisor_sales_performance":
    case "pipeline_velocity":
    case "pipeline_analysis":
    case "sales_pipeline_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity", cleanFilters), token, roleCode);
    
    // Pipeline Velocity KPIs
    case "pipeline_velocity_kpis":
    case "pipeline_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis", cleanFilters), token, roleCode);
    
    // Quota Attainment APIs
    case "quota_attainment":
    case "quota_achievement":
    case "quota_achievement_count":
    case "quota_attainment_by_rep":
    case "target_achievement":
    case "sales_performance_vs_targets":
    case "sales_target_performance":
    case "sales_performance_against_targets":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment", cleanFilters), token, roleCode);
    
    // Quota Attainment KPIs
    case "quota_attainment_kpis":
    case "quota_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/quota-attainment/kpis", cleanFilters), token, roleCode);
    
    // Account Penetration APIs
    case "account_penetration":
    case "account_penetration_metrics":
    case "account_analysis":
    case "key_account_penetration_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration", cleanFilters), token, roleCode);
    
    // Account Penetration KPIs
    case "account_penetration_kpis":
    case "account_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/account-penetration/kpis", cleanFilters), token, roleCode);
    
    // Corporate Account Health APIs
    case "corporate_account_health":
    case "account_health":
    case "corporate_accounts":
    case "enterprise_client_health_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health", cleanFilters), token, roleCode);
    
    // Corporate Account Health KPIs
    case "corporate_account_health_kpis":
    case "account_health_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/corporate-account-health/kpis", cleanFilters), token, roleCode);
    
    // Territory Performance APIs
    case "territory_performance":
    case "territory_performance_metrics":
    case "territory_performance_analysis":
    case "territory_analysis":
    case "territory_metrics":
    case "sales_by_region":
    case "territory_sales_breakdown":
    case "regional_performance":
    case "regional_sales":
      return await makeAPIRequestGET(getEndpointWithDates("/api/v1/sales/territory-performance/in-range"), token, roleCode);
    
    // Rate Card & Utilization APIs
    case "rate_card_utilization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/rate-card-utilization", cleanFilters), token, roleCode);
    
    // Impression & Reach APIs
    case "impression_shares":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/impression-shares", cleanFilters), token, roleCode);
    
    // Campaign Attribution APIs
    case "campaign_attribution":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-attribution", cleanFilters), token, roleCode);
    
    // Lead Generation & Efficiency APIs
    case "lead_efficiency":
    case "lead_generation":
    case "lead_generation_efficiency":
    case "lead_generation_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/lead-efficiency", cleanFilters), token, roleCode);
    
    // Brand Lift APIs
    case "brand_lift":
    case "brand_lift_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/brand-lift", cleanFilters), token, roleCode);
    
    // A/B Testing APIs
    case "ab_tests":
    case "ab_testing":
    case "ab_test_results":
    case "ab_test_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/ab-tests", cleanFilters), token, roleCode);
    
    // Contract Value APIs
    case "contract_value_trends":
    case "contract_value":
    case "contract_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/contract-value-trends", cleanFilters), token, roleCode);
    
    default:
      // Default to campaign-roi for unknown sales intents
      console.log(`Unknown sales intent: ${intent}, defaulting to campaign-roi`);
      if (intent === 'sales_general_query') {
        // For general sales queries, return pipeline velocity data
        return await makeAPIRequestGET(getEndpoint("/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity", cleanFilters), token, roleCode);
      }
      return await makeAPIRequestGET(getEndpoint("/api/v1/sales/campaign-roi", cleanFilters), token, roleCode);
  }
}