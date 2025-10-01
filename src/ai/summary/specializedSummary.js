
// Specialized department summary generator (comprehensive)
function summarizeCases(data) {
  if (!Array.isArray(data) || data.length === 0) return "No case data found.";
  const open = data.filter(c => c.status === 'open').length;
  const closed = data.filter(c => c.status === 'closed').length;
  return `Cases: ${open} open, ${closed} closed, total ${data.length}.`;
}

function summarizeComplianceBreaches(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compliance breach data found.";
  const high = data.filter(b => b.severity === 'high').length;
  const total = data.length;
  return `Compliance breaches: ${total} total, ${high} high severity.`;
}

function summarizeKPIs(data) {
  if (!Array.isArray(data) || data.length === 0) return "No KPI data found.";
  return data.map(kpi => `${kpi.label || kpi.name}: ${kpi.value}`).join(", ");
}

function summarizeFilters(data) {
  if (!Array.isArray(data) || data.length === 0) return "No filter data found.";
  return `Available: ${data.map(f => f.name || f.value || f).join(", ")}`;
}

function summarizeRiskExposure(data) {
  if (!Array.isArray(data) || data.length === 0) return "No risk exposure data found.";
  const high = data.filter(r => r.level === 'high').length;
  const total = data.length;
  return `Risk exposure: ${total} risks, ${high} high level.`;
}

function summarizeMitigation(data) {
  if (!Array.isArray(data) || data.length === 0) return "No mitigation data found.";
  const effective = data.filter(m => m.effectiveness === 'high').length;
  return `Mitigation: ${effective} highly effective out of ${data.length}.`;
}

function summarizeAttendance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No attendance data found.";
  const avg = data.reduce((sum, a) => sum + (a.rate || 0), 0) / (data.length || 1);
  return `Attendance: avg rate ${(avg*100).toFixed(1)}%.`;
}

function summarizeSponsorROI(data) {
  if (!Array.isArray(data) || data.length === 0) return "No sponsor ROI data found.";
  const avg = data.reduce((sum, s) => sum + (s.roi || 0), 0) / (data.length || 1);
  return `Sponsor ROI: avg ${(avg*100).toFixed(1)}%.`;
}

function summarizeRecruitmentFunnel(data) {
  if (!Array.isArray(data) || data.length === 0) return "No recruitment funnel data found.";
  const hired = data.filter(r => r.status === 'hired').length;
  return `Recruitment funnel: ${hired} hired out of ${data.length} candidates.`;
}

function summarizeRetentionRisk(data) {
  if (!Array.isArray(data) || data.length === 0) return "No retention risk data found.";
  const atRisk = data.filter(r => r.risk === 'high').length;
  return `Retention risk: ${atRisk} high risk employees.`;
}

function summarizeFeedback(data) {
  if (!Array.isArray(data) || data.length === 0) return "No feedback data found.";
  const positive = data.filter(f => f.sentiment === 'positive').length;
  return `Feedback: ${positive} positive out of ${data.length}.`;
}

function summarizeTrainingEffectiveness(data) {
  if (!Array.isArray(data) || data.length === 0) return "No training effectiveness data found.";
  const effective = data.filter(t => t.effectiveness === 'high').length;
  return `Training effectiveness: ${effective} highly effective out of ${data.length}.`;
}

function summarizeFirebaseRoles(data) {
  if (!Array.isArray(data) || data.length === 0) return "No role data found.";
  return `Roles: ${data.map(r => r.name || r.role || r).join(", ")}`;
}

function summarizeFirebaseUsers(data) {
  if (!Array.isArray(data) || data.length === 0) return "No user data found.";
  return `Users: ${data.map(u => u.name || u.email || u).join(", ")}`;
}

function summarizeHR(data) {
  if (!Array.isArray(data) || data.length === 0) return "No HR data found.";
  const totalEmployees = data.length;
  const avgTenure = data.reduce((sum, e) => sum + (e.tenure_years || 0), 0) / (totalEmployees || 1);
  return `HR: ${totalEmployees} employees, avg tenure ${avgTenure.toFixed(1)} years.`;
}

function summarizeLegal(data) {
  if (!Array.isArray(data) || data.length === 0) return "No legal data found.";
  const openCases = data.filter(c => c.status === 'open').length;
  const closedCases = data.filter(c => c.status === 'closed').length;
  return `Legal: ${openCases} open cases, ${closedCases} closed cases.`;
}

