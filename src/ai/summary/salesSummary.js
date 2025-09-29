// --- Sales Summary Functions ---
function summarizePipelineVelocity(data) {
  let deals = [];
  let totalCount = 0;
  if (Array.isArray(data)) {
    if (data.length > 0 && data[0].deals) {
      deals = data.flatMap(item => Array.isArray(item.deals) ? item.deals : []);
      totalCount = data[0].totalCount || deals.length;
    } else {
      deals = data;
      totalCount = deals.length;
    }
  } else if (data && Array.isArray(data.deals)) {
    deals = data.deals;
    totalCount = data.totalCount || deals.length;
  } else if (Array.isArray(data.data) && Array.isArray(data.data[0]?.deals)) {
    deals = data.data[0].deals;
    totalCount = data.data[0].totalCount || deals.length;
  }
  if (deals.length === 0) return "No sales deals found for your query.";
  const stageCounts = {};
  deals.forEach(deal => {
    stageCounts[deal.stage] = (stageCounts[deal.stage] || 0) + 1;
  });
  let summary = `Sales pipeline: ${totalCount} deals. `;
  summary += Object.entries(stageCounts).map(([stage, count]) => `${count} ${stage}`).join(", ");
  return summary;
}

function summarizeCampaignROI(data) {
  if (!Array.isArray(data) || data.length === 0) return "No campaign data found.";
  // Accepts optional { startDate, endDate } in data._filters
  let campaigns = data;
  let startDate, endDate;
  if (data._filters) {
    startDate = data._filters.startDate ? new Date(data._filters.startDate) : null;
    endDate = data._filters.endDate ? new Date(data._filters.endDate) : null;
    campaigns = campaigns.filter(c => {
      const s = new Date(c.startDate);
      return (!startDate || s >= startDate) && (!endDate || s <= endDate);
    });
  }
  const totalCampaigns = campaigns.length;
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const totalCost = campaigns.reduce((sum, c) => sum + (c.cost || 0), 0);
  const avgROI = (totalRevenue - totalCost) / (totalCost || 1) * 100;
  return `Campaign ROI: ${totalCampaigns} campaigns, total revenue UGX ${totalRevenue.toLocaleString()}, total cost UGX ${totalCost.toLocaleString()}, avg ROI: ${avgROI.toFixed(1)}%.`;
}

function summarizeRevenueAttribution(data) {
  if (!Array.isArray(data) || data.length === 0) return "No revenue attribution data found.";
  let revenueData = data;
  let startDate, endDate;
  if (data._filters) {
    startDate = data._filters.startDate ? new Date(data._filters.startDate) : null;
    endDate = data._filters.endDate ? new Date(data._filters.endDate) : null;
    revenueData = revenueData.filter(d => {
      const dte = new Date(d.date);
      return (!startDate || dte >= startDate) && (!endDate || dte <= endDate);
    });
  }
  // Aggregate by segment
  const segmentTotals = {};
  revenueData.forEach(day => {
    (day.revenue || []).forEach(seg => {
      segmentTotals[seg.segment] = (segmentTotals[seg.segment] || 0) + seg.amount;
    });
  });
  const topSegments = Object.entries(segmentTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([seg, amt]) => `${seg}: UGX ${amt.toLocaleString()}`)
    .join(", ");
  return `Top revenue segments: ${topSegments}`;
}

function summarizeConversionFunnels(data) {
  if (!Array.isArray(data) || data.length === 0) return "No conversion funnel data found.";
  let funnels = data;
  let startDate, endDate;
  if (data._filters) {
    startDate = data._filters.startDate ? new Date(data._filters.startDate) : null;
    endDate = data._filters.endDate ? new Date(data._filters.endDate) : null;
    funnels = funnels.filter(f => {
      const dte = new Date(f.date);
      return (!startDate || dte >= startDate) && (!endDate || dte <= endDate);
    });
  }
  const totalVisits = funnels.reduce((sum, c) => sum + (c.visits || 0), 0);
  const totalLeads = funnels.reduce((sum, c) => sum + (c.leads || 0), 0);
  const totalOpportunities = funnels.reduce((sum, c) => sum + (c.opportunities || 0), 0);
  const totalConversions = funnels.reduce((sum, c) => sum + (c.conversions || 0), 0);
  const convRate = totalVisits ? (totalConversions / totalVisits) * 100 : 0;
  return `Conversion funnel: ${totalVisits} visits, ${totalLeads} leads, ${totalOpportunities} opportunities, ${totalConversions} conversions (overall rate: ${convRate.toFixed(1)}%).`;
}

