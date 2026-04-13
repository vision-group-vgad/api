import OpsProduction from "../../../utils/common/OpsProduction.js";
import { setupTimeData } from "./dummy.js";

const opsProduction = new OpsProduction();

export const getSetupTimeOptimization = async (filters = {}) => {
  const { machine, startDate, endDate } = filters;

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const fetchStart = startDate || thirtyDaysAgo;
  const fetchEnd = endDate || today;

  let records;
  try {
    const response = await opsProduction.fetchModuleData('setup-time', fetchStart, fetchEnd);
    records = Array.isArray(response.data) && response.data.length > 0 ? response.data : setupTimeData;
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('[SetupTime] Live data empty, falling back to dummy data');
    }
  } catch (error) {
    console.warn('[SetupTime] Live data fetch failed, using dummy data:', error.message);
    records = setupTimeData;
  }

  return records
    .filter((record) => {
      let isValid = true;
      if (machine) isValid = isValid && record.machine === machine;
      if (startDate) isValid = isValid && record.setupDate >= startDate;
      if (endDate) isValid = isValid && record.setupDate <= endDate;
      return isValid;
    })
    .map((record) => {
      const start = new Date(`${record.setupDate}T${record.setupStartTime}+03:00`);
      const end = new Date(`${record.setupDate}T${record.setupEndTime}+03:00`);
      const setupDurationMinutes = Math.round((end - start) / 60000);
      return { ...record, setupDurationMinutes };
    });
};

