import { generateLeadGenData } from "./leadGenData.js";

// Controller for Lead Gen Efficiency + Funnel + Time-to-Qualification
export const getLeadGenEfficiency = (req, res) => {
  try {
    const data = generateLeadGenData(300);

    // --- Apply filters ---
    let filtered = data;
    const { campaign, channel, stage } = req.query;

    if (campaign) {
      const campaigns = campaign.split(",");
      filtered = filtered.filter(d => campaigns.includes(d.Campaign_Name));
    }

    if (channel) {
      const channels = channel.split(",");
      filtered = filtered.filter(d => channels.includes(d.Channel));
    }

    if (stage) {
      const stages = stage.split(",");
      filtered = filtered.filter(d => stages.includes(d.Stage));
    }

    // --- Deduplicate by Lead_ID for totals and breakdowns ---
    const uniqueLeadsMap = {};
    filtered.forEach(d => {
      if (!uniqueLeadsMap[d.Lead_ID]) uniqueLeadsMap[d.Lead_ID] = d;
    });
    const uniqueLeads = Object.values(uniqueLeadsMap);

    // --- Monthly stats (CPL per month) ---
    const monthlyStats = {};
    uniqueLeads.forEach(d => {
      if (!d.Lead_Created_Date) return;
      const month = d.Lead_Created_Date.slice(0, 7);
      if (!monthlyStats[month]) monthlyStats[month] = { spend: 0, leads: 0 };
      monthlyStats[month].spend += d.Spend;
      monthlyStats[month].leads += 1;
    });

    const cplPerMonth = Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      leads: stats.leads,
      spend: stats.spend.toFixed(2),
      cpl: stats.leads > 0 ? (stats.spend / stats.leads).toFixed(2) : "0.00",
    }));

    // --- Campaign-level breakdown ---
    const campaignStats = {};
    uniqueLeads.forEach(d => {
      if (!campaignStats[d.Campaign_Name]) {
        campaignStats[d.Campaign_Name] = { channel: d.Channel, leads: 0, spend: 0 };
      }
      campaignStats[d.Campaign_Name].leads += 1;
      campaignStats[d.Campaign_Name].spend += d.Spend;
    });

    const campaignBreakdown = Object.entries(campaignStats).map(([name, stats]) => ({
      campaignName: name,
      channel: stats.channel,
      leads: stats.leads,
      spend: stats.spend.toFixed(2),
      cpl: stats.leads > 0 ? (stats.spend / stats.leads).toFixed(2) : "0.00",
    }));

    // --- Channel-level breakdown ---
    const channelStats = {};
    uniqueLeads.forEach(d => {
      if (!channelStats[d.Channel]) channelStats[d.Channel] = { leads: 0, spend: 0 };
      channelStats[d.Channel].leads += 1;
      channelStats[d.Channel].spend += d.Spend;
    });

    const channelBreakdown = Object.entries(channelStats).map(([channel, stats]) => ({
      channel,
      leads: stats.leads,
      spend: stats.spend.toFixed(2),
      cpl: stats.leads > 0 ? (stats.spend / stats.leads).toFixed(2) : "0.00",
    }));

    // --- Funnel Conversion Logic (use full dataset for accuracy) ---
    const funnelStages = ["Lead", "MQL", "SQL", "Customer"];
    const stageCounts = {};
    funnelStages.forEach(stage => {
      stageCounts[stage] = new Set(data.filter(d => d.Stage === stage).map(d => d.Lead_ID));
    });

    const funnel = [];
    let prevCount = null;
    funnelStages.forEach(stage => {
      const count = stageCounts[stage].size;
      const dropOff = prevCount !== null ? prevCount - count : 0;
      const percentage = prevCount ? ((count / prevCount) * 100).toFixed(2) : "100.00";
      funnel.push({ stage, count, dropOff, percentage });
      prevCount = count;
    });

    // --- Time-to-Qualification Metrics ---
    const qualifiedLeads = uniqueLeads.filter(l => l.Days_to_Qualification != null);
    const avg = arr => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
    const med = arr => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };

    const allTimes = qualifiedLeads.map(l => l.Days_to_Qualification);
    const timeMetrics = {
      averageDays: avg(allTimes).toFixed(2),
      medianDays: med(allTimes).toFixed(2),
      totalQualifiedLeads: qualifiedLeads.length,
    };

    // --- Time by Campaign ---
    const campaignTimes = {};
    qualifiedLeads.forEach(l => {
      if (!campaignTimes[l.Campaign_Name]) campaignTimes[l.Campaign_Name] = [];
      campaignTimes[l.Campaign_Name].push(l.Days_to_Qualification);
    });

    const timeByCampaign = Object.entries(campaignTimes).map(([name, times]) => ({
      campaignName: name,
      averageDays: avg(times).toFixed(2),
      medianDays: med(times).toFixed(2),
      qualifiedLeads: times.length,
    }));

    // --- Time by Channel ---
    const channelTimes = {};
    qualifiedLeads.forEach(l => {
      if (!channelTimes[l.Channel]) channelTimes[l.Channel] = [];
      channelTimes[l.Channel].push(l.Days_to_Qualification);
    });

    const timeByChannel = Object.entries(channelTimes).map(([channel, times]) => ({
      channel,
      averageDays: avg(times).toFixed(2),
      medianDays: med(times).toFixed(2),
      qualifiedLeads: times.length,
    }));

    // --- Response ---
    res.json({
      totalLeads: uniqueLeads.length,
      totalSpend: uniqueLeads.reduce((sum, d) => sum + d.Spend, 0).toFixed(2),
      cplPerMonth,
      breakdown: { campaignBreakdown, channelBreakdown },
      funnel,
      timeMetrics,
      timeByCampaign,
      timeByChannel,
      totalRecords: uniqueLeads,
    });

  } catch (error) {
    console.error("Error fetching lead gen efficiency:", error);
    res.status(500).json({
      message: "Failed to fetch lead gen efficiency",
      error: error.message,
    });
  }
};
