import axios from "axios";
import axiosRetry from "axios-retry";
import { extractExternalId } from "../utils.js";

const TOKEN = process.env.CMS_API_KEY;
if (!TOKEN) throw new Error("Missing CMS_API_KEY in environment variables.");

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
  timeout: 60000, // Increased to 60s timeout
});

// Retry failed requests (e.g., ECONNRESET, 500s)
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 2000,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" ||
    error.code === "ECONNRESET" ||
    error.response?.status >= 500,
});

const SESSION_API =
  "https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/2025-01-01/2025-04-30";

// Chunked session data fetcher for large date ranges
async function getSessionDataChunked(startDate, endDate, chunkDays = 7) {
  console.log(
    `Getting session data in ${chunkDays}-day chunks from ${startDate} to ${endDate}`
  );

  const start = new Date(startDate);
  const end = new Date(endDate);
  const allData = [];

  let currentDate = new Date(start);
  let chunkNum = 1;

  while (currentDate <= end) {
    const chunkEnd = new Date(currentDate);
    chunkEnd.setDate(chunkEnd.getDate() + chunkDays - 1);

    if (chunkEnd > end) {
      chunkEnd.setTime(end.getTime());
    }

    const chunkStart = currentDate.toISOString().split("T")[0];
    const chunkEndStr = chunkEnd.toISOString().split("T")[0];

    console.log(
      `  Fetching chunk ${chunkNum}: ${chunkStart} to ${chunkEndStr}`
    );

    try {
      const url = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${chunkStart}/${chunkEndStr}`;
      const response = await axiosInstance.get(url, { timeout: 60000 });

      allData.push(...response.data.data);
      console.log(`    ✅ Got ${response.data.data.length} records`);

      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay
    } catch (error) {
      console.error(`    ❌ Chunk ${chunkNum} failed: ${error.message}`);
      // Continue with other chunks
    }

    currentDate.setDate(currentDate.getDate() + chunkDays);
    chunkNum++;
  }

  console.log(`Total session records collected: ${allData.length}`);
  return allData;
}
const ARTICLE_API = (offset) =>
  `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/2025-01-01/2025-04-30/${offset}`;

// --- Format seconds to HH:MM:SS ---
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// --- Fetch all articles with controlled concurrency and better error handling ---
async function fetchAllArticles(batchSize = 3) {
  // Reduced batch size
  try {
    console.log("Fetching first page to get total count...");
    const firstRes = await axiosInstance.get(ARTICLE_API(0));
    const totalCount = firstRes.data.meta.totalCount;
    const totalPages = Math.ceil(totalCount / 10);

    console.log(`Total articles: ${totalCount}, Total pages: ${totalPages}`);

    // Start with first page data
    const results = [...firstRes.data.data];

    // Generate remaining page offsets (skip first page since we already have it)
    const pageOffsets = Array.from(
      { length: totalPages - 1 },
      (_, i) => (i + 1) * 10
    );

    let processedPages = 1;

    for (let i = 0; i < pageOffsets.length; i += batchSize) {
      const batch = pageOffsets.slice(i, i + batchSize);
      console.log(
        `Fetching batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          pageOffsets.length / batchSize
        )} (pages ${processedPages + 1}-${processedPages + batch.length})`
      );

      const requests = batch.map(async (offset) => {
        try {
          const response = await axiosInstance.get(ARTICLE_API(offset));
          return response.data.data;
        } catch (err) {
          console.error(`Failed to fetch offset ${offset}:`, err.message);
          return []; // Return empty array instead of malformed object
        }
      });

      const responses = await Promise.all(requests);
      for (const articles of responses) {
        results.push(...articles);
      }

      processedPages += batch.length;

      // Add delay between batches to avoid overwhelming the server
      if (i + batchSize < pageOffsets.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    console.log(`Successfully fetched ${results.length} articles`);
    return results;
  } catch (error) {
    console.error("Error in fetchAllArticles:", error.message);
    throw error;
  }
}

// --- Main aggregation function with better error handling ---
export async function getJournalistProductivity() {
  try {
    console.log("Starting journalist productivity analysis...");

    // Fetch session data with extended timeout and retry logic
    console.log("Fetching session data...");
    console.log("Session API URL:", SESSION_API);

    let sessionData;

    // First try the direct API call
    try {
      console.log("Attempting direct API call for full date range...");
      const sessionRes = await axiosInstance.get(SESSION_API, {
        timeout: 90000,
      }); // 90s timeout
      sessionData = sessionRes.data.data;
      console.log(
        `✅ Direct API success: ${sessionData.length} session records`
      );
    } catch (error) {
      console.log(`❌ Direct API failed: ${error.message}`);
      console.log("Falling back to chunked approach...");

      // Fallback to chunked approach
      try {
        sessionData = await getSessionDataChunked(
          "2025-01-01",
          "2025-04-30",
          14
        ); // 2-week chunks
      } catch (chunkError) {
        console.error("Chunked approach also failed:", chunkError.message);
        throw new Error(
          `Both direct and chunked session API calls failed. Last error: ${chunkError.message}`
        );
      }
    }

    // Fetch articles with better error handling
    console.log("Fetching all article metadata...");
    const articles = await fetchAllArticles(2); // Further reduced batch size

    // Build article lookup map
    console.log("Building article lookup map...");
    const articleMap = new Map();
    for (const article of articles) {
      if (article.externalId) {
        articleMap.set(article.externalId, article);
      }
    }
    console.log(`Article map created with ${articleMap.size} entries`);

    // Process sessions
    console.log("Processing session data...");
    const authorStats = {};
    let processedSessions = 0;
    let matchedSessions = 0;

    for (const session of sessionData) {
      processedSessions++;

      if (processedSessions % 1000 === 0) {
        console.log(
          `Processed ${processedSessions}/${sessionData.length} sessions`
        );
      }

      const externalId = extractExternalId(session.pagePath);
      if (!externalId) continue;

      const article = articleMap.get(externalId);
      if (!article || !article.author) continue;

      matchedSessions++;

      const authorName = `${article.author.first_name || ""} ${
        article.author.last_name || ""
      }`.trim();

      if (!authorName) continue; // Skip if no author name

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

      // Parse HH:MM:SS into total seconds with better error handling
      if (session.averageDuration) {
        const durationParts = session.averageDuration.split(":");
        if (durationParts.length === 3) {
          const [h, m, s] = durationParts.map((num) => parseInt(num, 10) || 0);
          stat.totalDurationSeconds += h * 3600 + m * 60 + s;
        }
      }

      // Handle bounce rate
      if (session.bounceRate !== "" && session.bounceRate != null) {
        const bounceRate = Number(session.bounceRate);
        if (!isNaN(bounceRate)) {
          stat.totalBounceRate += bounceRate;
          stat.bounceCount++;
        }
      }

      // Add category
      if (article.category?.name) {
        stat.categories.add(article.category.name);
      }
    }

    console.log(
      `Processed ${processedSessions} sessions, matched ${matchedSessions} with articles`
    );
    console.log(`Found ${Object.keys(authorStats).length} unique authors`);

    // Build final results
    const final = Object.entries(authorStats).map(([author, stat]) => ({
      author,
      articleCount: stat.articleCount,
      avgDuration: formatDuration(
        stat.totalDurationSeconds / stat.articleCount
      ),
      totalDuration: formatDuration(stat.totalDurationSeconds),
      avgBounceRate:
        stat.bounceCount > 0
          ? +(stat.totalBounceRate / stat.bounceCount).toFixed(2)
          : 0,
      categories: Array.from(stat.categories),
    }));

    console.log("Analysis complete!");
    return final;
  } catch (error) {
    console.error("Error in getJournalistProductivity:", error.message);
    throw error;
  }
}
