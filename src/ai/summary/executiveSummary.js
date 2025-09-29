// Executive department summary generator

// --- Executive Summary Functions ---
function summarizeCompanyKPIs(data) {
  if (!Array.isArray(data) || data.length === 0) return "No company KPI data found.";
  // Expecting array of weekly KPI objects as in real company-wide-kpis dummy-data.js
  const n = data.length;
  if (n === 0) return "No company KPI data found.";

  // Compute averages for key metrics
  let totalHeadcount = 0;
  let totalEngagement = 0;
  let totalRevenue = 0;
  let totalOperatingCosts = 0;
  let totalMarketShare = 0;
  let totalContentViews = 0;
  let totalUptime = 0;

  data.forEach(week => {
    // Administrative
    if (week.administrative_support) {
      totalHeadcount += week.administrative_support.employee_headcount || 0;
      totalEngagement += week.administrative_support.employee_engagement_percent || 0;
    }
    // Finance
    if (week.finance) {
      totalRevenue += week.finance.revenue || 0;
      totalOperatingCosts += week.finance.operating_costs || 0;
    }
    // Sales/Marketing
    if (week.sales_marketing) {
      totalMarketShare += week.sales_marketing.market_share_percent || 0;
    }
    // Editorial (content views)
    if (week.editorial && Array.isArray(week.editorial.top_content)) {
      totalContentViews += week.editorial.top_content.reduce((sum, c) => sum + (c.views || 0), 0);
    }
    // IT (uptime)
    if (week.it) {
      const uptime = ((week.it.website_uptime_percent || 0) + (week.it.broadcast_uptime_percent || 0) + (week.it.internal_systems_uptime_percent || 0)) / 3;
      totalUptime += uptime;
    }
  });

  const avgHeadcount = Math.round(totalHeadcount / n);
  const avgEngagement = Math.round(totalEngagement / n);
  const avgRevenue = Math.round(totalRevenue / n);
  const avgOperatingCosts = Math.round(totalOperatingCosts / n);
  const avgMarketShare = Math.round(totalMarketShare / n);
  const avgContentViews = Math.round(totalContentViews / n);
  const avgUptime = (totalUptime / n).toFixed(2);

  return `Company-wide KPIs (${n} weeks):\n- Avg Employee Headcount: ${avgHeadcount}\n- Avg Engagement: ${avgEngagement}%\n- Avg Revenue: UGX ${avgRevenue.toLocaleString()}\n- Avg Operating Costs: UGX ${avgOperatingCosts.toLocaleString()}\n- Avg Market Share: ${avgMarketShare}%\n- Avg Content Views: ${avgContentViews}\n- Avg System Uptime: ${avgUptime}%`;
}

function summarizeStrategicInitiatives(data) {
  if (!Array.isArray(data) || data.length === 0) return "No strategic initiative data found.";
  // Real structure: { initiativeId, initiativeName, owner, department, startDate, endDate, status, completionPercent, budgetAllocated, budgetSpent, strategicGoal, risks }
  const completed = data.filter(i => i.status && i.status.toLowerCase() === 'completed').length;
  const progressing = data.filter(i => i.status && i.status.toLowerCase() === 'progressing').length;
  const blocked = data.filter(i => i.status && i.status.toLowerCase() === 'blocked').length;
  const avgCompletion = (data.reduce((sum, i) => sum + (i.completionPercent || 0), 0) / data.length).toFixed(1);
  const totalBudget = data.reduce((sum, i) => sum + (i.budgetAllocated || 0), 0);
  const totalSpent = data.reduce((sum, i) => sum + (i.budgetSpent || 0), 0);
  return `Strategic initiatives: ${completed} completed, ${progressing} progressing, ${blocked} blocked. Avg completion: ${avgCompletion}%. Total budget: UGX ${totalBudget.toLocaleString()}, spent: UGX ${totalSpent.toLocaleString()}.`;
}

