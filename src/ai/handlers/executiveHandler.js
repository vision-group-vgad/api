import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleExecutiveQueries(intent, filters, token, roleCode) {
  switch (intent) {
    case "company_wide_kpis":
    case "company_performance_overview":
    case "company_performance":
    case "company_wide_performance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/company-wide-kpis", filters), token, roleCode);
    case "strategic_initiatives_progress":
    case "strategic_initiatives":
    case "strategic_performance":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/strategic-init-tracking", filters), token, roleCode);
    case "market_share_analysis":
    case "market_share":
    case "market_position_competitive_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/market-share", filters), token, roleCode);
    case "executive_dashboard_overview":
    case "executive_dashboard":
    case "ceo_analytics":
    case "governance_compliance":
    case "governance_compliance_status":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/governance-compliance", filters), token, roleCode);
    case "legal_exposure":
    case "legal_exposure_risks":
    case "legal_risk_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/legal-exposure", filters), token, roleCode);
    case "board_reporting":
    case "board_reporting_metrics":
    case "board_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/board-reporting-metrics", filters), token, roleCode);
    case "workforce_analytics":
    case "workforce_overview":
    case "employee_analytics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/workforce-analytics", filters), token, roleCode);
    case "retention_rates":
    case "employee_retention":
    case "retention_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/retention-rates", filters), token, roleCode);
    case "compensation_benchmarks":
    case "compensation_analysis":
    case "salary_benchmarks":
    case "compensation_comparison":
    case "pay_equity_analysis":
    case "compensation_gap_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/CEOAnalytics/compensation-benchmarks", filters), token, roleCode);
    case "revenue_performance":
    case "revenue_analysis":
    case "revenue_metrics":
    case "revenue_trends":
    case "revenue_performance_in_range":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/revenue-performance/in-range", filters), token, roleCode);
    case "financial_health":
    case "financial_performance":
    case "financial_analysis":
    case "financial_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/financial-health", filters), token, roleCode);
    case "liquidity_ratios":
    case "liquidity_analysis":
    case "liquidity_metrics":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/liquidity-ratios", filters), token, roleCode);
    case "cost_optimization":
    case "cost_reduction_analysis":
    case "cost_saving_strategies":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/cost-optimization", filters), token, roleCode);
    case "roi_analysis":
    case "roi_metrics":
    case "return_on_investment_analysis":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executive/roi-analysis", filters), token, roleCode);
    case "risk_heatmap":
    case "risk_management":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/risk-heatmap", filters), token, roleCode);
    case "control_effectiveness":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/control-effectiveness", filters), token, roleCode);
    case "compliance_tasks":
    case "compliance_overview":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/tasks", filters), token, roleCode);
    case "compliance_policies":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/policies", filters), token, roleCode);
    case "compliance_audits":
      return await makeAPIRequestGET(getEndpoint("/api/v1/executives/compliance/audits", filters), token, roleCode);
    default:
      throw new Error(`Unknown executive intent: ${intent}`);
  }
}