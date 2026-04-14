import dayjs from "dayjs";
import { retentionRiskData } from "./dummy.js";

/**
 * Get retention risk data with optional filters
 * @param {Object} filters
 * @returns {Array}
 */
export const getRetentionRiskData = (filters = {}) => {
  let results = retentionRiskData;

  // Filter by gender
  if (filters.gender) {
    results = results.filter(e => e.gender === filters.gender);
  }

  // Filter by department
  if (filters.department) {
    results = results.filter(e => e.department === filters.department);
  }

  // Filter by riskLevel
  if (filters.riskLevel) {
    results = results.filter(e => e.retentionRisk === filters.riskLevel);
  }

  // Filter by likelyToLeave
  if (filters.likelyToLeave !== undefined) {
    const leaveBool = filters.likelyToLeave === "true";
    results = results.filter(e => e.likelyToLeave === leaveBool);
  }

  // Filter by recordDate range
  if (filters.startDate && filters.endDate) {
    results = results.filter(e =>
      dayjs(e.recordDate).isAfter(dayjs(filters.startDate).subtract(1, 'day')) &&
      dayjs(e.recordDate).isBefore(dayjs(filters.endDate).add(1, 'day'))
    );
  }

  return results;
};