function summarizeMarketShare(data) {
  if (!Array.isArray(data) || data.length === 0) return "No market share data found.";
  // Real structure: { date, marketSize, sales, organizationMarketShare, genderSegmentation, regions, businessUnits, competitors }
  const n = data.length;
  const avgShare = (data.reduce((sum, d) => sum + (d.organizationMarketShare || 0), 0) / n).toFixed(1);
  const avgMarketSize = Math.round(data.reduce((sum, d) => sum + (d.marketSize || 0), 0) / n);
  const topRegion = (() => {
    const regionCounts = {};
    data.forEach(d => {
      if (Array.isArray(d.regions)) {
        d.regions.forEach(r => {
          regionCounts[r.name] = (regionCounts[r.name] || 0) + (r.marketSharePercent || 0);
        });
      }
    });
    return Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  })();
  return `Market share: Avg org share ${avgShare}%. Avg market size: ${avgMarketSize.toLocaleString()}. Top region: ${topRegion}.`;
}

function summarizeGovernanceCompliance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No governance/compliance data found.";
  // Real structure: { compliance_area, compliance_score, last_audit_date, status }
  const compliant = data.filter(d => d.status && d.status.toLowerCase() === 'compliant').length;
  const atRisk = data.filter(d => d.status && d.status.toLowerCase() === 'at risk').length;
  const nonCompliant = data.filter(d => d.status && d.status.toLowerCase() === 'non-compliant').length;
  const avgScore = (data.reduce((sum, d) => sum + (d.compliance_score || 0), 0) / data.length).toFixed(1);
  return `Governance/Compliance: ${compliant} compliant, ${atRisk} at risk, ${nonCompliant} non-compliant. Avg score: ${avgScore}.`;
}

function summarizeLegalExposure(data) {
  if (!Array.isArray(data) || data.length === 0) return "No legal exposure data found.";
  // Real structure: { case_id, case_type, risk_level, exposure, status, opened_date }
  const high = data.filter(d => d.risk_level && d.risk_level.toLowerCase() === 'high').length;
  const medium = data.filter(d => d.risk_level && d.risk_level.toLowerCase() === 'medium').length;
  const low = data.filter(d => d.risk_level && d.risk_level.toLowerCase() === 'low').length;
  const open = data.filter(d => d.status && d.status.toLowerCase() === 'open').length;
  const closed = data.filter(d => d.status && d.status.toLowerCase() === 'closed').length;
  const totalExposure = data.reduce((sum, d) => sum + (d.exposure || 0), 0);
  return `Legal exposure: ${high} high, ${medium} medium, ${low} low risk cases. ${open} open, ${closed} closed. Total exposure: UGX ${totalExposure.toLocaleString()}.`;
}

function summarizeBoardReporting(data) {
  if (!Array.isArray(data) || data.length === 0) return "No board reporting data found.";
  // Real structure: { year, month, revenue_growth, profit_margin, market_share, headcount, strategic_projects_completed }
  const avgRevenueGrowth = (data.reduce((sum, d) => sum + (d.revenue_growth || 0), 0) / data.length).toFixed(1);
  const avgProfitMargin = (data.reduce((sum, d) => sum + (d.profit_margin || 0), 0) / data.length).toFixed(1);
  const avgMarketShare = (data.reduce((sum, d) => sum + (d.market_share || 0), 0) / data.length).toFixed(1);
  const avgHeadcount = Math.round(data.reduce((sum, d) => sum + (d.headcount || 0), 0) / data.length);
  const totalProjects = data.reduce((sum, d) => sum + (d.strategic_projects_completed || 0), 0);
  return `Board reporting: Avg revenue growth ${avgRevenueGrowth}%, profit margin ${avgProfitMargin}%, market share ${avgMarketShare}%. Avg headcount: ${avgHeadcount}. Strategic projects completed: ${totalProjects}.`;
}

function summarizeWorkforceAnalytics(data) {
  if (!Array.isArray(data) || data.length === 0) return "No workforce analytics data found.";
  // Real structure: { department, employees, tenure, turnover, performance_score, year }
  const avgTenure = (data.reduce((sum, d) => sum + parseFloat(d.tenure || 0), 0) / data.length).toFixed(1);
  const avgTurnover = (data.reduce((sum, d) => sum + (d.turnover || 0), 0) / data.length).toFixed(1);
  const avgPerformance = (data.reduce((sum, d) => sum + (d.performance_score || 0), 0) / data.length).toFixed(1);
  const totalEmployees = data.reduce((sum, d) => sum + (d.employees || 0), 0);
  return `Workforce analytics: Avg tenure ${avgTenure} years, avg turnover ${avgTurnover}%, avg performance score ${avgPerformance}. Total employees: ${totalEmployees}.`;
}

