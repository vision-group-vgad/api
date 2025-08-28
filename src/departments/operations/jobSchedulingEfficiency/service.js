import { jobSchedulingData } from "./dummy.js";

export const getJobSchedulingEfficiency = () => {
  return jobSchedulingData.map((job) => {
    const scheduledStart = new Date(`${job.scheduledDate}T${job.scheduledStartTime}+03:00`);
    const scheduledEnd = new Date(`${job.scheduledDate}T${job.scheduledEndTime}+03:00`);
    const actualStart = new Date(`${job.scheduledDate}T${job.actualStartTime}+03:00`);
    const actualEnd = new Date(`${job.scheduledDate}T${job.actualEndTime}+03:00`);

    const startDelay = Math.round((actualStart - scheduledStart) / 60000); // in minutes
    const endDelay = Math.round((actualEnd - scheduledEnd) / 60000);       // in minutes
    const jobDuration = Math.round((actualEnd - actualStart) / 60000);    // in minutes

    return {
      ...job,
      startDelayMinutes: startDelay,
      endDelayMinutes: endDelay,
      actualJobDurationMinutes: jobDuration,
    };
  });
};
