import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleAdministrativeQueries(intent, filters, token, roleCode) {
  // Add default date range if not provided for date-range endpoints
  const defaultFilters = {
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    ...filters
  };

  switch (intent) {
    // Task completion and management
    case "task_completion_rate":
    case "task_completion_rates": 
    case "task_completion_performance":
    case "task_management_efficiency":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/task-comp-rates/in-range", defaultFilters), token, roleCode);

    // Process throughput and efficiency
    case "process_throughput":
    case "process_throughput_analytics":
    case "process_efficiency_status":
    case "administrative_productivity":
    case "administrative_productivity_overview":
    case "process_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/process-throughput/in-range", defaultFilters), token, roleCode);

    // Meeting and schedule analytics  
    case "meeting_analytics":
    case "meeting_effectiveness_rate":
    case "meeting_schedule_efficiency":
    case "meeting_efficiency_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/meetingAnalytics", filters), token, roleCode);

    case "schedule_efficiency":
    case "schedule_optimization_insights":
      return await makeAPIRequestGET(getEndpoint("/api/v1/admnistrative/scheduleEfficiency/summary", filters), token, roleCode);

    // Visitor management
    case "visitor_patterns_analysis":
    case "visitor_patterns":
    case "visitor_patterns_trending":
    case "visitor_management_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/visitor-patterns", filters), token, roleCode);

    case "wait_time":
    case "average_wait_time":
    case "average_wait_time_analysis":
    case "visitor_wait_times":
    case "visitor_wait_time_trends":
    case "wait_time_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/wait-time", filters), token, roleCode);

    // RVS Analytics - Overview
    case "analytics_overview":
    case "rvs_analytics_overview":
    case "rvs_overview":
    case "rvs_dashboard":
    case "overview":
    case "rvs_summary":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/overview", filters), token, roleCode);

    // RVS Analytics - Resources
    case "resource_utilization_analytics":
    case "resource_utilization":
    case "resource_analytics":
    case "resource_utilization_summary":
    case "resource_analytics_overview":
    case "rvs_resource_utilization_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/resources/analytics", filters), token, roleCode);
    case "resource_kpis":
    case "resource_utilization_kpis":
    case "resource_kpi":
    case "rvs_resource_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/resources/kpis", filters), token, roleCode);
    case "resource_chart":
    case "resource_charts":
    case "resource_utilization_chart":
    case "rvs_resource_chart":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/resources/chart", filters), token, roleCode);
    case "resource_list":
    case "resources_list":
    case "resource_utilization_list":
    case "rvs_resource_list":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/resources/list", filters), token, roleCode);

    // RVS Analytics - Spaces
    case "space_optimization_analytics":
    case "space_optimization":
    case "space_analytics":
    case "space_optimization_summary":
    case "space_analytics_overview":
    case "rvs_space_optimization_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/spaces/analytics", filters), token, roleCode);
    case "space_kpis":
    case "space_optimization_kpis":
    case "space_kpi":
    case "rvs_space_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/spaces/kpis", filters), token, roleCode);
    case "space_chart":
    case "space_charts":
    case "space_optimization_chart":
    case "rvs_space_chart":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/spaces/chart", filters), token, roleCode);
    case "space_list":
    case "spaces_list":
    case "space_optimization_list":
    case "rvs_space_list":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/spaces/list", filters), token, roleCode);

    // RVS Analytics - Vendors
    case "vendor_performance_analytics":
    case "vendor_performance":
    case "vendor_analytics":
    case "vendor_performance_summary":
    case "vendor_analytics_overview":
    case "rvs_vendor_performance_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/vendors/analytics", filters), token, roleCode);
    case "vendor_kpis":
    case "vendor_performance_kpis":
    case "vendor_kpi":
    case "rvs_vendor_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/vendors/kpis", filters), token, roleCode);
    case "vendor_chart":
    case "vendor_charts":
    case "vendor_performance_chart":
    case "rvs_vendor_chart":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/vendors/chart", filters), token, roleCode);
    case "vendor_list":
    case "vendors_list":
    case "vendor_performance_list":
    case "rvs_vendor_list":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/vendors/list", filters), token, roleCode);

    // RVS Analytics - Filters
    case "departments_filter":
    case "department_filter":
    case "rvs_departments_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/filters/departments", filters), token, roleCode);
    case "resource_types_filter":
    case "resource_type_filter":
    case "rvs_resource_types_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/filters/resource-types", filters), token, roleCode);
    case "locations_filter":
    case "location_filter":
    case "rvs_locations_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/filters/locations", filters), token, roleCode);
    case "service_types_filter":
    case "service_type_filter":
    case "rvs_service_types_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/filters/service-types", filters), token, roleCode);
    case "vendor_names_filter":
    case "vendor_name_filter":
    case "rvs_vendor_names_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics/filters/vendor-names", filters), token, roleCode);

    // General administrative analytics
    case "administrative_metrics_overview":
    case "administrative_analytics_overview":
    case "administrative_efficiency_metrics":
    case "administrative_performance_overview":
    case "rvs_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/administrative/rvsAnalytics", filters), token, roleCode);

    default:
      throw new Error(`Unknown administrative intent: ${intent}`);
  }
}