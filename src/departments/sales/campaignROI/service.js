import { campaigns } from "./dummy.js";

export const calculateROI = (cost, revenue) => ((revenue - cost) / cost) * 100;

export const getCampaigns = (startDate, endDate) => {
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
