// Operations department summary generator

// --- Production Analytics ---
function summarizeProductionYield(data) {
  if (!Array.isArray(data) || data.length === 0) return "No production yield data found.";
  const totalProduced = data.reduce((sum, p) => sum + (p.units_produced || 0), 0);
  const avgYield = totalProduced / (data.length || 1);
  return `Production yield: ${totalProduced} units, avg per period: ${avgYield.toFixed(1)}.`;
}

function summarizeOperationalEfficiency(data) {
  if (!Array.isArray(data) || data.length === 0) return "No operational efficiency data found.";
  const avgEff = data.reduce((sum, d) => sum + (d.efficiency_percent || 0), 0) / (data.length || 1);
  return `Operational efficiency: avg ${avgEff.toFixed(1)}%.`;
}

function summarizeOperationsMetricsOverview(data) {
  if (!data || typeof data !== 'object') return "No operations metrics overview data found.";
  return `Operations metrics overview: ${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(', ')}.`;
}

// --- Equipment Analytics ---
function summarizeEquipmentPerformance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No equipment performance data found.";
  const avgOEE = data.reduce((sum, d) => sum + (d.oee_percent || 0), 0) / (data.length || 1);
  return `Equipment OEE: avg ${avgOEE.toFixed(1)}%.`;
}

function summarizeEquipmentUptime(data) {
  if (!Array.isArray(data) || data.length === 0) return "No equipment uptime data found.";
  const avgUptime = data.reduce((sum, d) => sum + (d.uptime_hours || 0), 0) / (data.length || 1);
  return `Equipment uptime: avg ${avgUptime.toFixed(1)} hours.`;
}

function summarizeSetupTime(data) {
  if (!Array.isArray(data) || data.length === 0) return "No setup time data found.";
  const avgSetup = data.reduce((sum, d) => sum + (d.setup_time_minutes || 0), 0) / (data.length || 1);
  return `Setup time: avg ${avgSetup.toFixed(1)} minutes.`;
}

function summarizeEquipmentDowntime(data) {
  if (!Array.isArray(data) || data.length === 0) return "No equipment downtime data found.";
  const avgDowntime = data.reduce((sum, d) => sum + (d.downtime_minutes || 0), 0) / (data.length || 1);
  return `Equipment downtime: avg ${avgDowntime.toFixed(1)} minutes.`;
}

// --- Delivery/Logistics Analytics ---
function summarizeDeliveryTimelines(data) {
  if (!Array.isArray(data) || data.length === 0) return "No delivery timeline data found.";
  const onTime = data.filter(d => d.on_time).length;
  const total = data.length;
  return `Delivery timelines: ${onTime} of ${total} deliveries on time (${((onTime/total)*100).toFixed(1)}%).`;
}

function summarizeRouteEfficiency(data) {
  if (!Array.isArray(data) || data.length === 0) return "No route efficiency data found.";
  const avgRouteEff = data.reduce((sum, d) => sum + (d.efficiency_percent || 0), 0) / (data.length || 1);
  return `Route efficiency: avg ${avgRouteEff.toFixed(1)}%.`;
}

function summarizeFuelConsumption(data) {
  if (!Array.isArray(data) || data.length === 0) return "No fuel consumption data found.";
  const totalFuel = data.reduce((sum, d) => sum + (d.fuel_liters || 0), 0);
  return `Total fuel consumption: ${totalFuel.toFixed(1)} liters.`;
}

// --- Resource/Parts Analytics ---
function summarizePartsUtilization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No parts utilization data found.";
  const avgUtil = data.reduce((sum, d) => sum + (d.utilization_percent || 0), 0) / (data.length || 1);
  return `Parts utilization: avg ${avgUtil.toFixed(1)}%.`;
}

function summarizeResourceUtilization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No resource utilization data found.";
  const avgUtil = data.reduce((sum, r) => sum + (r.utilization_percent || 0), 0) / (data.length || 1);
  return `Resource utilization: avg ${avgUtil.toFixed(1)}%.`;
}

// --- Ticket/Support Analytics ---
function summarizeSupportTickets(data) {
  if (!Array.isArray(data) || data.length === 0) return "No support ticket data found.";
  const closed = data.filter(t => t.status === 'closed').length;
  const total = data.length;
  return `Support tickets: ${closed} of ${total} closed (${((closed/total)*100).toFixed(1)}%).`;
}

// --- Scheduling Analytics ---
function summarizeJobScheduling(data) {
  if (!Array.isArray(data) || data.length === 0) return "No job scheduling data found.";
  const avgDelay = data.reduce((sum, d) => sum + (d.delay_minutes || 0), 0) / (data.length || 1);
  return `Job scheduling: avg delay ${avgDelay.toFixed(1)} minutes.`;
}