function summarizeClientLifetimeValue(data) {
  if (!Array.isArray(data) || data.length === 0) return "No client lifetime value data found.";
  let customers = data;
  let startDate, endDate;
  if (data._filters) {
    startDate = data._filters.startDate ? new Date(data._filters.startDate) : null;
    endDate = data._filters.endDate ? new Date(data._filters.endDate) : null;
    customers = customers.filter(c => {
      const join = new Date(c.joinDate);
      return (!startDate || join >= startDate) && (!endDate || join <= endDate);
    });
  }
  const avgCLV = customers.reduce((sum, c) => sum + (c.clv || 0), 0) / (customers.length || 1);
  const topCustomer = customers.reduce((max, c) => (c.clv > (max.clv || 0) ? c : max), {});
  return `Client Lifetime Value: avg CLV UGX ${Math.round(avgCLV).toLocaleString()}. Top customer: ${topCustomer.name || topCustomer.customerId} (UGX ${topCustomer.clv?.toLocaleString() || 0}).`;
}

function summarizeTerritoryPerformance(data) {
  if (!Array.isArray(data) || data.length === 0) return "No territory performance data found.";
  // Group by region
  const regionTotals = {};
  data.forEach(row => {
    regionTotals[row.region] = (regionTotals[row.region] || 0) + (row.total_revenue || 0);
  });
  const topRegions = Object.entries(regionTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region, amt]) => `${region}: UGX ${amt.toLocaleString()}`)
    .join(", ");
  return `Top sales regions: ${topRegions}`;
}

// --- Quota Attainment ---
function summarizeQuotaAttainment(data) {
  if (!data || !Array.isArray(data.reps) || data.reps.length === 0) return "No quota attainment data found.";
  const totalReps = data.reps.length;
  const achieved = data.reps.filter(r => r.achieved_revenue >= r.target_quota).length;
  const avgPct = data.reps.reduce((sum, r) => sum + (r.achieved_revenue / (r.target_quota || 1)), 0) / totalReps * 100;
  return `Quota attainment: ${achieved}/${totalReps} reps met or exceeded quota. Avg attainment: ${avgPct.toFixed(1)}%.`;
}

function summarizeAccountPenetration(data) {
  if (!data || !Array.isArray(data.accounts) || data.accounts.length === 0) return "No account penetration data found.";
  const total = data.accounts.length;
  const active = data.accounts.filter(a => a.active_opportunities > 0).length;
  const avgContacts = data.accounts.reduce((sum, a) => sum + (a.contacts_engaged || 0), 0) / total;
  return `Account penetration: ${active}/${total} accounts with active opps. Avg contacts engaged: ${avgContacts.toFixed(1)}.`;
}

function summarizeCorporateAccountHealth(data) {
  if (!data || !Array.isArray(data.accounts) || data.accounts.length === 0) return "No corporate account health data found.";
  const total = data.accounts.length;
  const highChurn = data.accounts.filter(a => a.churn_risk === "High").length;
  const avgNPS = data.accounts.reduce((sum, a) => sum + (a.NPS_score || 0), 0) / total;
  return `Corporate account health: ${total} accounts. High churn risk: ${highChurn}. Avg NPS: ${avgNPS.toFixed(1)}.`;
}

function summarizeTerritoryPerformanceFull(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return "No territory performance data found.";
  let territories = data;
  let startDate, endDate;
  if (data._filters) {
    startDate = data._filters.startDate ? new Date(data._filters.startDate) : null;
    endDate = data._filters.endDate ? new Date(data._filters.endDate) : null;
    territories = territories.filter(t => {
      const dte = new Date(t.date);
      return (!startDate || dte >= startDate) && (!endDate || dte <= endDate);
    });
  }
  const regionTotals = {};
  territories.forEach(row => {
    regionTotals[row.region] = (regionTotals[row.region] || 0) + (row.total_revenue || 0);
  });
  const topRegions = Object.entries(regionTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([region, amt]) => `${region}: UGX ${amt.toLocaleString()}`)
    .join(", ");
  return `Top sales regions: ${topRegions}`;
}

function summarizeSimpleList(data, label) {
  if (!data || !Array.isArray(data) || data.length === 0) return `No ${label} data found.`;
  return `${label}: ${data.length} records.`;
}

