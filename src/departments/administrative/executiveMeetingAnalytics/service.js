import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import dotenv from "dotenv";
dotenv.config();

dayjs.extend(isBetween);

export const getMeetingAnalytics = async (startDate, endDate) => {
  try {
    const url = new URL(process.env.VGAD_MEETINGS_API_URL);
    if (startDate) url.searchParams.append("startDate", startDate);
    if (endDate) url.searchParams.append("endDate", endDate);

    const response = await fetch(url.toString(), {
      headers: {
        "x-api-key": process.env.VGAD_API_KEY,
        "Accept": process.env.VGAD_ACCEPT,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const json = await response.json();
    const meetings = json.data;

    let filteredMeetings = meetings;
    if (startDate && endDate) {
      filteredMeetings = meetings.filter(m =>
        dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
      );
    }

    // eslint-disable-next-line no-unused-vars
    return filteredMeetings.map(({ totalInvited, attended, ...rest }) => rest)
  } catch (error) {
    console.error(error);
    throw error;
  }
};