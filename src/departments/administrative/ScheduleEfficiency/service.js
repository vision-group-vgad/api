// import meetings from "../executiveMeetingAnalytics/MeetingData.js";
// import tasks from "./TasksDatadummy.js"

/**
 * Returns summary metrics for executive meetings, optionally filtered by date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 */
// export const getMeetingsSummary = (startDate, endDate) => {
//   let filteredMeetings = meetings;

//   // Filter by date range if provided
//   if (startDate && endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     filteredMeetings = meetings.filter(m => {
//       const meetingDate = new Date(m.meetingDate);
//       return meetingDate >= start && meetingDate <= end;
//     });
//   }

//   const targetMeetings = 50; // configurable or hardcoded

//   const totalMeetingsHeld = filteredMeetings.filter(
//     m => m.meetingStatus === "Held"
//   ).length;

//   const meetingsCompletionRate = ((totalMeetingsHeld / targetMeetings) * 100).toFixed(1);

//   const totalCancelled = filteredMeetings.filter(
//     m => m.meetingStatus === "Cancelled"
//   ).length;

//   const cancellationRate = filteredMeetings.length
//     ? ((totalCancelled / filteredMeetings.length) * 100).toFixed(1)
//     : 0;

//   const today = new Date();
//   const upcomingMeetings = filteredMeetings.filter(
//     m => new Date(m.meetingDate) > today
//   ).length;

//   return {
//     totalMeetingsHeld,
//     targetMeetings,
//     meetingsCompletionRate: Number(meetingsCompletionRate),
//     cancellationRate: Number(cancellationRate),
//     upcomingMeetings
//   };
// };


/**
 * Returns tasks/action points summary
 * Could filter by high-priority only or other criteria if needed
 */
/**
 * Returns tasks/action points summary
 * Can filter by high-priority and date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 */
// export const getTasksSummary = (startDate, endDate) => {
//   let filteredTasks = tasks;

//   // Filter by due date range if provided
//   if (startDate && endDate) {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     filteredTasks = tasks.filter(t => {
//       const due = new Date(t.dueDate);
//       return due >= start && due <= end;
//     });
//   }

//   // Take top 5 high-priority tasks for progress bars
//   const highPriorityTasks = filteredTasks
//     .filter(task => task.priority === "High")
//     .slice(0, 5);

//   return {
//     progressTasks: highPriorityTasks.map(t => ({
//       taskId: t.taskId,
//       taskTitle: t.taskTitle,
//       completionPercentage: t.completionPercentage,
//       status: t.status,
//       project: t.project,
//       dueDate: t.dueDate,
//     })),
//     allTasks: filteredTasks, 
//   };
// };
