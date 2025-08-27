import { generateCampaignAttributionData } from "./campaignAttributionData.js";

export const getCampaignAttribution = (req, res) => {
  try {
    const data = generateCampaignAttributionData(300);

    // --- Apply filters (if any) ---
    let filtered = data;
    const { campaign, channel } = req.query;

    if (campaign) {
      const campaigns = campaign.split(",");
      filtered = filtered.filter(lead =>
        lead.Touchpoints.some(tp => campaigns.includes(tp))
      );
    }

    if (channel) {
      const channels = channel.split(",");
      filtered = filtered.filter(lead =>
        lead.Channels.some(ch => channels.includes(ch))
      );
    }

    // --- Campaign-level aggregation ---
    const campaignStats = {};

    filtered.forEach(lead => {
      const isConverted = lead.IsConverted;
      const creditPerCampaign = isConverted ? 1 / lead.Touchpoints.length : 0;

      lead.Touchpoints.forEach((campaignName, index) => {
        const channel = lead.Channels[index];

        if (!campaignStats[campaignName]) {
          campaignStats[campaignName] = {
            campaign: campaignName,
            leadsTouchedSet: new Set(),
            conversionsInfluencedSet: new Set(),
            attributionCredit: 0,
            contractValue: 0,
            channel
          };
        }

        campaignStats[campaignName].leadsTouchedSet.add(lead.Lead_ID);

        if (isConverted) {
          campaignStats[campaignName].conversionsInfluencedSet.add(lead.Lead_ID);
          campaignStats[campaignName].attributionCredit += creditPerCampaign;
          campaignStats[campaignName].contractValue += lead.ContractValue * creditPerCampaign;
        }
      });
    });

    // --- Convert sets to counts ---
    const attribution = Object.values(campaignStats).map(stat => ({
      campaign: stat.campaign,
      leadsTouched: stat.leadsTouchedSet.size,
      conversionsInfluenced: stat.conversionsInfluencedSet.size,
      attributionCredit: parseFloat(stat.attributionCredit.toFixed(2)),
      contractValue: parseFloat(stat.contractValue.toFixed(2)),
      conversionRate: stat.leadsTouchedSet.size > 0
        ? ((stat.conversionsInfluencedSet.size / stat.leadsTouchedSet.size) * 100).toFixed(1) + '%'
        : '0.0%'
    }));

    const leads = filtered.map(lead => ({
      Lead_ID: lead.Lead_ID,
      Lead_Created_Date: lead.Lead_Created_Date,
      Touchpoints: lead.Touchpoints,
      Channels: lead.Channels,
      IsConverted: lead.IsConverted,
      ContractValue: lead.ContractValue
    }));

    res.json({
      totalLeads: filtered.length,
      attribution,
      leads
    });

  } catch (error) {
    console.error("Error fetching multi-touch attribution:", error);
    res.status(500).json({
      message: "Failed to fetch multi-touch attribution",
      error: error.message,
    });
  }
};