function generateSalesSummary(intent, data) {
  if (!data) return "No sales data found.";
  const intentMap = {
    // Pipeline/velocity
    sales_performance: summarizePipelineVelocity,
    sales_performance_overview: summarizePipelineVelocity,
    sales_performance_this_quarter: summarizePipelineVelocity,
    sales_performance_summary: summarizePipelineVelocity,
    supervisor_sales: summarizePipelineVelocity,
    supervisor_sales_analytics: summarizePipelineVelocity,
    supervisor_sales_performance: summarizePipelineVelocity,
    pipeline_velocity: summarizePipelineVelocity,
    pipeline_analysis: summarizePipelineVelocity,

    // Pipeline KPIs
    pipeline_velocity_kpis: (d) => summarizeSimpleList(d, "Pipeline KPIs"),
    pipeline_kpis: (d) => summarizeSimpleList(d, "Pipeline KPIs"),

    // Quota Attainment
    quota_attainment: summarizeQuotaAttainment,
    quota_achievement: summarizeQuotaAttainment,
    target_achievement: summarizeQuotaAttainment,
    quota_attainment_kpis: (d) => summarizeSimpleList(d, "Quota KPIs"),
    quota_kpis: (d) => summarizeSimpleList(d, "Quota KPIs"),

    // Account Penetration
    account_penetration: summarizeAccountPenetration,
    account_analysis: summarizeAccountPenetration,
    account_penetration_kpis: (d) => summarizeSimpleList(d, "Account KPIs"),
    account_kpis: (d) => summarizeSimpleList(d, "Account KPIs"),

    // Corporate Account Health
    corporate_account_health: summarizeCorporateAccountHealth,
    account_health: summarizeCorporateAccountHealth,
    corporate_accounts: summarizeCorporateAccountHealth,
    corporate_account_health_kpis: (d) => summarizeSimpleList(d, "Account Health KPIs"),
    account_health_kpis: (d) => summarizeSimpleList(d, "Account Health KPIs"),

    // Territory Performance
    territory_performance: summarizeTerritoryPerformanceFull,
    territory_performance_metrics: summarizeTerritoryPerformanceFull,
    territory_analysis: summarizeTerritoryPerformanceFull,
    territory_metrics: summarizeTerritoryPerformanceFull,

    // Rate Card & Utilization
    rate_card_utilization: (d) => summarizeSimpleList(d, "Rate Card Utilization"),

    // Impression & Reach
    impression_shares: (d) => summarizeSimpleList(d, "Impression Shares"),

    // Campaign Attribution
    campaign_attribution: (d) => summarizeSimpleList(d, "Campaign Attribution"),

    // Lead Generation & Efficiency
    lead_efficiency: (d) => summarizeSimpleList(d, "Lead Efficiency"),
    lead_generation: (d) => summarizeSimpleList(d, "Lead Generation"),

    // Brand Lift
    brand_lift: (d) => summarizeSimpleList(d, "Brand Lift"),

    // A/B Testing
    ab_tests: (d) => summarizeSimpleList(d, "A/B Tests"),
    ab_testing: (d) => summarizeSimpleList(d, "A/B Tests"),

    // Contract Value
    contract_value_trends: (d) => summarizeSimpleList(d, "Contract Value Trends"),

    // Campaign ROI
    campaign_performance: summarizeCampaignROI,
    campaign_performance_overview: summarizeCampaignROI,
    marketing_performance: summarizeCampaignROI,
    campaign_roi: summarizeCampaignROI,
    marketing_campaigns: summarizeCampaignROI,
    campaign_analytics: summarizeCampaignROI,

    // Revenue Attribution
    revenue_attribution: summarizeRevenueAttribution,
    revenue_attribution_by_channel: summarizeRevenueAttribution,
    revenue_performance: summarizeRevenueAttribution,
    channel_attribution: summarizeRevenueAttribution,
    attribution_analysis: summarizeRevenueAttribution,

    // Conversion Funnels
    conversion_funnel_analysis: summarizeConversionFunnels,
    conversion_rate_metrics: summarizeConversionFunnels,
    conversion_rate_by_channel: summarizeConversionFunnels,
    sales_conversion_metrics: summarizeConversionFunnels,
    conversion_metrics: summarizeConversionFunnels,
    funnel_analysis: summarizeConversionFunnels,

    // Client Lifetime Value
    client_lifetime_value_analysis: summarizeClientLifetimeValue,
    client_lifetime_value: summarizeClientLifetimeValue,
    customer_lifetime_value: summarizeClientLifetimeValue,
    clv_analysis: summarizeClientLifetimeValue,
    client_retention: summarizeClientLifetimeValue,
  };
  const fn = intentMap[intent];
  if (fn) return fn(data);
  // Fallback: pipeline summary
  return summarizePipelineVelocity(data);
}

export default generateSalesSummary;
