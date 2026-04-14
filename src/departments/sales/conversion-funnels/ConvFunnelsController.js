import SalesMarketing from "../../../utils/common/SalesMkting.js";
import campaigns from "./dummy-data.js";

class ConvFunnelsController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const rangeFiltered = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const filteredData = rangeFiltered.length > 0 ? rangeFiltered : data;
    const totalVisits = filteredData.reduce(
      (total, campaign) => total + campaign.visits,
      0
    );

    const deviceSet = new Set();
    const channelSet = new Set();
    const campaignSet = new Set();
    filteredData.forEach((campaign) => {
      deviceSet.add(campaign.device);
      channelSet.add(campaign.channel);
      campaignSet.add(campaign.campaign_name);
    });

    const dataLength = filteredData.length;

    return {
      data: filteredData,
      top_campaigns: this.#getTopPerformingCampaigns(filteredData),
      summary: {
        no_of_campaigns: campaignSet.size,
        devices: Array.from(deviceSet),
        channels: Array.from(channelSet),
        avg_visits: Math.round(totalVisits / dataLength),
      },
    };
  }

  #getTopPerformingCampaigns(data, topN = 4) {
    const sorted = [...data].sort((a, b) => b.conversions - a.conversions);
    return sorted.slice(0, topN);
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const liveData = await this.#salesMkt.getConversionFunnelsData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn(
        "Using fallback conversion funnel data due to live fetch error:",
        error.message
      );
    }

    return this.#processData(campaigns, startDate, endDate);
  }
}

export default ConvFunnelsController;
