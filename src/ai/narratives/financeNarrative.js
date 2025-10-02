import { BaseNarrative } from './baseNarrative.js';

/**
 * Finance-specific narrative generator
 * Transforms financial data into compelling business stories with insights and recommendations
 */
export class FinanceNarrative extends BaseNarrative {
  constructor() {
    super('finance');
  }

  generateSummary(intent, rawData) {
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      return "No financial data available for the requested analysis.";
    }

    // Intent-specific summaries with business context
    switch (intent) {
      case 'financial_health_overview':
      case 'financial_performance':
        return this.generateFinancialHealthSummary(dataArray);
      
      case 'cash_flow_analysis':
        return this.generateCashFlowSummary(dataArray);
      
      case 'budget_variance':
      case 'budget_variance_analysis':
        return this.generateBudgetVarianceSummary(dataArray);
      
      case 'profit_loss_analysis':
      case 'regional_pnl':
        return this.generatePnLSummary(dataArray);
      
      case 'roi_analysis':
        return this.generateROISummary(dataArray);
      
      case 'accounts_receivable_aging':
      case 'ap_ar_aging':
        return this.generateARAgingSummary(dataArray);
      
      default:
        return `Financial analysis completed: ${dataArray.length} records reviewed for ${intent.replace(/_/g, ' ')}.`;
    }
  }

  generateInsights(intent, rawData) {
    const insights = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      insights.push("⚠️ **Financial Data Gap**: Missing financial information could indicate reporting delays or system integration issues.");
      return insights;
    }

    // Add data quality insight
    insights.push(...super.generateInsights(intent, rawData));

    // Intent-specific insights
    switch (intent) {
      case 'financial_health_overview':
        insights.push(...this.analyzeFinancialHealthInsights(dataArray));
        break;
      
      case 'cash_flow_analysis':
        insights.push(...this.analyzeCashFlowInsights(dataArray));
        break;
      
      case 'budget_variance':
        insights.push(...this.analyzeBudgetInsights(dataArray));
        break;
      
      case 'roi_analysis':
        insights.push(...this.analyzeROIInsights(dataArray));
        break;
      
      case 'accounts_receivable_aging':
        insights.push(...this.analyzeARInsights(dataArray));
        break;
    }

    return insights;
  }

  generateRecommendations(intent, rawData) {
    const recommendations = [];
    const dataArray = this.normalizeDataArray(rawData);
    
    if (dataArray.length === 0) {
      recommendations.push("🔍 **Immediate Action**: Review financial reporting pipeline and ensure all systems are capturing transactions properly.");
      return recommendations;
    }

    // Add base recommendations
    recommendations.push(...super.generateRecommendations(intent, rawData));

    // Intent-specific recommendations
    switch (intent) {
      case 'financial_health_overview':
        recommendations.push(...this.recommendFinancialActions(dataArray));
        break;
      
      case 'cash_flow_analysis':
        recommendations.push(...this.recommendCashFlowActions(dataArray));
        break;
      
      case 'budget_variance':
        recommendations.push(...this.recommendBudgetActions(dataArray));
        break;
      
      case 'accounts_receivable_aging':
        recommendations.push(...this.recommendARActions(dataArray));
        break;
    }

    return recommendations;
  }

  // Specific summary generators
  generateFinancialHealthSummary(dataArray) {
    const totalRevenue = dataArray.reduce((sum, item) => sum + (parseFloat(item.revenue) || parseFloat(item.amount) || 0), 0);
    const totalExpenses = dataArray.reduce((sum, item) => sum + (parseFloat(item.expenses) || parseFloat(item.cost) || 0), 0);
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue * 100) : 0;

    if (profitMargin > 20) {
      return `🏆 **Excellent Financial Health**: Strong profit margin of ${profitMargin.toFixed(1)}% with UGX ${netIncome.toLocaleString()} net income from UGX ${totalRevenue.toLocaleString()} revenue. Business is highly profitable and sustainable.`;
    } else if (profitMargin > 10) {
      return `✅ **Healthy Financial Position**: Solid ${profitMargin.toFixed(1)}% profit margin generating UGX ${netIncome.toLocaleString()} net income. Good foundation with optimization opportunities.`;
    } else if (profitMargin > 0) {
      return `⚠️ **Thin Profit Margins**: Low ${profitMargin.toFixed(1)}% margin with UGX ${netIncome.toLocaleString()} net income. Cost optimization and revenue enhancement needed.`;
    } else {
      return `🚨 **Financial Concern**: Negative margin of ${profitMargin.toFixed(1)}% indicates losses of UGX ${Math.abs(netIncome).toLocaleString()}. Immediate corrective action required.`;
    }
  }

  generateCashFlowSummary(dataArray) {
    const totalCashFlow = dataArray.reduce((sum, item) => sum + (parseFloat(item.cash_flow) || parseFloat(item.net_cash) || 0), 0);
    const operatingCashFlow = dataArray.reduce((sum, item) => sum + (parseFloat(item.operating_cash_flow) || 0), 0);
    
    if (totalCashFlow > 0 && operatingCashFlow > 0) {
      return `💰 **Strong Cash Position**: Positive cash flow of UGX ${totalCashFlow.toLocaleString()} with UGX ${operatingCashFlow.toLocaleString()} from operations. Excellent liquidity for growth investments.`;
    } else if (totalCashFlow > 0) {
      return `✅ **Positive Cash Flow**: UGX ${totalCashFlow.toLocaleString()} net cash flow provides working capital, though operational efficiency could improve.`;
    } else {
      return `⚠️ **Cash Flow Pressure**: Negative cash flow of UGX ${Math.abs(totalCashFlow).toLocaleString()} requires immediate attention to working capital management.`;
    }
  }

  generateBudgetVarianceSummary(dataArray) {
    const totalBudget = dataArray.reduce((sum, item) => sum + (parseFloat(item.budget) || parseFloat(item.planned) || 0), 0);
    const totalActual = dataArray.reduce((sum, item) => sum + (parseFloat(item.actual) || parseFloat(item.spent) || 0), 0);
    const variance = totalActual - totalBudget;
    const variancePercent = totalBudget > 0 ? (variance / totalBudget * 100) : 0;

    if (Math.abs(variancePercent) < 5) {
      return `🎯 **Excellent Budget Control**: Actual spending within ${Math.abs(variancePercent).toFixed(1)}% of budget (UGX ${Math.abs(variance).toLocaleString()} variance). Strong financial discipline demonstrated.`;
    } else if (variancePercent > 0) {
      return `⚠️ **Budget Overrun**: Spending exceeded budget by ${variancePercent.toFixed(1)}% (UGX ${variance.toLocaleString()}). Review controls and reforecast needed.`;
    } else {
      return `💰 **Under Budget**: Spending ${Math.abs(variancePercent).toFixed(1)}% below budget, saving UGX ${Math.abs(variance).toLocaleString()}. Consider strategic reinvestment opportunities.`;
    }
  }

  generatePnLSummary(dataArray) {
    const totalRevenue = dataArray.reduce((sum, item) => sum + (parseFloat(item.revenue) || parseFloat(item.sales) || 0), 0);
    const regions = [...new Set(dataArray.map(item => item.region || item.location || 'Unknown'))];
    
    const bestRegion = dataArray.reduce((max, current) => {
      const currentRevenue = parseFloat(current.revenue) || parseFloat(current.sales) || 0;
      const maxRevenue = parseFloat(max.revenue) || parseFloat(max.sales) || 0;
      return currentRevenue > maxRevenue ? current : max;
    }, dataArray[0]);

    return `📊 **Regional P&L Analysis**: UGX ${totalRevenue.toLocaleString()} total revenue across ${regions.length} regions. ${bestRegion.region || bestRegion.location || 'Top region'} leads performance with strong contribution to overall profitability.`;
  }

  generateROISummary(dataArray) {
    const avgROI = dataArray.reduce((sum, item) => sum + (parseFloat(item.roi) || parseFloat(item.return) || 0), 0) / dataArray.length;
    const investments = dataArray.filter(item => (parseFloat(item.roi) || 0) > 0);
    
    if (avgROI > 20) {
      return `🚀 **Outstanding Investment Returns**: Average ROI of ${avgROI.toFixed(1)}% across ${investments.length} investments significantly exceeds market benchmarks. Excellent capital allocation decisions.`;
    } else if (avgROI > 10) {
      return `✅ **Solid Investment Performance**: ${avgROI.toFixed(1)}% average ROI from ${investments.length} investments shows good capital efficiency and strategic decision-making.`;
    } else if (avgROI > 0) {
      return `⚠️ **Modest Returns**: ${avgROI.toFixed(1)}% average ROI indicates conservative performance. Review investment strategy for optimization opportunities.`;
    } else {
      return `🚨 **Investment Concern**: Negative average ROI suggests poor investment decisions. Immediate portfolio review and strategy adjustment required.`;
    }
  }

  generateARAgingSummary(dataArray) {
    const totalAR = dataArray.reduce((sum, item) => sum + (parseFloat(item.amount) || parseFloat(item.outstanding) || 0), 0);
    const overdueAR = dataArray.filter(item => (parseInt(item.days_outstanding) || 0) > 90);
    const overdueAmount = overdueAR.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const overduePercent = totalAR > 0 ? (overdueAmount / totalAR * 100) : 0;

    if (overduePercent < 5) {
      return `✅ **Excellent Collections**: Only ${overduePercent.toFixed(1)}% of receivables (UGX ${overdueAmount.toLocaleString()}) overdue beyond 90 days. Strong credit management and collection processes.`;
    } else if (overduePercent < 15) {
      return `⚠️ **Collection Attention Needed**: ${overduePercent.toFixed(1)}% of receivables (UGX ${overdueAmount.toLocaleString()}) overdue. Enhance collection efforts and credit policies.`;
    } else {
      return `🚨 **Collection Crisis**: ${overduePercent.toFixed(1)}% of receivables (UGX ${overdueAmount.toLocaleString()}) significantly overdue. Immediate collection action and credit review required.`;
    }
  }

  // Insight analyzers
  analyzeFinancialHealthInsights(dataArray) {
    const insights = [];
    
    const revenues = dataArray.map(item => parseFloat(item.revenue) || parseFloat(item.amount) || 0);
    const expenses = dataArray.map(item => parseFloat(item.expenses) || parseFloat(item.cost) || 0);
    
    const revenueGrowth = this.calculateGrowthTrend(revenues);
    const expenseGrowth = this.calculateGrowthTrend(expenses);
    
    if (revenueGrowth > expenseGrowth + 5) {
      insights.push(`📈 **Positive Leverage**: Revenue growing faster than expenses indicates improving operational efficiency and scalability.`);
    } else if (expenseGrowth > revenueGrowth + 5) {
      insights.push(`⚠️ **Cost Inflation**: Expenses growing faster than revenue suggests margin compression and need for cost control.`);
    }

    const avgMargin = dataArray.reduce((sum, item) => {
      const rev = parseFloat(item.revenue) || parseFloat(item.amount) || 0;
      const exp = parseFloat(item.expenses) || parseFloat(item.cost) || 0;
      return sum + (rev > 0 ? ((rev - exp) / rev) : 0);
    }, 0) / dataArray.length;

    if (avgMargin > 0.25) {
      insights.push(`💰 **Strong Profitability**: Average margin of ${(avgMargin * 100).toFixed(1)}% indicates excellent cost management and pricing power.`);
    }

    return insights;
  }

  analyzeCashFlowInsights(dataArray) {
    const insights = [];
    
    const operatingCashFlows = dataArray.map(item => parseFloat(item.operating_cash_flow) || 0);
    const avgOperatingCF = operatingCashFlows.reduce((a, b) => a + b, 0) / operatingCashFlows.length;
    
    if (avgOperatingCF > 0) {
      insights.push(`✅ **Operational Strength**: Positive operating cash flow demonstrates core business profitability and sustainability.`);
    } else {
      insights.push(`🚨 **Operational Concern**: Negative operating cash flow indicates fundamental business model issues requiring immediate attention.`);
    }

    return insights;
  }

  analyzeBudgetInsights(dataArray) {
    const insights = [];
    
    const variances = dataArray.map(item => {
      const budget = parseFloat(item.budget) || parseFloat(item.planned) || 0;
      const actual = parseFloat(item.actual) || parseFloat(item.spent) || 0;
      return budget > 0 ? ((actual - budget) / budget) : 0;
    });

    const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
    const varianceStdDev = Math.sqrt(variances.reduce((acc, val) => acc + Math.pow(val - avgVariance, 2), 0) / variances.length);

    if (varianceStdDev > 0.2) {
      insights.push(`📊 **Forecasting Challenge**: High variance in budget accuracy suggests need for improved planning processes and assumptions.`);
    } else {
      insights.push(`🎯 **Reliable Forecasting**: Consistent budget performance indicates strong planning and execution capabilities.`);
    }

    return insights;
  }

  analyzeROIInsights(dataArray) {
    const insights = [];
    
    const rois = dataArray.map(item => parseFloat(item.roi) || parseFloat(item.return) || 0);
    const positiveROIs = rois.filter(roi => roi > 0);
    const successRate = rois.length > 0 ? (positiveROIs.length / rois.length) : 0;

    if (successRate > 0.8) {
      insights.push(`🎯 **Investment Excellence**: ${(successRate * 100).toFixed(0)}% of investments showing positive returns demonstrates strong due diligence and selection criteria.`);
    } else if (successRate < 0.5) {
      insights.push(`⚠️ **Investment Review Needed**: Only ${(successRate * 100).toFixed(0)}% of investments profitable. Reassess investment criteria and decision processes.`);
    }

    return insights;
  }

  analyzeARInsights(dataArray) {
    const insights = [];
    
    const daysOutstanding = dataArray.map(item => parseInt(item.days_outstanding) || 0);
    const avgDSO = daysOutstanding.reduce((a, b) => a + b, 0) / daysOutstanding.length;
    
    if (avgDSO < 30) {
      insights.push(`⚡ **Efficient Collections**: Average ${avgDSO.toFixed(0)} days outstanding well below industry standards. Excellent cash conversion cycle.`);
    } else if (avgDSO > 60) {
      insights.push(`⚠️ **Collection Delays**: ${avgDSO.toFixed(0)} days outstanding above optimal range. Working capital efficiency impacted.`);
    }

    return insights;
  }

  // Recommendation generators
  recommendFinancialActions(dataArray) {
    const recommendations = [];
    
    const avgMargin = dataArray.reduce((sum, item) => {
      const rev = parseFloat(item.revenue) || parseFloat(item.amount) || 0;
      const exp = parseFloat(item.expenses) || parseFloat(item.cost) || 0;
      return sum + (rev > 0 ? ((rev - exp) / rev) : 0);
    }, 0) / dataArray.length;

    if (avgMargin < 0.15) {
      recommendations.push(`💡 **Margin Improvement**: Focus on cost optimization and pricing strategies to improve margins above 15% threshold.`);
    } else if (avgMargin > 0.25) {
      recommendations.push(`🚀 **Growth Investment**: Strong margins provide opportunity for strategic reinvestment in growth initiatives.`);
    }

    return recommendations;
  }

  recommendCashFlowActions(dataArray) {
    const recommendations = [];
    
    const totalCashFlow = dataArray.reduce((sum, item) => sum + (parseFloat(item.cash_flow) || parseFloat(item.net_cash) || 0), 0);
    
    if (totalCashFlow < 0) {
      recommendations.push(`🎯 **Working Capital Focus**: Accelerate collections, optimize inventory levels, and negotiate extended payment terms with suppliers.`);
    } else {
      recommendations.push(`💰 **Cash Deployment**: Consider strategic investments, debt reduction, or dividend distributions given strong cash position.`);
    }

    return recommendations;
  }

  recommendBudgetActions(dataArray) {
    const recommendations = [];
    
    const overBudget = dataArray.filter(item => {
      const budget = parseFloat(item.budget) || parseFloat(item.planned) || 0;
      const actual = parseFloat(item.actual) || parseFloat(item.spent) || 0;
      return actual > budget * 1.1; // More than 10% over
    });

    if (overBudget.length > 0) {
      recommendations.push(`🔧 **Budget Controls**: Implement stricter approval processes and real-time monitoring for ${overBudget.length} budget categories showing significant overruns.`);
    }

    return recommendations;
  }

  recommendARActions(dataArray) {
    const recommendations = [];
    
    const highRisk = dataArray.filter(item => (parseInt(item.days_outstanding) || 0) > 120);
    if (highRisk.length > 0) {
      recommendations.push(`🎯 **Collection Priority**: Focus on ${highRisk.length} accounts with 120+ days outstanding. Consider collection agencies or write-off evaluations.`);
    }

    return recommendations;
  }

  // Helper methods
  calculateGrowthTrend(values) {
    if (values.length < 2) return 0;
    const first = values[0] || 1;
    const last = values[values.length - 1] || 1;
    return ((last - first) / first) * 100;
  }
}