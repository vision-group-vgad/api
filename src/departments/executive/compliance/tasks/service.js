import ExecutiveUtils from "../../../../utils/common/ExecutiveUtils.js";
import { complianceTasks as dummyTasks } from "./dummy.js";
import dayjs from "dayjs";

const execUtils = new ExecutiveUtils();

function applyTaskFilters(results, { department, status, startDate, endDate } = {}) {
  if (department) results = results.filter(t => t.department.toLowerCase() === department.toLowerCase());
  if (status) results = results.filter(t => t.status.toLowerCase() === status.toLowerCase());
  if (startDate) results = results.filter(t => dayjs(t.startDate).isAfter(dayjs(startDate).subtract(1, "day")));
  if (endDate) results = results.filter(t => dayjs(t.dueDate).isBefore(dayjs(endDate).add(1, "day")));
  return results;
}

export const getFilteredTasks = async (filters) => {
  try {
    const data = await execUtils.getCompliance();
    const allTasks = data?.tasks?.data || [];
    return applyTaskFilters(allTasks, filters);
  } catch (err) {
    console.error("❌ [Tasks] CMC failed, using dummy:", err.message);
    return applyTaskFilters(dummyTasks, filters);
  }
};