function summarizeSchedulingEfficiency(data) {
  if (!Array.isArray(data) || data.length === 0) return "No scheduling efficiency data found.";
  const avgEff = data.reduce((sum, d) => sum + (d.efficiency_percent || 0), 0) / (data.length || 1);
  return `Scheduling efficiency: avg ${avgEff.toFixed(1)}%.`;
}

// --- Material Waste Analytics ---
function summarizeMaterialWaste(data) {
  if (!Array.isArray(data) || data.length === 0) return "No material waste data found.";
  const totalWaste = data.reduce((sum, d) => sum + (d.waste_kg || 0), 0);
  return `Material waste: ${totalWaste.toFixed(1)} kg total.`;
}

// --- Signal Quality Analytics ---
function summarizeSignalQuality(data) {
  if (!Array.isArray(data) || data.length === 0) return "No signal quality data found.";
  const avgSignal = data.reduce((sum, d) => sum + (d.signal_quality_percent || 0), 0) / (data.length || 1);
  return `Signal quality: avg ${avgSignal.toFixed(1)}%.`;
}

// --- Up/Downtime Analytics ---
function summarizeUpDowntime(data) {
  if (!Array.isArray(data) || data.length === 0) return "No up/downtime data found.";
  const avgUp = data.reduce((sum, d) => sum + (d.uptime_hours || 0), 0) / (data.length || 1);
  const avgDown = data.reduce((sum, d) => sum + (d.downtime_hours || 0), 0) / (data.length || 1);
  return `Avg uptime: ${avgUp.toFixed(1)} hours, avg downtime: ${avgDown.toFixed(1)} hours.`;
}

const intentMap = {
  // Production
  production_yield_analysis: summarizeProductionYield,
  production_metrics: summarizeProductionYield,
  production_yield: summarizeProductionYield,
  operational_efficiency: summarizeOperationalEfficiency,
  operations_metrics_overview: summarizeOperationsMetricsOverview,
  production_efficiency_metrics: summarizeOperationalEfficiency,
  operational_efficiency_analysis: summarizeOperationalEfficiency,
  equipment_performance_overview: summarizeEquipmentPerformance,
  operational_productivity_metrics: summarizeOperationalEfficiency,

  // Equipment
  equipment_efficiency: summarizeEquipmentPerformance,
  machine_oee: summarizeEquipmentPerformance,
  equipment_uptime_status: summarizeEquipmentUptime,
  equipment_setup_time_metrics: summarizeSetupTime,
  setup_time_optimization_status: summarizeSetupTime,
  equipment_downtime_analysis: summarizeEquipmentDowntime,

  // Delivery/Logistics
  delivery_timeline_performance: summarizeDeliveryTimelines,
  delivery_timelines: summarizeDeliveryTimelines,
  logistics_performance: summarizeDeliveryTimelines,
  route_efficiency_analysis: summarizeRouteEfficiency,
  logistics_performance_overview: summarizeDeliveryTimelines,
  fuel_consumption_trend: summarizeFuelConsumption,

  // Resource/Parts
  parts_utilization: summarizePartsUtilization,
  parts_utilization_rate: summarizePartsUtilization,
  parts_utilization_metrics: summarizePartsUtilization,
  resource_utilization_rate: summarizeResourceUtilization,
  resource_utilization_status: summarizeResourceUtilization,

  // Ticket/Support
  ticket_resolution: summarizeSupportTickets,
  ticket_resolution_performance: summarizeSupportTickets,
  ticket_resolution_metrics: summarizeSupportTickets,

  // Setup Time
  setup_time: summarizeSetupTime,
  setup_time_metrics: summarizeSetupTime,
  setup_time_analysis: summarizeSetupTime,
  setup_time_optimization: summarizeSetupTime,

  // Scheduling
  scheduling_efficiency: summarizeSchedulingEfficiency,
  scheduling_performance: summarizeSchedulingEfficiency,
  job_scheduling: summarizeJobScheduling,
  job_scheduling_efficiency: summarizeJobScheduling,
  job_scheduling_performance: summarizeJobScheduling,

  // Route Efficiency
  route_efficiency: summarizeRouteEfficiency,
  route_efficiency_metrics: summarizeRouteEfficiency,
  logistics_efficiency: summarizeRouteEfficiency,
  logistics_efficiency_metrics: summarizeRouteEfficiency,
  logistics_efficiency_analysis: summarizeRouteEfficiency,

  // Material Waste
  material_waste: summarizeMaterialWaste,
  material_waste_metrics: summarizeMaterialWaste,

  // Signal Quality
  "signal quality": summarizeSignalQuality,
  "channel quality": summarizeSignalQuality,

  // Up/Downtime
  "up downtime logs": summarizeUpDowntime,
  "up downtime": summarizeUpDowntime,
  "downtime logs": summarizeUpDowntime,
  "downtime": summarizeUpDowntime,
};

function generateOperationsSummary(intent, data) {
  if (!data) return "No operations data found.";
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No operations summary available for this query.";
}

export default generateOperationsSummary;
