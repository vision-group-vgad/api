import axios from "axios";
import dotenv from "dotenv";
import { dummyMergedData } from "./dummyData.js";
import { mergeData, generateDummyFields } from "./utils.js";
import dayjs from "dayjs";

dotenv.config();

const headers = {
  Authorization: `Bearer ${process.env.CMS_API_KEY}`,
};

export const fetchVisualEngagementData = async (startDate, endDate) => {
  const format = "YYYY-MM-DD";

  if (!dayjs(startDate, format, true).isValid() || !dayjs(endDate, format, true).isValid()) {
    
    return dummyMergedData;
  }

  const articleUrl = `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/0`;
  const sessionUrl = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${startDate}/${endDate}`;

  try {
    const [articlesRes, sessionsRes] = await Promise.all([
      axios.get(articleUrl, { headers }),
      axios.get(sessionUrl, { headers }),
    ]);

    const articles = articlesRes.data?.data || [];
    const sessions = sessionsRes.data?.data || [];

    const merged = mergeData(articles, sessions);
    const final = generateDummyFields(merged);

    return final;
  } catch {
    
    return dummyMergedData;
  }
};
