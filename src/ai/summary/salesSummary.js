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
  
  const channelRevenue = {};
  data.forEach(item => {
    const channel = item.channel || item.marketing_channel || item.segment || 'Unknown';
    const revenue = parseFloat(item.revenue) || parseFloat(item.attributed_revenue) || parseFloat(item.amount) || 0;
    channelRevenue[channel] = (channelRevenue[channel] || 0) + revenue;
  });
  
  const totalRevenue = Object.values(channelRevenue).reduce((a, b) => a + b, 0);
  
  if (totalRevenue === 0) {
    return `Revenue Attribution: ${data.length} attribution records analyzed.`;
  }
  
  const topChannels = Object.entries(channelRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([channel, rev]) => `${channel}: UGX ${rev.toLocaleString()} (${((rev/totalRevenue)*100).toFixed(1)}%)`)
    .join(', ');
    
  return `Revenue Attribution: UGX ${totalRevenue.toLocaleString()} total attributed. Top channels: ${topChannels}.`;
}

function summarizeConversionFunnels(data) {
  if (!Array.isArray(data) || data.length === 0) return "No conversion funnel data found.";
  
  const totalVisitors = data.reduce((sum, item) => sum + (item.visitors || item.leads || item.impressions || 0), 0);
  const totalConversions = data.reduce((sum, item) => sum + (item.conversions || item.sales || item.closed_deals || 0), 0);
  const overallConversionRate = totalVisitors > 0 ? (totalConversions / totalVisitors * 100).toFixed(2) : 0;
  
  // Find best performing channel
  const channelRates = data.map(item => ({
    channel: item.channel || item.source || 'Unknown',
    rate: item.visitors > 0 ? ((item.conversions || 0) / item.visitors * 100) : 0
  })).sort((a, b) => b.rate - a.rate);
  
  const bestChannel = channelRates[0];
  
  return `Conversion Funnels: ${totalVisitors.toLocaleString()} total visitors, ${totalConversions.toLocaleString()} conversions. Overall rate: ${overallConversionRate}%. Best channel: ${bestChannel?.channel} (${bestChannel?.rate.toFixed(1)}%).`;
}

function summarizeQuotaAttainment(data) {
  // Handle SupervisorSalesAnalytics response structure
  let quotaData = data;
  if (data && data.reps && Array.isArray(data.reps)) {
    quotaData = data.reps;
  }
  
  if (!Array.isArray(quotaData) || quotaData.length === 0) return "No quota attainment data found.";
  
  const totalReps = quotaData.length;
  const repsMetQuota = quotaData.filter(rep => {
    const attainment = rep.attainment_percentage || rep.quota_attainment || 
                     (rep.achieved_revenue && rep.target_quota ? (rep.achieved_revenue / rep.target_quota * 100) : 0);
    return attainment >= 100;
  }).length;
  
  const avgAttainment = quotaData.reduce((sum, rep) => {
    const attainment = rep.attainment_percentage || rep.quota_attainment || 
                      (rep.achieved_revenue && rep.target_quota ? (rep.achieved_revenue / rep.target_quota * 100) : 0);
    return sum + attainment;
  }, 0) / totalReps;
  
  const topPerformer = quotaData.reduce((top, rep) => {
    const repAttainment = rep.attainment_percentage || rep.quota_attainment || 
                         (rep.achieved_revenue && rep.target_quota ? (rep.achieved_revenue / rep.target_quota * 100) : 0);
    const topAttainment = top.attainment_percentage || top.quota_attainment || 
                         (top.achieved_revenue && top.target_quota ? (top.achieved_revenue / top.target_quota * 100) : 0);
    return repAttainment > topAttainment ? rep : top;
  });
  
  const topAttainment = topPerformer.attainment_percentage || topPerformer.quota_attainment || 
                       (topPerformer.achieved_revenue && topPerformer.target_quota ? (topPerformer.achieved_revenue / topPerformer.target_quota * 100) : 0);
  
  return `Quota Attainment: ${repsMetQuota}/${totalReps} reps met quota. Average attainment: ${avgAttainment.toFixed(1)}%. Top performer: ${topPerformer.rep_name || topPerformer.name || 'Unknown'} (${topAttainment.toFixed(1)}%).`;
}

