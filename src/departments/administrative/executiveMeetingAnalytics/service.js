import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js"; // import plugin

dayjs.extend(isBetween);

const meetings = [
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",
    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    },
    {
        meetingId: "M001",
        meetingTitle: "Strategy Review",
        meetingDate: "2025-01-01",
        startTime:"9:30",
        endTime:"10:30",
        meetingStatus:"Held",
        department:"Finance",
        attendanceRate: "80%",

    }
];

export const getMeetingAnalytics = async (startDate, endDate) => {
    let filteredMeetings= meetings;
    if(startDate && endDate){
        filteredMeetings = meetings.filter(m => dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]"));       
    }

    return filteredMeetings;

}

