import { complianceTasks } from "./dummy.js";
import dayjs from "dayjs";

/**
 * Get filtered compliance tasks
 * @param {Object} filters - department, status, startDate, endDate
 * @returns {Array} filtered tasks
 */
export const getFilteredTasks = ({ department, status, startDate, endDate }) => {
  let results = complianceTasks;

  if (department) {
    results = results.filter(task => task.department.toLowerCase() === department.toLowerCase());
  }

  if (status) {
    results = results.filter(task => task.status.toLowerCase() === status.toLowerCase());
  }

  if (startDate) {
    results = results.filter(task => dayjs(task.startDate).isAfter(dayjs(startDate).subtract(1, 'day')));
  }

  if (endDate) {
    results = results.filter(task => dayjs(task.dueDate).isBefore(dayjs(endDate).add(1, 'day')));
  }

  return results;
};
