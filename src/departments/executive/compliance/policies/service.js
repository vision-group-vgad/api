import ExecutiveUtils from "../../../../utils/common/ExecutiveUtils.js";
import { policies as dummyPolicies } from "./dummy.js";
import dayjs from "dayjs";

const execUtils = new ExecutiveUtils();

function applyPolicyFilters(results, { department, status, category, startDate, endDate } = {}) {
  if (department) results = results.filter(p => p.department.toLowerCase() === department.toLowerCase());
  if (status) results = results.filter(p => p.status.toLowerCase() === status.toLowerCase());
  if (category) results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  if (startDate) results = results.filter(p => dayjs(p.lastReviewedDate).isAfter(dayjs(startDate).subtract(1, "day")));
  if (endDate) results = results.filter(p => dayjs(p.nextReviewDate).isBefore(dayjs(endDate).add(1, "day")));
  return results;
}

export const getFilteredPolicies = async (filters) => {
  try {
    const data = await execUtils.getCompliance();
    const allPolicies = data?.policies?.data || [];
    return applyPolicyFilters(allPolicies, filters);
  } catch (err) {
    console.error("❌ [Policies] CMC failed, using dummy:", err.message);
    return applyPolicyFilters(dummyPolicies, filters);
  }
};
