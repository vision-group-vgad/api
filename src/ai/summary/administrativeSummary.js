// Administrative department summary generator
function summarizeMeetings(data) {
  if (!Array.isArray(data) || data.length === 0) return "No meeting data found.";
  // Real structure: { meetingId, meetingTitle, meetingDate, startTime, endTime, meetingStatus, department, totalInvited, attended }
  const totalMeetings = data.length;
  const held = data.filter(m => m.meetingStatus && m.meetingStatus.toLowerCase() === 'held').length;
  const cancelled = data.filter(m => m.meetingStatus && m.meetingStatus.toLowerCase() === 'cancelled').length;
  const rescheduled = data.filter(m => m.meetingStatus && m.meetingStatus.toLowerCase() === 'rescheduled').length;
  // Duration in minutes
  const avgDuration = data.reduce((sum, m) => {
    if (m.startTime && m.endTime) {
      const [sh, sm] = m.startTime.split(":").map(Number);
      const [eh, em] = m.endTime.split(":").map(Number);
      return sum + ((eh * 60 + em) - (sh * 60 + sm));
    }
    return sum;
  }, 0) / (totalMeetings || 1);
  // Attendance rate
  const avgAttendance = data.reduce((sum, m) => sum + ((m.attended || 0) / (m.totalInvited || 1)), 0) / totalMeetings * 100;
  return `Meetings: ${totalMeetings} total (${held} held, ${cancelled} cancelled, ${rescheduled} rescheduled). Avg duration: ${avgDuration.toFixed(1)} min. Avg attendance: ${avgAttendance.toFixed(1)}%.`;
}

function summarizeTaskCompletion(data) {
  if (!Array.isArray(data) || data.length === 0) return "No task completion data found.";
  // Real structure: { task_id, task_name, task_type, assignee, date_assigned, date_completed, expected_end_date, task_status }
  const total = data.length;
  const completed = data.filter(t => t.task_status && t.task_status.toLowerCase() === 'completed').length;
  const pending = data.filter(t => t.task_status && t.task_status.toLowerCase() === 'pending').length;
  const inProgress = data.filter(t => t.task_status && t.task_status.toLowerCase() === 'in progress').length;
  const onHold = data.filter(t => t.task_status && t.task_status.toLowerCase() === 'on hold').length;
  const overdue = data.filter(t => {
    if (t.task_status && t.task_status.toLowerCase() !== 'completed' && t.expected_end_date) {
      const due = new Date(t.expected_end_date);
      return due < new Date();
    }
    return false;
  }).length;
  return `Task completion: ${completed} completed, ${pending} pending, ${inProgress} in progress, ${onHold} on hold, ${overdue} overdue, out of ${total} tasks.`;
}

function summarizeVisitorPatterns(data) {
  if (!Array.isArray(data) || data.length === 0) return "No visitor data found.";
  // Real structure: { Visitor_ID, Visit_Date, Visit_Type, Arrival_Time, Check_In_Time, Department_Visited, Host_Staff_Name, Visit_Purpose }
  const totalVisitors = data.length;
  const byType = data.reduce((acc, v) => {
    acc[v.Visit_Type] = (acc[v.Visit_Type] || 0) + 1;
    return acc;
  }, {});
  const byDept = data.reduce((acc, v) => {
    acc[v.Department_Visited] = (acc[v.Department_Visited] || 0) + 1;
    return acc;
  }, {});
  const typeStr = Object.entries(byType).map(([type, count]) => `${type}: ${count}`).join(', ');
  const deptStr = Object.entries(byDept).map(([dept, count]) => `${dept}: ${count}`).join(', ');
  return `Visitor patterns: ${totalVisitors} visitors. By type: ${typeStr}. By department: ${deptStr}.`;
}

function summarizeWaitTimes(data) {
  if (!Array.isArray(data) || data.length === 0) return "No wait time data found.";
  // Real structure: { Arrival_Time, Check_In_Time, Visit_Date, ... } with Wait_Time calculated
  // If Wait_Time not present, calculate it
  const withWait = data.map(v => {
    if (typeof v.Wait_Time === 'number') return v;
    if (v.Arrival_Time && v.Check_In_Time && v.Visit_Date) {
      const arrival = new Date(`${v.Visit_Date}T${v.Arrival_Time}Z`);
      const checkin = new Date(`${v.Visit_Date}T${v.Check_In_Time}Z`);
      return { ...v, Wait_Time: Math.max(0, Math.round((checkin - arrival) / 60000)) };
    }
    return v;
  });
  const avgWait = withWait.reduce((sum, w) => sum + (w.Wait_Time || 0), 0) / (withWait.length || 1);
  // Excessive wait: >10 min
  const excessive = withWait.filter(w => w.Wait_Time > 10).length;
  const excessivePct = withWait.length > 0 ? (excessive / withWait.length) * 100 : 0;
  return `Average wait time: ${avgWait.toFixed(1)} min. ${excessive} visitors (${excessivePct.toFixed(1)}%) waited more than 10 minutes.`;
}


