import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js"; // import plugin
import meetings from "./dummy.js"

dayjs.extend(isBetween);


export const getMeetingAnalytics = async (startDate, endDate) => {
    let filteredMeetings= meetings;
    if(startDate && endDate){
        filteredMeetings = meetings.filter(m => dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]"));       
    }

    return filteredMeetings;

}

