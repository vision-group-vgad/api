import OpsProduction from "../../../utils/common/OpsProduction.js";
import { jobSchedulingData } from "./dummy.js";

const opsProduction = new OpsProduction();

export const getJobSchedulingEfficiency = async (filters = {}) => {
  const { machine, startDate, endDate } = filters;

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const fetchStart = startDate || thirtyDaysAgo;
  const fetchEnd = endDate || today;

  let records;
  try {
    const response = await opsProduction.fetchModuleData('job-scheduling', fetchStart, fetchEnd);
    records = Array.isArray(response.data) && response.data.length > 0 ? response.data : jobSchedulingData;
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('[JobScheduling] Live data empty, falling back to dummy data');
    }
  } catch (error) {
    console.warn('[JobScheduling] Live data fetch failed, using dummy data:', error.message);
    records = jobSchedulingData;
  }

  let result = records;
  if (machine) result = result.filter(job => job.machine === machine);

  return result.map((job) => {
    const scheduledStart = new Date(`${job.scheduledDate}T${job.scheduledStartTime}+03:00`);
    const scheduledEnd = new Date(`${job.scheduledDate}T${job.scheduledEndTime}+03:00`);
    const actualStart = new Date(`${job.scheduledDate}T${job.actualStartTime}+03:00`);
    const actualEnd = new Date(`${job.scheduledDate}T${job.actualEndTime}+03:00`);

    const startDelay = Math.round((actualStart - scheduledStart) / 60000);
    const endDelay = Math.round((actualEnd - scheduledEnd) / 60000);
    const jobDuration = Math.round((actualEnd - actualStart) / 60000);

    return {
      ...job,
      startDelayMinutes: startDelay,
      endDelayMinutes: endDelay,
      actualJobDurationMinutes: jobDuration,
    };
  });
};