function summarizeAccountPenetration(data) {
  // Handle SupervisorSalesAnalytics response structure
  let accountData = data;
  if (data && data.accounts && Array.isArray(data.accounts)) {
    accountData = data.accounts;
  }
  
  if (!Array.isArray(accountData) || accountData.length === 0) return "No account penetration data found.";
  
  const total = accountData.length;
  const active = accountData.filter(a => (a.active_opportunities || a.opportunities || 0) > 0).length;
  const avgContacts = accountData.reduce((sum, a) => sum + (a.contacts_engaged || a.contacts || 0), 0) / total;
  
  return `Account penetration: ${active}/${total} accounts with active opportunities. Avg contacts engaged: ${avgContacts.toFixed(1)}.`;
}

function summarizeCorporateAccountHealth(data) {
  // Handle SupervisorSalesAnalytics response structure
  let accountData = data;
  if (data && data.accounts && Array.isArray(data.accounts)) {
    accountData = data.accounts;
  }
  
  if (!Array.isArray(accountData) || accountData.length === 0) return "No corporate account health data found.";
  
  const total = accountData.length;
  const highChurn = accountData.filter(a => a.churn_risk === "High" || a.risk_level === "High").length;
  const avgNPS = accountData.reduce((sum, a) => sum + (a.NPS_score || a.nps || 0), 0) / total;
  
  return `Corporate account health: ${total} accounts. High churn risk: ${highChurn}. Avg NPS: ${avgNPS.toFixed(1)}.`;
}

function summarizeTerritoryPerformanceFull(data) {
  if (!Array.isArray(data) || data.length === 0) return "No territory performance data found.";
  
  const totalTerritories = data.length;
  const totalRevenue = data.reduce((sum, t) => sum + (t.revenue || t.sales || 0), 0);
  const avgRevenue = totalRevenue / totalTerritories;
  
  // Find top and bottom territories
  const sortedTerritories = data.sort((a, b) => (b.revenue || b.sales || 0) - (a.revenue || a.sales || 0));
  const topTerritory = sortedTerritories[0];
  const bottomTerritory = sortedTerritories[sortedTerritories.length - 1];
  
  return `Territory Performance: ${totalTerritories} territories, UGX ${totalRevenue.toLocaleString()} total revenue. Average: UGX ${avgRevenue.toFixed(0)}. Top: ${topTerritory.territory || topTerritory.name || 'Unknown'} (UGX ${(topTerritory.revenue || topTerritory.sales || 0).toLocaleString()}), Bottom: ${bottomTerritory.territory || bottomTerritory.name || 'Unknown'} (UGX ${(bottomTerritory.revenue || bottomTerritory.sales || 0).toLocaleString()}).`;
}

function summarizeClientLifetimeValue(data) {
  if (!Array.isArray(data) || data.length === 0) return "No client lifetime value data found.";
  
  const totalClients = data.length;
  const totalCLV = data.reduce((sum, client) => sum + (client.lifetime_value || client.clv || 0), 0);
  const avgCLV = totalCLV / totalClients;
  
  const topClient = data.reduce((top, client) => 
    (client.lifetime_value || client.clv || 0) > (top.lifetime_value || top.clv || 0) ? client : top
  );
  
  return `Client Lifetime Value: avg CLV UGX ${avgCLV.toFixed(0)}. Top customer: ${topClient.client_name || topClient.name || 'Unknown'} (UGX ${(topClient.lifetime_value || topClient.clv || 0).toLocaleString()}).`;
}

