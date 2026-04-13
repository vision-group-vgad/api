import ExecutiveUtils from "../../../../utils/common/ExecutiveUtils.js";
import { audits as dummyAudits } from "./dummy.js";
import dayjs from "dayjs";

const execUtils = new ExecutiveUtils();

function applyAuditFilters(results, { department, status, category, startDate, endDate } = {}) {
  if (department) results = results.filter(a => a.department.toLowerCase() === department.toLowerCase());
  if (status) results = results.filter(a => a.status.toLowerCase() === status.toLowerCase());
  if (category) results = results.filter(a => a.category.toLowerCase() === category.toLowerCase());
  if (startDate) results = results.filter(a => dayjs(a.startDate).isAfter(dayjs(startDate).subtract(1, "day")));
  if (endDate) results = results.filter(a => dayjs(a.endDate).isBefore(dayjs(endDate).add(1, "day")));
  return results;
}

export const getFilteredAudits = async (filters) => {
  try {
    const data = await execUtils.getCompliance();
    const allAudits = data?.audits?.data || [];
    return applyAuditFilters(allAudits, filters);
  } catch (err) {
    console.error("❌ [Audits] CMC failed, using dummy:", err.message);
    return applyAuditFilters(dummyAudits, filters);
  }
};
