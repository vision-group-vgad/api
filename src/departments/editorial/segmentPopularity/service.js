import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { extractExternalId } from "../utils.js"; // adjust path as needed

const TOKEN = process.env.CMS_API_KEY;
if (!TOKEN) throw new Error("Missing CMS_API_KEY in environment variables.");

const axiosInstance = axios.create({
  headers: { Authorization: `Bearer ${TOKEN}` },
  //timeout: 5000,
});

function parseDurationToSeconds(durationStr) {
  if (!durationStr) return 0;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

async function fetchAllArticles(startDate, endDate) {
  const articles = [];
  let offset = 0;
  const pageSize = 10;

  while (true) {
    const url = `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/${offset}`;
    const res = await axiosInstance.get(url);
    const data = res.data;

    if (!data?.data?.length) break;

    articles.push(...data.data);
    offset += pageSize;

    if (offset >= data.meta.totalCount) break;
  }
  return articles;
}

async function fetchSessionDurations(startDate, endDate) {
  const url = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${startDate}/${endDate}`;
  const res = await axiosInstance.get(url);
  return res.data.data || [];
}

export async function getSegmentPopularity({ startDate, endDate } = {}) {
  try {
    const today = new Date();
    const defaultEnd = today.toISOString().split("T")[0];
    const defaultStart = new Date(today.setDate(today.getDate() - 30))
      .toISOString()
      .split("T")[0];

    startDate = startDate || defaultStart;
    endDate = endDate || defaultEnd;

    

    const [articles, sessions] = await Promise.all([
      fetchAllArticles(startDate, endDate),
      fetchSessionDurations(startDate, endDate),
    ]);
  
    const sessionMap = new Map();
    for (const s of sessions) {
      const extId = extractExternalId(s.pagePath);
      if (extId) sessionMap.set(extId, s);
    }

    const categoryStats = {};

    for (const article of articles) {
      const catName = article.category?.name?.trim() || "Unknown";
      const session = sessionMap.get(article.externalId);

      if (!categoryStats[catName]) {
        categoryStats[catName] = {
          count: 0,
          totalDurationSeconds: 0,
          totalScrollPercent: 0,
          totalBounceRate: 0,
        };
      }

      categoryStats[catName].count++;

      if (session) {
        const durSeconds = parseDurationToSeconds(session.averageDuration);
        const scroll = Number(session.percentScrolled) || 0;
        const bounce = Number(session.bounceRate) || 0;

        categoryStats[catName].totalDurationSeconds += durSeconds;
        categoryStats[catName].totalScrollPercent += scroll;
        categoryStats[catName].totalBounceRate += bounce;
      }
    }

    const summary = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      articleCount: stats.count,
      avgDurationSeconds: +(stats.totalDurationSeconds / stats.count).toFixed(
        1
      ),
      avgScrollPercent: +(stats.totalScrollPercent / stats.count).toFixed(1),
      avgBounceRate: +(stats.totalBounceRate / stats.count).toFixed(2),
    }));
   
    return summary.sort((a,b) => b.avgDurationSeconds - a.avgDurationSeconds);
  } catch (err) {
    
    throw err;
  }
}
