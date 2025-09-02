import { policies } from "./dummy.js";
import dayjs from "dayjs";

/**
 * Get filtered policies
 * @param {Object} filters - department, status, category, startDate, endDate
 * @returns {Array} filtered policies
 */
export const getFilteredPolicies = ({ department, status, category, startDate, endDate }) => {
  let results = policies;

  if (department) {
    results = results.filter(p => p.department.toLowerCase() === department.toLowerCase());
  }

  if (status) {
    results = results.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (startDate) {
    results = results.filter(p => dayjs(p.lastReviewedDate).isAfter(dayjs(startDate).subtract(1, 'day')));
  }

  if (endDate) {
    results = results.filter(p => dayjs(p.nextReviewDate).isBefore(dayjs(endDate).add(1, 'day')));
  }

  return results;
};
