import { rateCardData } from "./dummy.js";

/**
 * Calculate Rate Card Utilization
 * Filters: channel, placementId, month
 */
export const getRateCardUtilization = (filters = {}) => {
  let data = rateCardData;

  if (filters.channel) {
    data = data.filter(d => d.channel.toLowerCase() === filters.channel.toLowerCase());
  }

  if (filters.placementId) {
    data = data.filter(d => d.placementId === filters.placementId);
  }

  if (filters.month) {
    data = data.filter(d => d.month === filters.month);
  }

  return data.map(d => {
    const utilization = (d.bookedImpressions / d.totalImpressions) * 100;
    return {
      ...d,
      utilization: utilization.toFixed(2),           // percentage
      unutilized: (100 - utilization).toFixed(2)    // remaining %
    };
  });
};
