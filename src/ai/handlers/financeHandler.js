import { makeAPIRequestGET, getEndpoint } from './baseHandler.js';

export async function handleFinanceQueries(intent, filters, token, roleCode) {
  try {
    switch (intent) {
      // Core Financial Metrics - using correct endpoints from test results
      case "financial_health_overview":
      case "financial_performance":
      case "financial_close_metrics":
        return await makeAPIRequestGET("/api/v1/finance/close-metrics", token, roleCode);
      case "cash_flow_analysis":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/cashflow", token, roleCode);
      case "audit_trail_analysis":
        return await makeAPIRequestGET("/api/v1/finance/audit-trail", token, roleCode);
      case "reporting_accuracy":
        return await makeAPIRequestGET("/api/v1/finance/reporting-accuracy", token, roleCode);
      case "profit_loss_analysis":
      case "regional_pnl":
        return await makeAPIRequestGET("/api/v1/finance/regional-pnl", token, roleCode);
      case "pipeline_metrics":
        return await makeAPIRequestGET("/api/v1/finance/pipeline-metrics", token, roleCode);
      
      // Executive Finance APIs  
      case "roi_analysis_by_department":
      case "roi_analysis":
        return await makeAPIRequestGET("/api/v1/executive/roi-analysis", token, roleCode);
      case "liquidity_ratios_analysis":
        return await makeAPIRequestGET("/api/v1/executive/liquidity-ratios", token, roleCode);
      case "cost_optimization":
        return await makeAPIRequestGET("/api/v1/executive/cost-optimization", token, roleCode);
      case "revenue_growth":
      case "revenue_performance":
        return await makeAPIRequestGET("/api/v1/executive/financial-health", token, roleCode);
      
      // Asset Management
      case "asset_depreciation":
      case "asset_depreciation_performance":
        return await makeAPIRequestGET("/api/v1/asset-depreciation", token, roleCode);
      case "capex":
      case "capital_expenditure":
        return await makeAPIRequestGET("/api/v1/capEx/capex-dummy", token, roleCode);
      
      // Forecasting
      case "financial_forecasting_data":
      case "revenue_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      case "net_income_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/net-income", token, roleCode);
      
      // System Health
      case "integration_health":
        return await makeAPIRequestGET("/api/v1/integration-health", token, roleCode);
      
      // Date-dependent APIs with default parameters
      case "budget_variance":
      case "budget_variance_analysis": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/budget-variance?${dateParams}`, token, roleCode);
      }
      case "expense_category":
      case "expense_category_breakdown": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/expense-category?${dateParams}`, token, roleCode);
      }
      case "accounts_receivable_aging":
      case "ap_ar_aging": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/ap-ar-aging?${dateParams}`, token, roleCode);
      }
      case "collection_efficiency": {
        const yearParam = new URLSearchParams({
          year: filters.year || '2025'
        });
        return await makeAPIRequestGET(`/api/v1/collection-efficiency/annual?${yearParam}`, token, roleCode);
      }
      case "bad_debt_ratios": {
        const yearParam = new URLSearchParams({
          year: filters.year || '2025'
        });
        return await makeAPIRequestGET(`/api/v1/bad-debt-ratios/annual?${yearParam}`, token, roleCode);
      }
      case "dso":
      case "days_sales_outstanding": {
        const dateParams = new URLSearchParams({
          startDate: filters.startDate || '2025-01-01',
          endDate: filters.endDate || '2025-09-10'
        });
        return await makeAPIRequestGET(`/api/v1/dso?${dateParams}`, token, roleCode);
      }
      
      // Legacy endpoints
      case "total_assets_value":
        return await makeAPIRequestGET(getEndpoint("/api/v1/total-assets-value", filters), token, roleCode);
      case "finance_forecasting":
        return await makeAPIRequestGET(getEndpoint("/api/v1/finance-forecasting", filters), token, roleCode);
      case "gl_reconciliation":
        return await makeAPIRequestGET(getEndpoint("/api/v1/gl-reconciliation", filters), token, roleCode);
      case "tax_provisioning":
        return await makeAPIRequestGET(getEndpoint("/api/v1/tax-provisioning", filters), token, roleCode);
      case "statement_variance":
        return await makeAPIRequestGET(getEndpoint("/api/v1/fin-statement-variance", filters), token, roleCode);
      
      // Additional AI-generated intents
      case "revenue_growth_comparison":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      case "profit_loss_analysis_by_region":
        return await makeAPIRequestGET("/api/v1/finance/regional-pnl", token, roleCode);
      case "financial_forecasting":
        return await makeAPIRequestGET("/api/v1/finance-forecasting/revenue", token, roleCode);
      default:
        throw new Error(`Unknown finance intent: ${intent}`);
    }
  } catch (error) {
    console.error(`Finance query error for intent "${intent}":`, error.message);
    throw error;
  }
}