// --- RVS Analytics Summaries ---
function summarizeResourceUtilization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No resource utilization data found.";
  // Real structure: { resource_id, resource_name, resource_type, department, status, hours_used, capacity_hours, utilization_rate, ... }
  const total = data.length;
  const active = data.filter(r => r.status === "Active").length;
  const avgUtil = data.reduce((sum, r) => sum + (r.utilization_rate || 0), 0) / total;
  const totalDowntime = data.reduce((sum, r) => sum + (r.downtime_hours || 0), 0);
  const totalMaint = data.reduce((sum, r) => sum + (r.maintenance_cost || 0), 0);
  const totalMonthly = data.reduce((sum, r) => sum + (r.monthly_cost || 0), 0);
  return `Resources: ${total} tracked (${active} active). Avg utilization: ${avgUtil.toFixed(1)}%. Total downtime: ${totalDowntime}h. Maintenance cost: $${totalMaint}. Monthly cost: $${totalMonthly}.`;
}

function summarizeSpaceOptimization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No space optimization data found.";
  // Real structure: { space_id, location, total_area, allocated_area, vacant_area, capacity, current_usage, occupancy_rate, ... }
  const total = data.length;
  const totalArea = data.reduce((sum, s) => sum + (s.total_area || 0), 0);
  const allocated = data.reduce((sum, s) => sum + (s.allocated_area || 0), 0);
  const vacant = data.reduce((sum, s) => sum + (s.vacant_area || 0), 0);
  const avgOcc = data.reduce((sum, s) => sum + (s.occupancy_rate || 0), 0) / total;
  return `Spaces: ${total} tracked. Total area: ${totalArea} sqm, allocated: ${allocated} sqm, vacant: ${vacant} sqm. Avg occupancy: ${avgOcc.toFixed(1)}%.`;
}

function summarizeVendorPerformance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No vendor performance data found.";
  // Real structure: { vendor_id, vendor_name, service_type, contract_terms, delay_days, complaints_count, service_quality_score, contract_compliance, ... }
  const total = data.length;
  const onTime = data.filter(v => v.delay_days === 0).length;
  const avgQuality = data.reduce((sum, v) => sum + (v.service_quality_score || 0), 0) / total;
  const totalComplaints = data.reduce((sum, v) => sum + (v.complaints_count || 0), 0);
  const avgCompliance = data.reduce((sum, v) => sum + (v.contract_compliance || 0), 0) / total;
  return `Vendors: ${total} tracked. On-time deliveries: ${onTime}. Avg service quality: ${avgQuality.toFixed(1)}. Total complaints: ${totalComplaints}. Avg contract compliance: ${avgCompliance.toFixed(1)}%.`;
}

function summarizeProcessThroughput(data) {
  if (!Array.isArray(data) || data.length === 0) return "No process throughput data found.";
  // Real structure: { process_id, process_name, throughput, avg_cycle_time, completed, failed, ... }
  const total = data.length;
  const avgThroughput = data.reduce((sum, p) => sum + (p.throughput || 0), 0) / total;
  const avgCycle = data.reduce((sum, p) => sum + (p.avg_cycle_time || 0), 0) / total;
  const completed = data.reduce((sum, p) => sum + (p.completed || 0), 0);
  const failed = data.reduce((sum, p) => sum + (p.failed || 0), 0);
  return `Processes: ${total} tracked. Avg throughput: ${avgThroughput.toFixed(1)}. Avg cycle time: ${avgCycle.toFixed(1)} min. Completed: ${completed}, Failed: ${failed}.`;
}

function summarizeScheduleEfficiency(data) {
  if (!Array.isArray(data) || data.length === 0) return "No schedule efficiency data found.";
  // Real structure: { schedule_id, scheduled_tasks, completed_tasks, efficiency_rate, avg_delay, ... }
  const total = data.length;
  const avgEff = data.reduce((sum, s) => sum + (s.efficiency_rate || 0), 0) / total;
  const avgDelay = data.reduce((sum, s) => sum + (s.avg_delay || 0), 0) / total;
  const totalTasks = data.reduce((sum, s) => sum + (s.scheduled_tasks || 0), 0);
  const completed = data.reduce((sum, s) => sum + (s.completed_tasks || 0), 0);
  return `Schedules: ${total} tracked. Efficiency: ${avgEff.toFixed(1)}%. Avg delay: ${avgDelay.toFixed(1)} min. Tasks: ${completed}/${totalTasks} completed.`;
}

