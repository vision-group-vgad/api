import { audits } from "./dummy.js";
import dayjs from "dayjs";

/**
 * Get filtered audits
 * @param {Object} filters - department, status, category, startDate, endDate
 * @returns {Array} filtered audits
 */
export const getFilteredAudits = ({ department, status, category, startDate, endDate }) => {
  let results = audits;

  if (department) {
    results = results.filter(a => a.department.toLowerCase() === department.toLowerCase());
  }

  if (status) {
    results = results.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (category) {
    results = results.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  if (startDate) {
    results = results.filter(a => dayjs(a.startDate).isAfter(dayjs(startDate).subtract(1, 'day')));
  }

  if (endDate) {
    results = results.filter(a => dayjs(a.endDate).isBefore(dayjs(endDate).add(1, 'day')));
  }

  return results;
};
