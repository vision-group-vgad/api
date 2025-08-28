import { generateBrandLiftData } from "./brandLiftData.js";

export const getBrandLift = (req, res) => {
  try {
    const data = generateBrandLiftData(300);

    const { channel: channelFilter, campaign: campaignFilter } = req.query;

    // Apply optional filters
    let filteredData = data;
    if (channelFilter) {
      const channels = channelFilter.split(",");
      filteredData = filteredData.filter(d => channels.includes(d.Channel));
    }
    if (campaignFilter) {
      const campaigns = campaignFilter.split(",");
      filteredData = filteredData.filter(d => campaigns.includes(d.Campaign_Name));
    }

    // Aggregate by month + campaign + channel
    const stats = {};
    filteredData.forEach(entry => {
      const month = entry.Date.slice(0, 7);
      const key = `${entry.Channel}-${entry.Campaign_Name}-${month}`;

      if (!stats[key]) {
        stats[key] = {
          month,
          channel: entry.Channel,
          campaign: entry.Campaign_Name,
          impressions: 0,
          engagements: 0,
          surveyScores: []
        };
      }

      stats[key].impressions += entry.Impressions;
      stats[key].engagements += entry.Engagements;
      stats[key].surveyScores.push(entry.SurveyScore);
    });

    // Group by channel
    const channelGrouped = {};
    Object.values(stats).forEach(stat => {
      const engagementRate = stat.impressions > 0 ? (stat.engagements / stat.impressions) * 100 : 0;
      const avgSurveyScore = stat.surveyScores.length > 0
        ? stat.surveyScores.reduce((a, b) => a + b, 0) / stat.surveyScores.length
        : 40; // fallback baseline
      const brandLiftFromBaseline = avgSurveyScore - 40;

      if (!channelGrouped[stat.channel]) channelGrouped[stat.channel] = [];

      channelGrouped[stat.channel].push({
        month: stat.month,
        campaign: stat.campaign,
        impressions: stat.impressions,
        engagements: stat.engagements,
        engagementRate: engagementRate.toFixed(1) + '%',
        avgSurveyScore: avgSurveyScore.toFixed(1),
        brandLiftFromBaseline: brandLiftFromBaseline.toFixed(1)
      });
    });

    res.json({
      total: filteredData.length,
      baselineSurveyScore: 40,
      brandLiftTrendsByChannel: channelGrouped
    });

  } catch (error) {
    console.error("Error fetching brand lift:", error);
    res.status(500).json({
      message: "Failed to fetch brand lift",
      error: error.message,
    });
  }
};
