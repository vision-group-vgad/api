import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
import AdminUtils from "../../../utils/common/AdminUtils.js";
import { meetingsDummy } from "./meetings-dummy.js";

dayjs.extend(isBetween);

const adminUtils = new AdminUtils();

export const getMeetingAnalytics = async (startDate, endDate) => {
  let meetings = [];
  try {
    const json = await adminUtils.getMeetings(startDate, endDate);
    meetings = json.data || [];
    if (meetings.length === 0) meetings = meetingsDummy;
  } catch (error) {
    console.warn("[Meetings] Live fetch failed, using dummy:", error.message);
    meetings = meetingsDummy;
  }

  if (startDate && endDate) {
    meetings = meetings.filter((m) =>
      dayjs(m.meetingDate).isBetween(dayjs(startDate), dayjs(endDate), null, "[]")
    );
  }

  // eslint-disable-next-line no-unused-vars
  return meetings.map(({ totalInvited, attended, ...rest }) => rest);
};