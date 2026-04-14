import dayjs from "dayjs";
import { recruitmentFunnelData } from "./dummy.js";

/**
 * Get recruitment funnel data with optional filters
 * @param {Object} filters
 * @returns {Array}
 */
export const getRecruitmentFunnelData = (filters = {}) => {
  let results = recruitmentFunnelData;

  // Filter by gender
  if (filters.gender) {
    results = results.filter(c => c.demographics.gender === filters.gender);
  }

  // Filter by role
  if (filters.roleApplied) {
    results = results.filter(c => c.application.roleApplied === filters.roleApplied);
  }

  // Filter by department
  if (filters.department) {
    results = results.filter(c => c.application.department === filters.department);
  }

  // Filter by recruitment source
  if (filters.source) {
    results = results.filter(c => c.application.source === filters.source);
  }

  // Filter by status (application/interview/offer/hired/rejected)
  if (filters.status) {
    results = results.filter(c =>
      c.offer.status === filters.status ||
      c.interview.stage === filters.status ||
      c.application.status === filters.status
    );
  }

  // Filter by date range (applicationDate)
  if (filters.startDate && filters.endDate) {
    results = results.filter(c =>
      dayjs(c.application.applicationDate).isAfter(dayjs(filters.startDate)) &&
      dayjs(c.application.applicationDate).isBefore(dayjs(filters.endDate))
    );
  }

  return results;
};
