import SalesMarketing from "../../../utils/common/SalesMkting.js";
import ctrData from "./dummy-data.js";

class CTRController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const rangeFiltered = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const filteredData = rangeFiltered.length > 0 ? rangeFiltered : data;
    const totalCtr = filteredData.reduce(
      (total, campaign) => total + campaign.clickThroughRatePercent,
      0
    );
    const totalRevenue = filteredData.reduce(
      (total, campaign) => total + campaign.totalRevenue,
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
      summary: {
        avg_ctr_percentage: Math.round(totalCtr / dataLength),
        no_of_campaigns: campaignSet.size,
        devices: Array.from(deviceSet),
        channels: Array.from(channelSet),
        avg_revenue_per_campaign: Math.round(totalRevenue / dataLength),
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const liveData = await this.#salesMkt.getCTRAnalyticsData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn("Using fallback CTR data due to live fetch error:", error.message);
    }

    return this.#processData(ctrData, startDate, endDate);
  }
}

export default CTRController;