function summarizeRetentionRates(data) {
  if (!Array.isArray(data) || data.length === 0) return "No retention rate data found.";
  // Real structure: { year, month, retained, total }
  const avgRate = (data.reduce((sum, d) => sum + ((d.retained || 0) / (d.total || 1)), 0) / data.length) * 100;
  return `Employee retention: avg ${(avgRate || 0).toFixed(1)}%.`;
}

function summarizeCompensationBenchmarks(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compensation benchmark data found.";
  // Real structure: { department, roleLevel, region, compensation, year, month }
  const avgComp = data.reduce((sum, d) => sum + (d.compensation || 0), 0) / data.length;
  return `Compensation benchmark: avg UGX ${Math.round(avgComp).toLocaleString()}.`;
}

function summarizeRevenuePerformance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No revenue performance data found.";
  // Real structure: { date, totalRevenue, projectedRevenue, businessUnits, clients, regions }
  const n = data.length;
  const totalRevenue = data.reduce((sum, d) => sum + (d.totalRevenue || 0), 0);
  const totalProjected = data.reduce((sum, d) => sum + (d.projectedRevenue || 0), 0);
  const avgRevenue = Math.round(totalRevenue / n);
  const avgProjected = Math.round(totalProjected / n);
  return `Revenue performance: Total revenue UGX ${totalRevenue.toLocaleString()}, projected UGX ${totalProjected.toLocaleString()}. Avg per period: UGX ${avgRevenue.toLocaleString()} (actual), UGX ${avgProjected.toLocaleString()} (projected).`;
}

function summarizeFinancialHealth(data) {
  if (!Array.isArray(data) || data.length === 0) return "No financial health data found.";
  // Real structure: { department, date, revenue, cogs, expenses, cashReserves, monthlyBurn, cashFlowInvesting, cashFlowFinancing }
  const n = data.length;
  const totalRevenue = data.reduce((sum, d) => sum + (d.revenue || 0), 0);
  const totalExpenses = data.reduce((sum, d) => sum + (d.expenses || 0), 0);
  const totalCash = data.reduce((sum, d) => sum + (d.cashReserves || 0), 0);
  const avgBurn = Math.round(data.reduce((sum, d) => sum + (d.monthlyBurn || 0), 0) / n);
  return `Financial health: Total revenue UGX ${totalRevenue.toLocaleString()}, total expenses UGX ${totalExpenses.toLocaleString()}, cash reserves UGX ${totalCash.toLocaleString()}, avg monthly burn UGX ${avgBurn.toLocaleString()}.`;
}

function summarizeLiquidityRatios(data) {
  if (!Array.isArray(data) || data.length === 0) return "No liquidity ratio data found.";
  // Real structure: { businessUnit, date, currentAssets, currentLiabilities, inventory, cash, totalLiabilities, equity }
  const n = data.length;
  const avgCurrentRatio = (data.reduce((sum, d) => sum + ((d.currentAssets || 0) / ((d.currentLiabilities || 1))), 0) / n).toFixed(2);
  const avgQuickRatio = (data.reduce((sum, d) => sum + (((d.currentAssets || 0) - (d.inventory || 0)) / ((d.currentLiabilities || 1))), 0) / n).toFixed(2);
  return `Liquidity ratios: Avg current ratio ${avgCurrentRatio}, avg quick ratio ${avgQuickRatio}.`;
}

function summarizeCostOptimization(data) {
  if (!Array.isArray(data) || data.length === 0) return "No cost optimization data found.";
  // Real structure: { department, date, budget, actualSpend, legalSpend }
  const n = data.length;
  const totalBudget = data.reduce((sum, d) => sum + (d.budget || 0), 0);
  const totalActual = data.reduce((sum, d) => sum + (d.actualSpend || 0), 0);
  const totalLegal = data.reduce((sum, d) => sum + (d.legalSpend || 0), 0);
  const avgBudget = Math.round(totalBudget / n);
  const avgActual = Math.round(totalActual / n);
  const avgLegal = Math.round(totalLegal / n);
  const savings = totalBudget - totalActual;
  return `Cost optimization: Total savings UGX ${savings.toLocaleString()}. Avg budget: UGX ${avgBudget.toLocaleString()}, avg actual spend: UGX ${avgActual.toLocaleString()}, avg legal spend: UGX ${avgLegal.toLocaleString()}.`;
}

