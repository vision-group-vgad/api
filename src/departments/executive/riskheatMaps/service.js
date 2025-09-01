import { dummyRiskData } from "./dummy.js";

/**
 * Calculate risk score = likelihood * impact
 */
function calculateRiskScore(record) {
  return record.likelihood * record.impact;
}

/**
 * Get risks with filters
 * @param {Object} filters - { startDate, endDate, status, department }
 */
export function getRisks(filters = {}) {
  let results = dummyRiskData.map((r) => ({
    ...r,
    riskScore: calculateRiskScore(r),
  }));

  // Filter by status
  if (filters.status) {
    results = results.filter((r) => r.status === filters.status);
  }

  // Filter by department
  if (filters.department) {
    results = results.filter((r) => r.department === filters.department);
  }

  // Filter by date range
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    results = results.filter((r) => {
      const review = new Date(r.reviewDate);
      return review >= start && review <= end;
    });
  }

  return results;
}
