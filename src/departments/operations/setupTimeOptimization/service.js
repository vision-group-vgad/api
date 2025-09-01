import { setupTimeData } from "./dummy.js";

export const getSetupTimeOptimization = (filters = {}) => {
  const { machine, startDate, endDate } = filters;

  return setupTimeData
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

      return {
        ...record,
        setupDurationMinutes,
      };
    });
};


