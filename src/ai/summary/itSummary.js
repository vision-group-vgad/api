
// IT department summary generator (comprehensive)
function summarizeServerPerformance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No server performance data found.";
  const healthy = data.filter(s => s.status === 'healthy').length;
  const total = data.length;
  return `Server performance: ${healthy} of ${total} servers healthy (${((healthy/total)*100).toFixed(1)}%).`;
}

function summarizeServerKPIs(data) {
  if (!Array.isArray(data) || data.length === 0) return "No server KPI data found.";
  return data.map(kpi => `${kpi.label || kpi.name}: ${kpi.value}`).join(", ");
}

function summarizeStorageUtilization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No storage utilization data found.";
  const avgUtil = data.reduce((sum, s) => sum + (s.utilization_percent || 0), 0) / (data.length || 1);
  return `Storage utilization: avg ${avgUtil.toFixed(1)}%.`;
}

function summarizeStorageKPIs(data) {
  if (!Array.isArray(data) || data.length === 0) return "No storage KPI data found.";
  return data.map(kpi => `${kpi.label || kpi.name}: ${kpi.value}`).join(", ");
}

function summarizePatchCompliance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No patch compliance data found.";
  const compliant = data.filter(p => p.status === 'compliant').length;
  const total = data.length;
  return `Patch compliance: ${compliant} of ${total} systems compliant (${((compliant/total)*100).toFixed(1)}%).`;
}

function summarizePatchKPIs(data) {
  if (!Array.isArray(data) || data.length === 0) return "No patch KPI data found.";
  return data.map(kpi => `${kpi.label || kpi.name}: ${kpi.value}`).join(", ");
}

function summarizeSLAOverview(data) {
  if (!Array.isArray(data) || data.length === 0) return "No SLA data found.";
  const met = data.filter(s => s.sla_met).length;
  const total = data.length;
  return `SLA overview: ${met} of ${total} tickets met SLA (${((met/total)*100).toFixed(1)}%).`;
}

function summarizeSLAPriority(data) {
  if (!Array.isArray(data) || data.length === 0) return "No SLA by priority data found.";
  return data.map(row => `${row.priority}: ${row.sla_met_percent || row.percent || 0}% met`).join(", ");
}

function summarizeSLAAgent(data) {
  if (!Array.isArray(data) || data.length === 0) return "No SLA by agent data found.";
  return data.map(row => `${row.agent || row.name}: ${row.sla_met_percent || row.percent || 0}% met`).join(", ");
}

function summarizeUserSatisfaction(data) {
  if (!Array.isArray(data) || data.length === 0) return "No user satisfaction data found.";
  const avg = data.reduce((sum, s) => sum + (s.score || 0), 0) / (data.length || 1);
  return `User satisfaction: avg score ${avg.toFixed(2)}.`;
}

function summarizeAssetInventory(data) {
  if (!Array.isArray(data) || data.length === 0) return "No asset inventory data found.";
  const total = data.length;
  return `Asset inventory: ${total} assets tracked.`;
}

function summarizeCyberSecurity(data) {
  if (!Array.isArray(data) || data.length === 0) return "No cyber security data found.";
  const incidents = data.filter(i => i.status === 'incident').length;
  return `Cyber security: ${incidents} incidents reported.`;
}

function summarizeInfrastructureCosts(data) {
  if (!Array.isArray(data) || data.length === 0) return "No infrastructure cost data found.";
  const total = data.reduce((sum, c) => sum + (c.amount || 0), 0);
  return `Infrastructure costs: UGX ${total.toLocaleString()}.`;
}

function summarizeSystemHealthScore(data) {
  if (!Array.isArray(data) || data.length === 0) return "No system health score data found.";
  const avg = data.reduce((sum, s) => sum + (s.score || 0), 0) / (data.length || 1);
  return `System health score: avg ${avg.toFixed(2)}.`;
}

function summarizeCPUUsage(data) {
  if (!Array.isArray(data) || data.length === 0) return "No CPU usage data found.";
  const avg = data.reduce((sum, c) => sum + (c.usage_percent || 0), 0) / (data.length || 1);
  return `CPU usage: avg ${avg.toFixed(1)}%.`;
}

function generateITSummary(intent, data) {
  if (!data) return "No IT data found.";
  const intentMap = {
    // Server performance/load
    server_health: summarizeServerPerformance,
    server_performance: summarizeServerPerformance,
    server_infrastructure_performance: summarizeServerPerformance,
    system_performance: summarizeServerPerformance,
    system_metrics_overview: summarizeServerPerformance,
    server_load: summarizeServerPerformance,
    server_health_metrics: summarizeServerPerformance,
    system_performance_overview: summarizeServerPerformance,

    // Server KPIs
    server_load_kpis: summarizeServerKPIs,
    server_performance_kpis: summarizeServerKPIs,

    // Storage utilization
    storage_utilization: summarizeStorageUtilization,
    storage_utilization_report: summarizeStorageUtilization,
    storage_analytics: summarizeStorageUtilization,

    // Storage KPIs
    storage_kpis: summarizeStorageKPIs,
    storage_performance: summarizeStorageKPIs,

    // Patch compliance
    patch_compliance: summarizePatchCompliance,
    patch_compliance_status: summarizePatchCompliance,
    patch_management: summarizePatchCompliance,

    // Patch KPIs
    patch_compliance_kpis: summarizePatchKPIs,
    patch_performance: summarizePatchKPIs,

    // SLA metrics
    sla_metrics: summarizeSLAOverview,
    service_level_agreement: summarizeSLAOverview,
    sla_overview: summarizeSLAOverview,
    ticket_sla: summarizeSLAOverview,

    // SLA by priority
    sla_by_priority: summarizeSLAPriority,
    priority_sla: summarizeSLAPriority,

    // SLA by agent
    sla_by_agent: summarizeSLAAgent,
    agent_sla: summarizeSLAAgent,

    // User satisfaction
    user_satisfaction: summarizeUserSatisfaction,
    user_satisfaction_metrics: summarizeUserSatisfaction,
    it_satisfaction: summarizeUserSatisfaction,

    // Asset inventory
    asset_inventory: summarizeAssetInventory,
    assets_inventory: summarizeAssetInventory,
    it_assets: summarizeAssetInventory,

    // Cybersecurity
    cyber_security_posture: summarizeCyberSecurity,
    cyber_posture: summarizeCyberSecurity,
    cyber_security: summarizeCyberSecurity,
    cybersecurity_posture_overview: summarizeCyberSecurity,
    cyber_sec_router: summarizeCyberSecurity,

    // Infrastructure costs
    infrastructure_costs: summarizeInfrastructureCosts,
    infrastructure_cost_analysis: summarizeInfrastructureCosts,
    infra_costs: summarizeInfrastructureCosts,

    // System health score
    sys_health_score: summarizeSystemHealthScore,
    system_health_score: summarizeSystemHealthScore,

    // System health (legacy)
    system_health: summarizeServerPerformance,
    infrastructure: summarizeInfrastructureCosts,

    // CPU usage
    cpu_usage: summarizeCPUUsage,

    // Server storage patch (legacy)
    server_storage_patch: summarizeServerPerformance,
  };
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No IT summary available for this query.";
}

export default generateITSummary;