function summarizeLeadGeneration(data) {
  // Handle lead-efficiency endpoint response structure
  if (!data) return "No lead generation data found.";
  
  // Check if data has the lead-efficiency API structure
  if (data.totalLeads !== undefined && data.totalSpend !== undefined) {
    const totalLeads = data.totalLeads || 0;
    const totalSpend = parseFloat(data.totalSpend) || 0;
    const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
    
    // Extract campaign breakdown if available
    let topCampaigns = "No breakdown available";
    if (data.breakdown && data.breakdown.campaignBreakdown) {
      topCampaigns = data.breakdown.campaignBreakdown
        .slice(0, 3)
        .map(c => `${c.campaignName}: ${c.leads} leads (UGX ${parseFloat(c.cpl).toFixed(0)} CPL)`)
        .join(', ');
    }
    
    return `Lead Generation: ${totalLeads.toLocaleString()} total leads, UGX ${totalSpend.toLocaleString()} spend, UGX ${costPerLead.toFixed(0)} cost per lead. Top campaigns: ${topCampaigns}.`;
  }
  
  // Fallback for array data structure
  if (!Array.isArray(data) || data.length === 0) return "No lead generation data found.";
  
  const totalLeads = data.reduce((sum, item) => sum + (item.leads_generated || item.leads || 0), 0);
  const totalSpend = data.reduce((sum, item) => sum + (item.spend || item.cost || 0), 0);
  const costPerLead = totalSpend > 0 ? totalSpend / totalLeads : 0;
  
  // Get top performing campaigns
  const topCampaigns = data
    .sort((a, b) => (b.leads_generated || b.leads || 0) - (a.leads_generated || a.leads || 0))
    .slice(0, 3)
    .map(c => `${c.campaign_name || c.name || 'Campaign'}: ${c.leads_generated || c.leads || 0} leads`)
    .join(', ');
  
  return `Lead Generation: ${totalLeads.toLocaleString()} total leads, UGX ${totalSpend.toLocaleString()} spend, UGX ${costPerLead.toFixed(0)} cost per lead. Top campaigns: ${topCampaigns}.`;
}

function summarizeABTests(data) {
  if (!Array.isArray(data) || data.length === 0) return "No A/B test data found.";
  
  const completedTests = data.filter(t => t.status === 'completed' || t.status === 'Complete');
  const winningTests = data.filter(t => (t.confidence || 0) > 95);
  
  const avgLiftWinners = winningTests.length > 0 
    ? winningTests.reduce((sum, t) => sum + (t.lift_percentage || 0), 0) / winningTests.length
    : 0;
  
  return `A/B Tests: ${data.length} tests total, ${completedTests.length} completed, ${winningTests.length} statistically significant winners. Average lift from winners: ${avgLiftWinners.toFixed(1)}%.`;
}

function summarizeBrandLift(data) {
  // Handle brand-lift endpoint response structure
  if (data && data.brandLiftTrendsByChannel) {
    const channels = Object.keys(data.brandLiftTrendsByChannel);
    const totalCampaigns = channels.reduce((sum, channel) => 
      sum + data.brandLiftTrendsByChannel[channel].length, 0);
    
    // Calculate average brand lift across all channels
    let totalLift = 0;
    let totalImpressions = 0;
    let count = 0;
    
    channels.forEach(channel => {
      data.brandLiftTrendsByChannel[channel].forEach(item => {
        totalLift += parseFloat(item.brandLiftFromBaseline) || 0;
        totalImpressions += item.impressions || 0;
        count++;
      });
    });
    
    const avgBrandLift = count > 0 ? totalLift / count : 0;
    const bestChannel = channels.length > 0 ? channels[0] : 'Unknown';
    
    return `Brand Lift: ${totalCampaigns} campaigns across ${channels.length} channels. Average brand lift: ${avgBrandLift.toFixed(1)}% from baseline. Total impressions: ${totalImpressions.toLocaleString()}. Best performing channel: ${bestChannel}.`;
  }
  
  // Fallback for array data structure  
  if (!Array.isArray(data) || data.length === 0) return "No brand lift data found.";
  
  const avgBrandLift = data.reduce((sum, item) => sum + (item.brand_lift || item.lift_percentage || 0), 0) / data.length;
  const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
  
  // Get channels with highest lift
  const channelLift = {};
  data.forEach(item => {
    const channel = item.channel || 'Unknown';
    if (!channelLift[channel]) channelLift[channel] = [];
    channelLift[channel].push(item.brand_lift || item.lift_percentage || 0);
  });
  
  const topChannels = Object.entries(channelLift)
    .map(([channel, lifts]) => ({ 
      channel, 
      avgLift: lifts.reduce((a, b) => a + b, 0) / lifts.length 
    }))
    .sort((a, b) => b.avgLift - a.avgLift)
    .slice(0, 2)
    .map(c => `${c.channel}: ${c.avgLift.toFixed(1)}%`)
    .join(', ');
  
  return `Brand Lift: ${avgBrandLift.toFixed(1)}% average lift, ${totalImpressions.toLocaleString()} total impressions. Top channels: ${topChannels}.`;
}

