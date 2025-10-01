import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleITQueries(intent, filters, token, roleCode) {
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load", filters), token, roleCode);
    
    // Server Load KPIs
    case "server_load_kpis":
    case "server_performance_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load/kpis", filters), token, roleCode);
    
    // Storage Utilization
    case "storage_utilization":
    case "storage_utilization_report":
    case "storage_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/storage", filters), token, roleCode);
    
    // Storage KPIs
    case "storage_kpis":
    case "storage_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/storage/kpis", filters), token, roleCode);
    
    // Patch Compliance
    case "patch_compliance":
    case "patch_compliance_status":
    case "patch_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/patch-compliance", filters), token, roleCode);
    
    // Patch Compliance KPIs
    case "patch_compliance_kpis":
    case "patch_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/patch-compliance/kpis", filters), token, roleCode);
    
    // SLA Metrics
    case "sla_metrics":
    case "service_level_agreement":
    case "sla_overview":
    case "ticket_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/overview", filters), token, roleCode);
    
    // SLA by Priority
    case "sla_by_priority":
    case "priority_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/by-priority", filters), token, roleCode);
    
    // SLA by Agent
    case "sla_by_agent":
    case "agent_sla":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/sla/by-agent", filters), token, roleCode);
    
    // User Satisfaction
    case "user_satisfaction":
    case "user_satisfaction_metrics":
    case "it_satisfaction":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/satisfaction", filters), token, roleCode);
    
    // Assets Inventory
    case "asset_inventory":
    case "assets_inventory":
    case "it_assets":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/assets-inventory", filters), token, roleCode);
    
    // Cybersecurity
    case "cyber_security_posture":
    case "cyber_posture":
    case "cyber_security":
    case "cybersecurity_posture_overview":
    case "cyber_sec_router":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/cyber-sec-router/in-range", filters), token, roleCode);
    
    // Infrastructure Costs
    case "infrastructure_costs":
    case "infrastructure_cost_analysis":
    case "infra_costs":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/infrastructure-costs", filters), token, roleCode);
    
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
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load", filters), token, roleCode);
    case "infrastructure":
      return await makeAPIRequestGET(getEndpoint("/api/v1/IT/infrastructure-costs", filters), token, roleCode);
    case "cpu_usage":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/cpu-usage", filters), token, roleCode);
    case "server_storage_patch":
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load", filters), token, roleCode);
    
    default:
      // Default to server load for unknown IT intents
      console.log(`Unknown IT intent: ${intent}, defaulting to server-load`);
      return await makeAPIRequestGET(getEndpoint("/api/v1/it/ServerStoragePatch/server-load", filters), token, roleCode);
  }
}