function summarizeCompliance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compliance data found.";
  const passed = data.filter(c => c.status === 'passed').length;
  const failed = data.filter(c => c.status === 'failed').length;
  return `Compliance: ${passed} passed, ${failed} failed checks.`;
}

function summarizeEvents(data) {
  if (!Array.isArray(data) || data.length === 0) return "No event data found.";
  const totalEvents = data.length;
  const upcoming = data.filter(e => new Date(e.date) > new Date()).length;
  return `Events: ${totalEvents} total, ${upcoming} upcoming.`;
}

function generateSpecializedSummary(intent, data) {
  if (!data) return "No specialized data found.";
  const intentMap = {
    // Case compliance
    case_resolution: summarizeCases,
    case_resolution_analytics: summarizeCases,
    case_resolution_list: summarizeCases,
    cases: summarizeCases,
    case_list: summarizeCases,

    compliance_breaches: summarizeComplianceBreaches,
    compliance_breach_tracking: summarizeComplianceBreaches,
    compliance_breach_list: summarizeComplianceBreaches,
    compliance_breach_analytics: summarizeComplianceBreaches,
    breach_tracking: summarizeComplianceBreaches,
    case_compliance_breaches: summarizeComplianceBreaches,

    // KPIs
    case_resolution_kpis: summarizeKPIs,
    case_kpis: summarizeKPIs,
    cases_kpis: summarizeKPIs,
    compliance_breach_kpis: summarizeKPIs,
    breach_kpis: summarizeKPIs,
    compliance_kpis: summarizeKPIs,

    // Filters
    case_types_filter: summarizeFilters,
    case_type_filter: summarizeFilters,
    case_departments_filter: summarizeFilters,
    case_department_filter: summarizeFilters,
    case_priorities_filter: summarizeFilters,
    case_priority_filter: summarizeFilters,
    case_statuses_filter: summarizeFilters,
    case_status_filter: summarizeFilters,
    breach_types_filter: summarizeFilters,
    breach_type_filter: summarizeFilters,
    breach_departments_filter: summarizeFilters,
    breach_department_filter: summarizeFilters,
    severity_levels_filter: summarizeFilters,
    severity_level_filter: summarizeFilters,
    years_filter: summarizeFilters,
    year_filter: summarizeFilters,

    // Risk/mitigation
    risk_exposure: summarizeRiskExposure,
    risk_assessment: summarizeRiskExposure,
    risk_management: summarizeRiskExposure,
    risk_analysis: summarizeRiskExposure,
    risk_exposure_analysis: summarizeRiskExposure,
    mitigation_effectiveness: summarizeMitigation,
    mitigation_analysis: summarizeMitigation,
    mitigation_effectiveness_analysis: summarizeMitigation,
    mitigation_strategies_effectiveness: summarizeMitigation,
    mitigation_strategies_analysis: summarizeMitigation,

    // Attendance
    attendance_rate: summarizeAttendance,
    attendance_analysis: summarizeAttendance,
    attendance_trends: summarizeAttendance,
    employee_attendance: summarizeAttendance,
    employee_attendance_rate: summarizeAttendance,

    // Sponsor ROI
    sponsor_roi: summarizeSponsorROI,
    sponsor_roi_analysis: summarizeSponsorROI,
    sponsor_return_on_investment: summarizeSponsorROI,
    sponsor_investment_analysis: summarizeSponsorROI,

    // Recruitment/hiring
    recruitment_funnel: summarizeRecruitmentFunnel,
    recruitment_analysis: summarizeRecruitmentFunnel,
    hiring_funnel: summarizeRecruitmentFunnel,
    hiring_analysis: summarizeRecruitmentFunnel,

    // Retention risk
    retention_risk: summarizeRetentionRisk,

    // Feedback
    feedback: summarizeFeedback,

    // Training effectiveness
    training_effectiveness: summarizeTrainingEffectiveness,

    // Firebase roles/users
    firebase_roles: summarizeFirebaseRoles,
    firebase_users: summarizeFirebaseUsers,

    // HR, legal, compliance, events (legacy)
    hr_overview: summarizeHR,
    employee_summary: summarizeHR,
    legal_cases: summarizeLegal,
    legal_summary: summarizeLegal,
    compliance_audit: summarizeCompliance,
    compliance_summary: summarizeCompliance,
    event_overview: summarizeEvents,
    events_summary: summarizeEvents,
  };
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No specialized summary available for this query.";
}

export default generateSpecializedSummary;