function summarizeSimpleList(data, label) {
  if (!data || !Array.isArray(data)) return `No ${label} data found.`;
  return `${label}: ${data.length} records found.`;
}

function generateSalesSummary(intent, data) {
  console.log('🎯 generateSalesSummary called with intent:', intent);
  console.log('📊 Data received:', data ? (Array.isArray(data) ? `Array(${data.length})` : typeof data) : 'null/undefined');
  
  if (!data) {
    console.log('⚠️ No data received for intent:', intent);
    return `No data available for ${intent}.`;
  }
  
  console.log('📊 Data type:', typeof data, 'Array:', Array.isArray(data), 'Length:', Array.isArray(data) ? data.length : 'N/A');
  if (Array.isArray(data) && data.length > 0) {
    console.log('🔍 First item keys:', Object.keys(data[0]));
  }
  
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
    sales_pipeline_status: summarizePipelineVelocity,

    // AI intent aliases
    campaign_roi_summary: summarizeCampaignROI,
    revenue_attribution_analysis: summarizeRevenueAttribution,
    conversion_funnel_performance: summarizeConversionFunnels,
    quota_achievement_count: summarizeQuotaAttainment,
    territory_performance_analysis: summarizeTerritoryPerformanceFull,

    // Pipeline KPIs
    pipeline_velocity_kpis: (d) => summarizeSimpleList(d, "Pipeline KPIs"),
    pipeline_kpis: (d) => summarizeSimpleList(d, "Pipeline KPIs"),

    // Quota Attainment
    quota_attainment: summarizeQuotaAttainment,
    quota_achievement: summarizeQuotaAttainment,
    quota_attainment_by_rep: summarizeQuotaAttainment,
    target_achievement: summarizeQuotaAttainment,
    sales_performance_vs_targets: summarizeQuotaAttainment,
    sales_target_performance: summarizeQuotaAttainment,
    sales_performance_against_targets: summarizeQuotaAttainment,
    quota_attainment_kpis: (d) => summarizeSimpleList(d, "Quota KPIs"),
    quota_kpis: (d) => summarizeSimpleList(d, "Quota KPIs"),

    // Account Penetration
    account_penetration: summarizeAccountPenetration,
    account_penetration_metrics: summarizeAccountPenetration,
    account_analysis: summarizeAccountPenetration,
    key_account_penetration_analysis: summarizeAccountPenetration,
    
    // Corporate Account Health
    corporate_account_health: summarizeCorporateAccountHealth,
    account_health: summarizeCorporateAccountHealth,
    corporate_accounts: summarizeCorporateAccountHealth,
    enterprise_client_health_metrics: summarizeCorporateAccountHealth,

    // Lead Generation
    lead_generation: summarizeLeadGeneration,
    lead_generation_performance: summarizeLeadGeneration,
    lead_gen_metrics: summarizeLeadGeneration,
    lead_performance: summarizeLeadGeneration,
    leads_generated: summarizeLeadGeneration,
    lead_acquisition: summarizeLeadGeneration,
    lead_generation_analysis: summarizeLeadGeneration,
    
    // A/B Testing 
    ab_test_analysis: summarizeABTests,
    ab_testing_results: summarizeABTests,
    a_b_test_performance: summarizeABTests,
    ab_test_metrics: summarizeABTests,
    test_performance: summarizeABTests,
    ab_testing: summarizeABTests,

    // Brand Lift
    brand_lift_analysis: summarizeBrandLift,
    brand_lift_metrics: summarizeBrandLift,
    brand_awareness_lift: summarizeBrandLift,
    brand_lift: summarizeBrandLift,
    brand_lift_performance: summarizeBrandLift,

    // Territory Performance
    territory_performance: summarizeTerritoryPerformanceFull,
    territory_analysis: summarizeTerritoryPerformanceFull,
    territory_sales: summarizeTerritoryPerformanceFull,
    sales_by_territory: summarizeTerritoryPerformanceFull,
    regional_performance: summarizeTerritoryPerformanceFull,
    territory_metrics: summarizeTerritoryPerformanceFull,

    // Campaign ROI
    campaign_roi: summarizeCampaignROI,
    roi_analysis: summarizeCampaignROI,
    campaign_effectiveness: summarizeCampaignROI,
    marketing_roi: summarizeCampaignROI,
    campaign_performance: summarizeCampaignROI,
    campaign_analysis: summarizeCampaignROI,
    marketing_performance: summarizeCampaignROI,
    campaign_metrics: summarizeCampaignROI,

    // Revenue Attribution
    revenue_attribution: summarizeRevenueAttribution,
    channel_attribution: summarizeRevenueAttribution,
    attribution_analysis: summarizeRevenueAttribution,
    revenue_by_channel: summarizeRevenueAttribution,
    revenue_breakdown_by_marketing_channel: summarizeRevenueAttribution,
    revenue_breakdown_by_channel: summarizeRevenueAttribution,

    // Conversion Funnels
    conversion_funnel_analysis: summarizeConversionFunnels,
    conversion_rate_metrics: summarizeConversionFunnels,
    conversion_rate_by_channel: summarizeConversionFunnels,
    conversion_rates_by_channel: summarizeConversionFunnels,
    sales_conversion_metrics: summarizeConversionFunnels,
    conversion_metrics: summarizeConversionFunnels,
    funnel_analysis: summarizeConversionFunnels,
    lead_conversion_rate: summarizeConversionFunnels,

    // Client Lifetime Value
    client_lifetime_value_analysis: summarizeClientLifetimeValue,
    client_lifetime_value: summarizeClientLifetimeValue,
    customer_lifetime_value: summarizeClientLifetimeValue,
    customer_lifetime_value_analysis: summarizeClientLifetimeValue,
    customer_lifetime_value_metrics: summarizeClientLifetimeValue,
    clv_analysis: summarizeClientLifetimeValue,
    client_retention: summarizeClientLifetimeValue,
    
    // General sales query fallback
    sales_general_query: summarizePipelineVelocity,
    general_query: summarizePipelineVelocity,
  };
  
  const fn = intentMap[intent];
  console.log('📋 Intent found in map:', !!fn, 'for intent:', intent);
  if (fn) {
    try {
      const result = fn(data);
      console.log('✅ Summary generated successfully for intent:', intent);
      return result;
    } catch (error) {
      console.error('❌ Error generating summary for intent:', intent, error.message);
      // Return a safe fallback instead of error
      return `Sales summary for ${intent}: ${Array.isArray(data) ? data.length : 0} records available.`;
    }
  }
  
  // Fallback: create a generic summary for unknown intents
  console.log('⚠️ Using generic fallback for unknown intent:', intent);
  if (Array.isArray(data) && data.length > 0) {
    return `Sales analysis for ${intent}: ${data.length} records found. ${summarizeSimpleList(data, intent.replace(/_/g, ' '))}`;
  }
  return summarizePipelineVelocity(data);
}

export default generateSalesSummary;