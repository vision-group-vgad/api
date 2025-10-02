import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleOperationsQueries(intent, filters, token, roleCode) {
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/production-yield", filters), token, roleCode);
    
    // Map equipment queries to setup-time (working endpoint)
    case "equipment_efficiency":
    case "machine_oee":
    case "equipment_uptime_status":
    case "equipment_setup_time_metrics":
    case "setup_time_optimization_status":
    case "equipment_downtime_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/machine-oee", filters), token, roleCode);
    
    // Map delivery/logistics queries to route-efficiency (working endpoint)
    case "delivery_timeline_performance":
    case "delivery_timelines":
    case "logistics_performance":
    case "route_efficiency_analysis":
    case "logistics_performance_overview":
    case "fuel_consumption_trend":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/delivery-timelines", filters), token, roleCode);
    
    // Map resource/parts queries to parts-utilization (working endpoint)
    case "parts_utilization":
    case "parts_utilization_rate":
    case "parts_utilization_metrics":
    case "resource_utilization_rate":
    case "resource_utilization_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/parts-utilization", filters), token, roleCode);
    
    // Map ticket/support queries to ticket-resolution (working endpoint)
    case "ticket_resolution":
    case "ticket_resolution_performance":
    case "ticket_resolution_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution", filters), token, roleCode);
    
    // setup-time is a working endpoint, map related queries here
    case "setup_time":
    case "setup_time_metrics":
    case "setup_time_analysis":
    case "setup_time_optimization":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/setup-time", filters), token, roleCode);
    
    // job-scheduling is a working endpoint, map related queries here
    case "scheduling_efficiency":
    case "scheduling_performance":
    case "job_scheduling":
    case "job_scheduling_efficiency":
    case "job_scheduling_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/job-scheduling", filters), token, roleCode);
    
   // route-efficiency is a working endpoint, map related queries here 
    case "route_efficiency": 
    case "route_efficiency_metrics":
    case "logistics_efficiency":
    case "logistics_efficiency_metrics":
    case "logistics_efficiency_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/route-efficiency", filters), token, roleCode);
    
    //material waste is a working endpoint, map related queries here
    case "material_waste":
    case "material_waste_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/OperationsProductionAnalytics/material-waste", filters), token, roleCode);
      
    // signal quality
    case "signal quality":
    case "channel quality":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/signal-quality-metrics/in-range", filters), token, roleCode);

    //up downtime
    case "up downtime logs":
    case "up downtime":
    case "downtime logs":
    case "downtime":
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/up-downtime-logs/in-range", filters), token, roleCode);
   
    default:
      // Default to ticket-resolution for unknown operations queries
      return await makeAPIRequestGET(getEndpoint("/api/v1/operations/ticket-resolution", filters), token, roleCode);
  }
}