function summarizeIntegrationHealth(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No integration health data found.";
  const healthy = data.filter(d => d.status === 'healthy').length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Integration health${range}: ${healthy} of ${data.length} integrations healthy.`;
}

function summarizeTotalAssets(data, filters) {
  if (!data || typeof data !== 'object') return "No total assets data found.";
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total assets value${range}: UGX ${data.value?.toLocaleString?.() || 'N/A'}.`;
}
// --- Restored and Refactored Summary Functions for All Intents ---
function summarizeFinancialHealth(data, filters) {
  if (!data || typeof data !== 'object') return "No financial health data found.";
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Financial health${range}: Assets UGX ${data.assets?.toLocaleString?.() || 'N/A'}, Liabilities UGX ${data.liabilities?.toLocaleString?.() || 'N/A'}, Equity UGX ${data.equity?.toLocaleString?.() || 'N/A'}.`;
}

function summarizeCloseMetrics(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No close metrics data found.";
  const avgCloseDays = data.reduce((sum, d) => sum + (d.close_days || 0), 0) / data.length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Average financial close${range}: ${avgCloseDays.toFixed(1)} days.`;
}

function summarizeCashFlow(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No cash flow data found.";
  const inflow = data.filter(d => d.type === 'inflow').reduce((sum, d) => sum + (d.amount || 0), 0);
  const outflow = data.filter(d => d.type === 'outflow').reduce((sum, d) => sum + (d.amount || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Cash flow${range}: Inflow UGX ${inflow.toLocaleString()}, Outflow UGX ${outflow.toLocaleString()}, Net UGX ${(inflow - outflow).toLocaleString()}.`;
}

function summarizeAuditTrail(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No audit trail data found.";
  const issues = data.filter(d => d.issue).length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Audit trail${range}: ${issues} issues found in ${data.length} records.`;
}

function summarizePnL(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No P&L data found.";
  const totalProfit = data.reduce((sum, p) => sum + (p.profit || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total profit/loss${range}: UGX ${totalProfit.toLocaleString()}.`;
}

function summarizeROI(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No ROI data found.";
  const avgROI = data.reduce((sum, d) => sum + (d.roi_percent || 0), 0) / data.length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `ROI${range}: avg ${(avgROI || 0).toFixed(1)}%.`;
}

function summarizeLiquidityRatios(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No liquidity ratios data found.";
  const avgRatio = data.reduce((sum, d) => sum + (d.ratio || 0), 0) / data.length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Liquidity ratio${range}: avg ${(avgRatio || 0).toFixed(2)}.`;
}

function summarizeCostOptimization(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No cost optimization data found.";
  const totalSavings = data.reduce((sum, d) => sum + (d.savings || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total cost savings${range}: UGX ${totalSavings.toLocaleString()}.`;
}

function summarizeRevenue(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No revenue data found.";
  const totalRevenue = data.reduce((sum, r) => sum + (r.amount || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total revenue${range}: UGX ${totalRevenue.toLocaleString()}.`;
}

function summarizeAssetDepreciation(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No asset depreciation data found.";
  const totalDep = data.reduce((sum, d) => sum + (d.depreciation || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total asset depreciation${range}: UGX ${totalDep.toLocaleString()}.`;
}

function summarizeCapex(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No capex data found.";
  const totalCapex = data.reduce((sum, d) => sum + (d.amount || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total capital expenditure${range}: UGX ${totalCapex.toLocaleString()}.`;
}

function summarizeForecasting(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No forecasting data found.";
  const totalForecast = data.reduce((sum, d) => sum + (d.amount || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Forecasted value${range}: UGX ${totalForecast.toLocaleString()}.`;
}

function summarizeGLReconciliation(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No GL reconciliation data found.";
  const reconciled = data.filter(d => d.reconciled).length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `GL reconciliation${range}: ${reconciled} of ${data.length} entries reconciled.`;
}

function summarizeTaxProvisioning(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No tax provisioning data found.";
  const totalTax = data.reduce((sum, d) => sum + (d.tax || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total tax provisioned${range}: UGX ${totalTax.toLocaleString()}.`;
}

function summarizeStatementVariance(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No statement variance data found.";
  const totalVariance = data.reduce((sum, d) => sum + (d.variance || 0), 0);
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Total statement variance${range}: UGX ${totalVariance.toLocaleString()}.`;
}
// Finance department summary generator


// --- Real Data-Aware Finance Summary Functions ---
function summarizeBudgetVariance(data, filters) {
  if (!data?.variance || !Array.isArray(data.variance) || data.variance.length === 0) return "No budget variance data found.";
  const top = data.variance.slice(0, 3).map(acc => `${acc.G_L_Account_Name}: Actual UGX ${acc.actual.toLocaleString()}, Budget UGX ${acc.budget.toLocaleString()}, Variance UGX ${acc.variance.toLocaleString()}`).join('; ');
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Top budget variances${range}: ${top}.`;
}

function summarizeExpenseCategory(data, filters) {
  if (!data?.categories || !Array.isArray(data.categories) || data.categories.length === 0) return "No expense category data found.";
  const top = data.categories.slice(0, 3).map(cat => `${cat.category}: UGX ${cat.total.toLocaleString()}`).join('; ');
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Top expense categories${range}: ${top}.`;
}

function summarizeAPAging(data, filters) {
  if (!data?.agingBuckets) return "No AP/AR aging data found.";
  const buckets = Object.entries(data.agingBuckets).map(([bucket, arr]) => `${bucket}: ${arr.length} entries`).join('; ');
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `AP/AR aging${range}: ${buckets}.`;
}

function summarizeCollectionEfficiency(data, filters) {
  if (!data || typeof data !== 'object') return "No collection efficiency data found.";
  if (data.overallCollectionEfficiencyPercentage !== undefined) {
    const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
    return `Collection efficiency${range}: ${data.overallCollectionEfficiencyPercentage}% (Receivables: UGX ${data.totalReceivablesDue?.toLocaleString?.() || 0}, Collected: UGX ${data.totalCollections?.toLocaleString?.() || 0}).`;
  }
  if (Array.isArray(data)) {
    // Annual/transactional
    return `Collection transactions: ${data.length} records.`;
  }
  return "No collection efficiency data found.";
}

function summarizeDSO(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No DSO data found.";
  const avgDSO = data.reduce((sum, d) => sum + (d.monthlyDSO || 0), 0) / data.length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Average DSO${range}: ${avgDSO.toFixed(1)} days.`;
}

function summarizeBadDebtRatios(data, filters) {
  if (data?.overallBadDebtRatioPercentage !== undefined) {
    const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
    return `Bad debt ratio${range}: ${data.overallBadDebtRatioPercentage}%.`;
  }
  if (data?.annual?.badDebtRatioPercentage !== undefined) {
    return `Annual bad debt ratio: ${data.annual.badDebtRatioPercentage}%.`;
  }
  return "No bad debt ratio data found.";
}

function summarizePipelineMetrics(data, filters) {
  if (!data?.summary) return "No pipeline metrics data found.";
  const s = data.summary;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Pipeline summary${range}: ${s.totalRuns} runs, ${s.totalLoaded} loaded of ${s.totalExpected} expected, ${s.totalErrors} errors, avg latency ${s.avgLatency}s, load success rate ${s.loadSuccessRate}%.`;
}

function summarizeReportingAccuracy(data, filters) {
  if (!Array.isArray(data) || data.length === 0) return "No reporting accuracy data found.";
  const avg = data.reduce((sum, d) => sum + (d.accuracy_percent || 0), 0) / data.length;
  const range = filters?.startDate && filters?.endDate ? ` for ${filters.startDate} to ${filters.endDate}` : '';
  return `Reporting accuracy${range}: avg ${(avg || 0).toFixed(1)}%.`;
}

// ...existing code for other summaries...

const intentMap = {
  // Core Financial Metrics
  financial_health_overview: summarizeFinancialHealth,
  financial_performance: summarizeFinancialHealth,
  financial_close_metrics: summarizeCloseMetrics,
  cash_flow_analysis: summarizeCashFlow,
  audit_trail_analysis: summarizeAuditTrail,
  reporting_accuracy: summarizeReportingAccuracy,
  profit_loss_analysis: summarizePnL,
  regional_pnl: summarizePnL,
  profit_loss_analysis_by_region: summarizePnL,
  pipeline_metrics: summarizePipelineMetrics,

  // Executive Finance
  roi_analysis_by_department: summarizeROI,
  roi_analysis: summarizeROI,
  liquidity_ratios_analysis: summarizeLiquidityRatios,
  cost_optimization: summarizeCostOptimization,
  revenue_growth: summarizeRevenue,
  revenue_performance: summarizeRevenue,
  revenue_growth_comparison: summarizeRevenue,

  // Asset Management
  asset_depreciation: summarizeAssetDepreciation,
  asset_depreciation_performance: summarizeAssetDepreciation,
  capex: summarizeCapex,
  capital_expenditure: summarizeCapex,

  // Forecasting
  financial_forecasting_data: summarizeForecasting,
  revenue_forecasting: summarizeForecasting,
  net_income_forecasting: summarizeForecasting,
  financial_forecasting: summarizeForecasting,

  // System Health
  integration_health: summarizeIntegrationHealth,

  // Budget/Expense/AP-AR
  budget_variance: summarizeBudgetVariance,
  budget_variance_analysis: summarizeBudgetVariance,
  expense_category: summarizeExpenseCategory,
  expense_category_breakdown: summarizeExpenseCategory,
  accounts_receivable_aging: summarizeAPAging,
  ap_ar_aging: summarizeAPAging,
  collection_efficiency: summarizeCollectionEfficiency,
  bad_debt_ratios: summarizeBadDebtRatios,
  dso: summarizeDSO,
  days_sales_outstanding: summarizeDSO,

  // Legacy endpoints
  total_assets_value: summarizeTotalAssets,
  finance_forecasting: summarizeForecasting,
  gl_reconciliation: summarizeGLReconciliation,
  tax_provisioning: summarizeTaxProvisioning,
  statement_variance: summarizeStatementVariance,
};


function generateFinanceSummary(intent, data, filters) {
  if (!data) return "No finance data found.";
  // Use real-data aware summaries for endpoints with special structure
  switch (intent) {
    case "budget_variance":
    case "budget_variance_analysis": {
      return summarizeBudgetVariance(data, filters);
    }
    case "expense_category":
    case "expense_category_breakdown": {
      return summarizeExpenseCategory(data, filters);
    }
    case "accounts_receivable_aging":
    case "ap_ar_aging": {
      return summarizeAPAging(data, filters);
    }
    case "collection_efficiency": {
      return summarizeCollectionEfficiency(data, filters);
    }
    case "bad_debt_ratios": {
      return summarizeBadDebtRatios(data, filters);
    }
    case "dso":
    case "days_sales_outstanding": {
      return summarizeDSO(data, filters);
    }
    case "pipeline_metrics": {
      return summarizePipelineMetrics(data, filters);
    }
    case "reporting_accuracy": {
      return summarizeReportingAccuracy(data, filters);
    }
    default: {
      // Fallback to previous intentMap for other summaries
      const fn = intentMap[intent];
      if (fn) return fn(data, filters);
      return "No finance summary available for this query.";
    }
  }
}

export default generateFinanceSummary;
