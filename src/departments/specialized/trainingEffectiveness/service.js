import { trainingData } from "./Trainingdumy.js";
import { participantData } from "./Participantdummy.js";

export const getTrainingEffectiveness = (filters = {}) => {
  const { department, trainingId, startDate, endDate } = filters;

  // Filter by department, trainingId, and date range
  let filteredTrainings = trainingData.filter(t => {
    const inDepartment = !department || t.department === department;
    const inTraining = !trainingId || t.trainingId === trainingId;
    const inDateRange = (!startDate || new Date(t.startDate) >= new Date(startDate)) &&
                        (!endDate || new Date(t.endDate) <= new Date(endDate));
    return inDepartment && inTraining && inDateRange;
  });

  return filteredTrainings.map(training => {
    const participants = participantData.filter(p => p.trainingId === training.trainingId);

    const totalParticipants = participants.length;

    const totalAttendance = participants.reduce((sum, p) => sum + p.sessionsAttended, 0);
    const totalSessions = training.totalSessions * totalParticipants;

    const attendanceRate = (totalAttendance / totalSessions) * 100;

    const completionRate =
      (participants.filter(p => (p.sessionsAttended / training.totalSessions) >= 0.8).length /
        totalParticipants) *
      100;

    const preAssessmentAverage =
      participants.reduce((sum, p) => sum + p.preAssessmentScore, 0) / totalParticipants;

    const postAssessmentAverage =
      participants.reduce((sum, p) => sum + p.postAssessmentScore, 0) / totalParticipants;

    const onTheJobPerformanceScore =
      participants.reduce((sum, p) => sum + p.onTheJobPerformanceScore, 0) / totalParticipants;

    const participantSatisfaction =
      participants.reduce((sum, p) => sum + p.participantSatisfaction, 0) / totalParticipants;

    return {
      trainingId: training.trainingId,
      title: training.title,
      department: training.department,
      trainer: training.trainer,
      attendanceRate: Number(attendanceRate.toFixed(2)),
      completionRate: Number(completionRate.toFixed(2)),
      preAssessmentAverage: Number(preAssessmentAverage.toFixed(2)),
      postAssessmentAverage: Number(postAssessmentAverage.toFixed(2)),
      onTheJobPerformanceScore: Number(onTheJobPerformanceScore.toFixed(2)),
      participantSatisfaction: Number(participantSatisfaction.toFixed(2)),
      totalParticipants
    };
  });
};