function generateAdministrativeSummary(intent, data) {
  if (!data) return "No administrative data found.";
  const intentMap = {
    meeting_analytics: summarizeMeetings,
    executive_meeting_analytics: summarizeMeetings,
    task_completion_rates: summarizeTaskCompletion,
    task_comp_rates: summarizeTaskCompletion,
    visitor_patterns: summarizeVisitorPatterns,
    wait_time: summarizeWaitTimes,
    wait_times: summarizeWaitTimes,
    // RVS Analytics
    rvs_analytics_overview: (d) => [
      summarizeResourceUtilization(d.resources || []),
      summarizeSpaceOptimization(d.spaces || []),
      summarizeVendorPerformance(d.vendors || [])
    ].join(' '),
    rvs_overview: (d) => [
      summarizeResourceUtilization(d.resources || []),
      summarizeSpaceOptimization(d.spaces || []),
      summarizeVendorPerformance(d.vendors || [])
    ].join(' '),
    rvs_dashboard: (d) => [
      summarizeResourceUtilization(d.resources || []),
      summarizeSpaceOptimization(d.spaces || []),
      summarizeVendorPerformance(d.vendors || [])
    ].join(' '),
    rvs_summary: (d) => [
      summarizeResourceUtilization(d.resources || []),
      summarizeSpaceOptimization(d.spaces || []),
      summarizeVendorPerformance(d.vendors || [])
    ].join(' '),
    // Resource
    resource_utilization_analytics: summarizeResourceUtilization,
    resource_utilization: summarizeResourceUtilization,
    resource_analytics: summarizeResourceUtilization,
    resource_utilization_summary: summarizeResourceUtilization,
    resource_analytics_overview: summarizeResourceUtilization,
    rvs_resource_utilization_analytics: summarizeResourceUtilization,
    resource_kpis: summarizeResourceUtilization,
    resource_utilization_kpis: summarizeResourceUtilization,
    resource_kpi: summarizeResourceUtilization,
    rvs_resource_kpis: summarizeResourceUtilization,
    resource_chart: summarizeResourceUtilization,
    resource_charts: summarizeResourceUtilization,
    resource_utilization_chart: summarizeResourceUtilization,
    rvs_resource_chart: summarizeResourceUtilization,
    resource_list: summarizeResourceUtilization,
    resources_list: summarizeResourceUtilization,
    resource_utilization_list: summarizeResourceUtilization,
    rvs_resource_list: summarizeResourceUtilization,
    // Space
    space_optimization_analytics: summarizeSpaceOptimization,
    space_optimization: summarizeSpaceOptimization,
    space_analytics: summarizeSpaceOptimization,
    space_optimization_summary: summarizeSpaceOptimization,
    space_analytics_overview: summarizeSpaceOptimization,
    rvs_space_optimization_analytics: summarizeSpaceOptimization,
    space_kpis: summarizeSpaceOptimization,
    space_optimization_kpis: summarizeSpaceOptimization,
    space_kpi: summarizeSpaceOptimization,
    rvs_space_kpis: summarizeSpaceOptimization,
    space_chart: summarizeSpaceOptimization,
    space_charts: summarizeSpaceOptimization,
    space_optimization_chart: summarizeSpaceOptimization,
    rvs_space_chart: summarizeSpaceOptimization,
    space_list: summarizeSpaceOptimization,
    spaces_list: summarizeSpaceOptimization,
    space_optimization_list: summarizeSpaceOptimization,
    rvs_space_list: summarizeSpaceOptimization,
    // Vendor
    vendor_performance_analytics: summarizeVendorPerformance,
    vendor_performance: summarizeVendorPerformance,
    vendor_analytics: summarizeVendorPerformance,
    vendor_performance_summary: summarizeVendorPerformance,
    vendor_analytics_overview: summarizeVendorPerformance,
    rvs_vendor_performance_analytics: summarizeVendorPerformance,
    vendor_kpis: summarizeVendorPerformance,
    vendor_performance_kpis: summarizeVendorPerformance,
    vendor_kpi: summarizeVendorPerformance,
    rvs_vendor_kpis: summarizeVendorPerformance,
    vendor_chart: summarizeVendorPerformance,
    vendor_charts: summarizeVendorPerformance,
    vendor_performance_chart: summarizeVendorPerformance,
    rvs_vendor_chart: summarizeVendorPerformance,
    vendor_list: summarizeVendorPerformance,
    vendors_list: summarizeVendorPerformance,
    vendor_performance_list: summarizeVendorPerformance,
    rvs_vendor_list: summarizeVendorPerformance,
    // Process Throughput
    process_throughput: summarizeProcessThroughput,
    process_throughput_analytics: summarizeProcessThroughput,
    process_efficiency_status: summarizeProcessThroughput,
    administrative_productivity: summarizeProcessThroughput,
    administrative_productivity_overview: summarizeProcessThroughput,
    process_performance: summarizeProcessThroughput,
    // Schedule Efficiency
    meeting_schedule_efficiency: summarizeScheduleEfficiency,
    meeting_efficiency_status: summarizeScheduleEfficiency,
    schedule_efficiency: summarizeScheduleEfficiency,
    schedule_optimization_insights: summarizeScheduleEfficiency,
  };
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No administrative summary available for this query.";
}

export default generateAdministrativeSummary;
