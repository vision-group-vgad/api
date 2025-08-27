import { deliveries } from "./dummy.js";

export const getAllDeliveries = (filters = {}) => {
  let result = deliveries;

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
