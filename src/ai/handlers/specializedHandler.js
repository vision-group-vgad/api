import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleSpecializedQueries(intent, filters, token, roleCode) {
  switch (intent) {
    // --- Case Compliance Analytics ---
    // Case Resolution Analytics
    case "case_resolution":
    case "case_resolution_analytics":
    case "case_resolution_list":
    case "cases":
    case "case_list":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/cases", filters), token, roleCode);

    // Compliance Breach Analytics
    case "compliance_breaches":
    case "compliance_breach_tracking":
    case "compliance_breach_list":
    case "compliance_breach_analytics":
    case "breach_tracking":
    case "case_compliance_breaches":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/compliance-breaches", filters), token, roleCode);

    // Case Resolution KPIs
    case "case_resolution_kpis":
    case "case_kpis":
    case "cases_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/cases/kpis", filters), token, roleCode);

    // Compliance Breach KPIs
    case "compliance_breach_kpis":
    case "breach_kpis":
    case "compliance_kpis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/compliance-breaches/kpis", filters), token, roleCode);

    // --- Case Compliance Filters ---
    case "case_types_filter":
    case "case_type_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/case-types", filters), token, roleCode);
    case "case_departments_filter":
    case "case_department_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/case-departments", filters), token, roleCode);
    case "case_priorities_filter":
    case "case_priority_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/case-priorities", filters), token, roleCode);
    case "case_statuses_filter":
    case "case_status_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/case-statuses", filters), token, roleCode);
    case "breach_types_filter":
    case "breach_type_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/breach-types", filters), token, roleCode);
    case "breach_departments_filter":
    case "breach_department_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/breach-departments", filters), token, roleCode);
    case "severity_levels_filter":
    case "severity_level_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/severity-levels", filters), token, roleCode);
    case "years_filter":
    case "year_filter":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/CaseCompliance/filters/years", filters), token, roleCode);

    // --- Other Specialized Analytics ---
    case "risk_exposure":
    case "risk_assessment":
    case "risk_management":
    case "risk_analysis":
    case "risk_exposure_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/risk-exposure/in-range", filters), token, roleCode);
    case "mitigation_effectiveness":
    case "mitigation_analysis":
    case "mitigation_effectiveness_analysis":
    case "mitigation_strategies_effectiveness":
    case "mitigation_strategies_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/mitigation-effectiveness/in-range", filters), token, roleCode);
    case "attendance_rate":
    case "attendance_analysis":
    case "attendance_trends":
    case "employee_attendance":
    case "employee_attendance_rate":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/attendance-rate", filters), token, roleCode);
    case "sponsor_roi":
    case "sponsor_roi_analysis":
    case "sponsor_return_on_investment":
    case "sponsor_investment_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/sponsor-roi", filters), token, roleCode);
    case "recruitment_funnel":
    case "recruitment_analysis":
    case "hiring_funnel":
    case "hiring_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/hr/recruitment-funnel", filters), token, roleCode);
    case "retention_risk":
      return await makeAPIRequestGET(getEndpoint("/api/v1/hr/retention-risk", filters), token, roleCode);
    case "feedback":
      return await makeAPIRequestGET(getEndpoint("/api/v1/specialized/feedback", filters), token, roleCode);
    case "training_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/hr/training-effectiveness", filters), token, roleCode);
    case "firebase_roles":
      return await makeAPIRequestGET(getEndpoint("/api/v1/roles", filters), token, roleCode);
    case "firebase_users":
      return await makeAPIRequestGET(getEndpoint("/api/v1/users", filters), token, roleCode);
    default:
      throw new Error(`Unknown specialized intent: ${intent}`);
  }
}