function summarizeROI(data) {
  if (!Array.isArray(data) || data.length === 0) return "No ROI data found.";
  // Real structure: { vendor, date, processingCost, processingTime, exceptionRate, savings, automationCost }
  const n = data.length;
  const avgProcessingCost = (data.reduce((sum, d) => sum + (d.processingCost || 0), 0) / n).toFixed(2);
  const avgProcessingTime = (data.reduce((sum, d) => sum + (d.processingTime || 0), 0) / n).toFixed(1);
  const avgExceptionRate = (data.reduce((sum, d) => sum + (d.exceptionRate || 0), 0) / n).toFixed(2);
  const totalSavings = data.reduce((sum, d) => sum + (d.savings || 0), 0);
  return `ROI: Avg processing cost $${avgProcessingCost}, avg time ${avgProcessingTime} min, avg exception rate ${avgExceptionRate}%. Total savings: $${totalSavings.toLocaleString()}.`;
}

function summarizeRiskHeatMap(data) {
  if (!Array.isArray(data) || data.length === 0) return "No risk heat map data found.";
  // Real structure: { riskId, department, riskType, description, likelihood, impact, riskScore, status, reviewDate, nextReviewDate }
  const n = data.length;
  const avgScore = (data.reduce((sum, d) => sum + (d.riskScore || 0), 0) / n).toFixed(1);
  const open = data.filter(d => d.status && d.status.toLowerCase() === 'open').length;
  const mitigated = data.filter(d => d.status && d.status.toLowerCase() === 'mitigated').length;
  const inProgress = data.filter(d => d.status && d.status.toLowerCase() === 'in progress').length;
  return `Risk heat map: Avg risk score ${avgScore}. ${open} open, ${mitigated} mitigated, ${inProgress} in progress.`;
}

function summarizeControlEffectiveness(data) {
  if (!Array.isArray(data) || data.length === 0) return "No control effectiveness data found.";
  // Real structure: { department, status, lastTestedDate, findings, effectivenessScore, effectivenessRating }
  const avgScore = (data.reduce((sum, d) => sum + (d.effectivenessScore || 0), 0) / data.length).toFixed(2);
  const ratingCounts = data.reduce((acc, d) => {
    acc[d.effectivenessRating] = (acc[d.effectivenessRating] || 0) + 1;
    return acc;
  }, {});
  const ratingsStr = Object.entries(ratingCounts).map(([r, c]) => `${c} ${r}`).join(', ');
  return `Control effectiveness: Avg score ${avgScore}. Ratings: ${ratingsStr}.`;
}

function summarizeComplianceTasks(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compliance task data found.";
  // Real structure: { department, status, startDate, dueDate }
  const completed = data.filter(d => d.status && d.status.toLowerCase() === 'completed').length;
  const overdue = data.filter(d => d.status && d.status.toLowerCase() === 'overdue').length;
  const inProgress = data.filter(d => d.status && d.status.toLowerCase() === 'in progress').length;
  return `Compliance tasks: ${completed} completed, ${overdue} overdue, ${inProgress} in progress, out of ${data.length}.`;
}

function summarizeCompliancePolicies(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compliance policy data found.";
  // Real structure: { department, status, category, lastReviewedDate, nextReviewDate }
  const active = data.filter(d => d.status && d.status.toLowerCase() === 'active').length;
  const expired = data.filter(d => d.status && d.status.toLowerCase() === 'expired').length;
  return `Compliance policies: ${active} active, ${expired} expired, out of ${data.length}.`;
}

function summarizeComplianceAudits(data) {
  if (!Array.isArray(data) || data.length === 0) return "No compliance audit data found.";
  // Real structure: { department, status, category, startDate, endDate }
  const passed = data.filter(d => d.status && d.status.toLowerCase() === 'passed').length;
  const failed = data.filter(d => d.status && d.status.toLowerCase() === 'failed').length;
  return `Compliance audits: ${passed} passed, ${failed} failed, out of ${data.length}.`;
}

