import { impressionShareData }  from "./dummy.js";
import SalesMarketing from "../../../utils/common/SalesMkting.js";

const salesMarketing = new SalesMarketing();

export const getImpressionShare = async (filters = {}) => {
  let data = [];

  try {
    data = await salesMarketing.getImpressionShareData(
      filters.startDate,
      filters.endDate
    );
  } catch (error) {
    console.warn("Using fallback impression-share data:", error.message);
    data = impressionShareData;
  }

  if (!Array.isArray(data) || data.length === 0) {
    data = impressionShareData;
  }


  if (filters.advertiser) {
    data = data.filter(d =>
      d.advertiser.toLowerCase() === filters.advertiser.toLowerCase()
    );
  }
  if (filters.campaignId) {
    data = data.filter(d => d.campaignId === filters.campaignId);
  }
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    data = data.filter(d =>
      new Date(d.startDate) >= start && new Date(d.endDate) <= end
    );
  }

  // Calculate Impression Share
  return data.map(d => {
    const impressionShare = (d.impressionsReceived / d.eligibleImpressions) * 100;
    const lostShare = 100 - impressionShare;

    return {
      ...d,
      impressionShare: impressionShare.toFixed(2),
      lostImpressionShare: lostShare.toFixed(2),
    };
  });
};
