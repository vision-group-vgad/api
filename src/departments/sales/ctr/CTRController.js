import SalesMarketing from "../../../utils/common/SalesMkting.js";
import ctrData from "./dummy-data.js";

class CTRController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
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
    filteredData.forEach((campaign) => {
      deviceSet.add(campaign.device);
      channelSet.add(campaign.channel);
    });

    const dataLength = filteredData.length;

    return {
      data: filteredData,
      summary: {
        avg_ctr_percentage: Math.round(totalCtr / dataLength),
        no_of_campaigns: dataLength,
        devices: Array.from(deviceSet),
        channels: Array.from(channelSet),
        avg_revenue_per_campaign: Math.round(totalRevenue / dataLength),
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    // const data = await this.#salesMkt.getInRangeSalesAnalytics(startDate, endDate)
    const processedAnalytics = this.#processData(ctrData, startDate, endDate);
    return processedAnalytics;
  }
}

export default CTRController;
