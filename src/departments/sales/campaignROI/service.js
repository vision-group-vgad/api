import { campaigns } from "./dummy.js";
import SalesMarketing from "../../../utils/common/SalesMkting.js";

const salesMarketing = new SalesMarketing();

export const calculateROI = (cost, revenue) => ((revenue - cost) / cost) * 100;

export const getCampaigns = async (startDate, endDate) => {
  try {
    const liveData = await salesMarketing.getCampaignROIData(startDate, endDate);
    if (liveData.length > 0) {
      return liveData;
    }
  } catch (error) {
    console.warn("Using fallback campaign ROI data:", error.message);
  }

  let filtered = campaigns;

  if (startDate && endDate) {
    filtered = campaigns.filter(c =>
      new Date(c.startDate) <= new Date(endDate) &&
      new Date(c.endDate) >= new Date(startDate)
    );
  }

  return filtered.map(c => ({
    ...c,
    ROI: parseFloat(calculateROI(c.cost, c.revenue).toFixed(2))
  }));
};
