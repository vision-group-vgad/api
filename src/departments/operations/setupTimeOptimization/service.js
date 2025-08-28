import { setupTimeData } from "./dummy.js";

export const getSetupTimeOptimization = () => {
  return setupTimeData.map((record) => {
    const start = new Date(`${record.setupDate}T${record.setupStartTime}+03:00`); // Ugandan time zone
    const end = new Date(`${record.setupDate}T${record.setupEndTime}+03:00`);
    const setupDurationMinutes = Math.round((end - start) / 60000);

    return {
      ...record,
      setupDurationMinutes,
    };
  });
};
