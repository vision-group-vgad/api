import axios from "axios";
import { extractExternalId } from "./utils.js";

const TOKEN = process.env.CMS_API_KEY;

if (!TOKEN) {
  throw new Error("Missing CMS_API_KEY in environment variables.");
}

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

const SESSION_API =
  "https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/2025-01-01/2025-04-30";
const ARTICLE_API = (offset) =>
  `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/2025-01-01/2025-04-30/${offset}`;

// Fetch all article metadata using pagination
async function fetchAllArticles() {
  // First fetch page 0 to get totalCount
  const firstRes = await axiosInstance.get(ARTICLE_API(0));
  const firstPageData = firstRes.data.data;
  const totalCount = firstRes.data.meta.totalCount;
  const totalPages = Math.ceil(totalCount / 10);

  // Create a list of promises for all pages
  const pageOffsets = Array.from({ length: totalPages }, (_, i) => i * 10);
  const requests = pageOffsets.map((offset) =>
    axiosInstance.get(ARTICLE_API(offset))
  );

  // Fire all requests in parallel
  const responses = await Promise.all(requests);
  const allArticles = responses.flatMap((res) => res.data.data);

  return allArticles;
}


// Format seconds to HH:MM:SS
function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// Main function to aggregate journalist productivity
export async function getJournalistProductivity() {
  const sessionRes = await axiosInstance.get(SESSION_API);
  const sessionData = sessionRes.data.data;

  const articles = await fetchAllArticles();
  const articleMap = new Map();
  for (const article of articles) {
    articleMap.set(article.externalId, article);
  }

  const authorStats = {};

  for (const session of sessionData) {
    const externalId = extractExternalId(session.pagePath);
    if (!externalId) continue;

    const article = articleMap.get(externalId);
    if (!article || !article.author) continue;

    const authorName =
      `${article.author.first_name} ${article.author.last_name}`.trim();

    if (!authorStats[authorName]) {
      authorStats[authorName] = {
        articleCount: 0,
        totalDurationSeconds: 0,
        totalBounceRate: 0,
        bounceCount: 0,
        categories: new Set(),
      };
    }

    const stat = authorStats[authorName];
    stat.articleCount++;

    // Parse HH:MM:SS into total seconds
    const durationParts = session.averageDuration?.split(":");
    if (durationParts?.length === 3) {
      const [h, m, s] = durationParts.map(Number);
      stat.totalDurationSeconds += h * 3600 + m * 60 + s;
    }

    if (session.bounceRate !== "") {
      stat.totalBounceRate += Number(session.bounceRate);
      stat.bounceCount++;
    }

    if (article.category?.name) {
      stat.categories.add(article.category.name);
    }
  }

  // Format the final output
  const final = Object.entries(authorStats).map(([author, stat]) => ({
    author,
    articleCount: stat.articleCount,
    avgDuration: formatDuration(stat.totalDurationSeconds / stat.articleCount),
    totalDuration: formatDuration(stat.totalDurationSeconds),
    avgBounceRate:
      stat.bounceCount > 0
        ? +(stat.totalBounceRate / stat.bounceCount).toFixed(2)
        : 0,
    categories: Array.from(stat.categories),
  }));

  return final;
}
