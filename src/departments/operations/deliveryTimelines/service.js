import OpsProduction from "../../../utils/common/OpsProduction.js";
import { deliveries as dummyDeliveries } from "./dummy.js";

const opsProduction = new OpsProduction();

export const getAllDeliveries = async (filters = {}) => {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const startDate = filters.startDate || thirtyDaysAgo;
  const endDate = filters.endDate || today;

  let result;
  try {
    const response = await opsProduction.fetchModuleData('delivery-timelines', startDate, endDate);
    result = Array.isArray(response.data) && response.data.length > 0 ? response.data : dummyDeliveries;
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('[DeliveryTimelines] Live data empty, falling back to dummy data');
    }
  } catch (error) {
    console.warn('[DeliveryTimelines] Live data fetch failed, using dummy data:', error.message);
    result = dummyDeliveries;
  }

  if (filters.dispatcher) {
    result = result.filter(d => d.dispatcher === filters.dispatcher);
  }

  if (filters.depot) {
    result = result.filter(d => d.depot === filters.depot);
  }

  if (filters.startDate && filters.endDate) {
    result = result.filter(
      d =>
        new Date(d.pickupTime) >= new Date(filters.startDate) &&
        new Date(d.pickupTime) <= new Date(filters.endDate)
    );
  }

  return result;
};