const intentMap = {
  // Company KPIs
  company_wide_kpis: summarizeCompanyKPIs,
  company_performance_overview: summarizeCompanyKPIs,
  company_performance: summarizeCompanyKPIs,
  company_wide_performance_overview: summarizeCompanyKPIs,
  executive_kpis: summarizeCompanyKPIs,

  // Strategic Initiatives
  strategic_initiatives_progress: summarizeStrategicInitiatives,
  strategic_initiatives: summarizeStrategicInitiatives,
  strategic_performance: summarizeStrategicInitiatives,
  strategic_init_tracking: summarizeStrategicInitiatives,

  // Market Share
  market_share_analysis: summarizeMarketShare,
  market_share: summarizeMarketShare,
  market_position_competitive_analysis: summarizeMarketShare,

  // Executive Dashboard / Governance Compliance
  executive_dashboard_overview: summarizeGovernanceCompliance,
  executive_dashboard: summarizeGovernanceCompliance,
  ceo_analytics: summarizeGovernanceCompliance,
  governance_compliance: summarizeGovernanceCompliance,
  governance_compliance_status: summarizeGovernanceCompliance,

  // Legal Exposure
  legal_exposure: summarizeLegalExposure,
  legal_exposure_risks: summarizeLegalExposure,
  legal_risk_analysis: summarizeLegalExposure,

  // Board Reporting
  board_reporting: summarizeBoardReporting,
  board_reporting_metrics: summarizeBoardReporting,
  board_metrics: summarizeBoardReporting,

  // Workforce Analytics
  workforce_analytics: summarizeWorkforceAnalytics,
  workforce_overview: summarizeWorkforceAnalytics,
  employee_analytics: summarizeWorkforceAnalytics,

  // Retention Rates
  retention_rates: summarizeRetentionRates,
  employee_retention: summarizeRetentionRates,
  retention_analysis: summarizeRetentionRates,

  // Compensation Benchmarks
  compensation_benchmarks: summarizeCompensationBenchmarks,
  compensation_analysis: summarizeCompensationBenchmarks,
  salary_benchmarks: summarizeCompensationBenchmarks,
  compensation_comparison: summarizeCompensationBenchmarks,
  pay_equity_analysis: summarizeCompensationBenchmarks,
  compensation_gap_analysis: summarizeCompensationBenchmarks,

  // Revenue Performance
  revenue_performance: summarizeRevenuePerformance,
  revenue_analysis: summarizeRevenuePerformance,
  revenue_metrics: summarizeRevenuePerformance,
  revenue_trends: summarizeRevenuePerformance,
  revenue_performance_in_range: summarizeRevenuePerformance,

  // Financial Health
  financial_health: summarizeFinancialHealth,
  financial_performance: summarizeFinancialHealth,
  financial_analysis: summarizeFinancialHealth,
  financial_metrics: summarizeFinancialHealth,

  // Liquidity Ratios
  liquidity_ratios: summarizeLiquidityRatios,
  liquidity_analysis: summarizeLiquidityRatios,
  liquidity_metrics: summarizeLiquidityRatios,

  // Cost Optimization
  cost_optimization: summarizeCostOptimization,
  cost_reduction_analysis: summarizeCostOptimization,
  cost_saving_strategies: summarizeCostOptimization,

  // ROI Analysis
  roi_analysis: summarizeROI,
  roi_metrics: summarizeROI,
  return_on_investment_analysis: summarizeROI,

  // Risk Heatmap
  risk_heatmap: summarizeRiskHeatMap,
  risk_management: summarizeRiskHeatMap,
  risk_heat_map: summarizeRiskHeatMap,
  riskheatmaps: summarizeRiskHeatMap,

  // Control Effectiveness
  control_effectiveness: summarizeControlEffectiveness,

  // Compliance
  compliance_tasks: summarizeComplianceTasks,
  compliance_overview: summarizeComplianceTasks,
  compliance_policies: summarizeCompliancePolicies,
  compliance_audits: summarizeComplianceAudits,
};

function generateExecutiveSummary(intent, data) {
  if (!data) return "No executive data found.";
  const fn = intentMap[intent];
  if (fn) return fn(data);
  return "No executive summary available for this query.";
}

export default generateExecutiveSummary;
