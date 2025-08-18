import axios from "axios";
import axiosRetry from "axios-retry";
import { extractExternalId } from "../utils.js";

const TOKEN = process.env.CMS_API_KEY;
if (!TOKEN) throw new Error("Missing CMS_API_KEY in environment variables.");

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
  timeout: 30000, // Reduced timeout
});

// Retry with exponential backoff
axiosRetry(axiosInstance, {
  retries: 2, // Reduced retries
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" ||
    error.code === "ECONNRESET" ||
    error.response?.status >= 500,
});

// Cache for articles to avoid repeated fetching
let articlesCache = null;
let articlesCacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Optimized session data fetcher with larger chunks and higher concurrency
async function getSessionDataChunked(startDate, endDate, chunkDays = 14) {
  console.log(`Getting session data in ${chunkDays}-day chunks from ${startDate} to ${endDate}`);

  const start = new Date(startDate);
  const end = new Date(endDate);
  const chunks = [];

  let currentDate = new Date(start);
  while (currentDate <= end) {
    const chunkEnd = new Date(currentDate);
    chunkEnd.setDate(chunkEnd.getDate() + chunkDays - 1);
    if (chunkEnd > end) chunkEnd.setTime(end.getTime());

    chunks.push({
      start: currentDate.toISOString().split("T")[0],
      end: chunkEnd.toISOString().split("T")[0]
    });

    currentDate.setDate(currentDate.getDate() + chunkDays);
  }

  console.log(`Processing ${chunks.length} chunks concurrently...`);

  // Process all chunks concurrently
  const promises = chunks.map(async (chunk, index) => {
    try {
      const url = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${chunk.start}/${chunk.end}`;
      const response = await axiosInstance.get(url);
      console.log(`Chunk ${index + 1} complete: ${response.data.data.length} records`);
      return response.data.data;
    } catch (error) {
      console.error(`Chunk ${index + 1} failed: ${error.message}`);
      return [];
    }
  });

  const results = await Promise.all(promises);
  const allData = results.flat();
  
  console.log(`Total session records collected: ${allData.length}`);
  return allData;
}

// Format seconds to HH:MM:SS (optimized)
function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Highly optimized article fetcher with caching and smart concurrency
async function fetchAllArticles(startDate, endDate, maxConcurrency = 8) {
  // Check cache first
  if (
    articlesCache &&
    articlesCacheTimestamp &&
    Date.now() - articlesCacheTimestamp < CACHE_DURATION
  ) {
    console.log("Using cached articles data");
    return articlesCache;
  }

  try {
    console.log(`Fetching articles from ${startDate} to ${endDate} with optimized concurrency...`);

    const firstRes = await axiosInstance.get(
      `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/0`
    );

    const totalCount = firstRes.data.meta.totalCount;
    const totalPages = Math.ceil(totalCount / 10);
    console.log(`Total articles: ${totalCount}, Total pages: ${totalPages}`);

    const results = [...firstRes.data.data];

    if (totalPages === 1) {
      articlesCache = results;
      articlesCacheTimestamp = Date.now();
      return results;
    }

    // Generate all page offsets
    const pageOffsets = Array.from({ length: totalPages - 1 }, (_, i) => (i + 1) * 10);

    // Process pages in batches with controlled concurrency
    const batchSize = maxConcurrency;
    const batches = [];
    for (let i = 0; i < pageOffsets.length; i += batchSize) {
      batches.push(pageOffsets.slice(i, i + batchSize));
    }

    console.log(
      `Processing ${batches.length} batches with ${maxConcurrency} concurrent requests each...`
    );

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      console.log(`Batch ${batchIndex + 1}/${batches.length} - fetching ${batch.length} pages`);

      const promises = batch.map(async (offset) => {
        try {
          const response = await axiosInstance.get(
            `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/${offset}`
          );
          return response.data.data;
        } catch (err) {
          console.error(`Failed to fetch offset ${offset}:`, err.message);
          return [];
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach((articles) => results.push(...articles));

      if (batchIndex < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log(`Successfully fetched ${results.length} articles`);

    // Cache the results
    articlesCache = results;
    articlesCacheTimestamp = Date.now();

    return results;
  } catch (error) {
    console.error("Error in fetchAllArticles:", error.message);
    throw error;
  }
}

// Pre-filter articles before processing to reduce memory usage
function filterArticles(articles, author, category) {
  if (!author && !category) return articles;
  
  return articles.filter(article => {
    if (!article.externalId) return false;
    
    const authorName = `${article.author?.first_name || ""} ${article.author?.last_name || ""}`.trim().toLowerCase();
    const categoryName = article.category?.name?.toLowerCase() || "";
    
    const authorMatch = author ? authorName.includes(author.toLowerCase()) : true;
    const categoryMatch = category ? categoryName.includes(category.toLowerCase()) : true;
    
    return authorMatch && categoryMatch;
  });
}

// Main function with optimizations
export async function getJournalistProductivity({
  startDate,
  endDate,
  author,
  category,
  page = 1,
  limit = 10
}) {
  try {
    console.log(`▶ Running journalist productivity from ${startDate} to ${endDate}`);
    const startTime = Date.now();

    // Fetch both data sources concurrently
    const [sessionDataResult, articlesResult] = await Promise.allSettled([
      // Try direct session API first, fallback to chunked
      axiosInstance.get(
        `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${startDate}/${endDate}`,
        { timeout: 45000 }
      ).then(res => res.data.data).catch(() => {
        console.warn("Direct session API failed, using chunked approach");
        return getSessionDataChunked(startDate, endDate, 21); // Larger chunks
      }),
      fetchAllArticles(startDate, endDate, 10) // Higher concurrency
    ]);

    // Handle results
    const sessionData = sessionDataResult.status === 'fulfilled' ? sessionDataResult.value : [];
    const allArticles = articlesResult.status === 'fulfilled' ? articlesResult.value : [];

    if (sessionData.length === 0 || allArticles.length === 0) {
      console.warn("No data available for processing");
      return { success: true, total: 0, page: Number(page), limit: Number(limit), data: [] };
    }

    console.log(`Data fetched in ${Date.now() - startTime}ms`);

    // Pre-filter articles
    const filteredArticles = filterArticles(allArticles, author, category);
    
  
    const articleMap = new Map();
    for (const article of filteredArticles) {
      if (article.externalId) {
        articleMap.set(article.externalId, article);
      }
    }

    console.log(`Processing ${sessionData.length} sessions against ${articleMap.size} filtered articles`);

    // Process sessions with optimized aggregation
    const authorStats = {};
    let processedSessions = 0;

    for (const session of sessionData) {
      const externalId = extractExternalId(session.pagePath);
      if (!externalId || !articleMap.has(externalId)) continue;

      const article = articleMap.get(externalId);
      const authorFullName = `${article.author?.first_name || ""} ${article.author?.last_name || ""}`.trim();
      if (!authorFullName) continue;

      // Initialize or get existing stats
      let stat = authorStats[authorFullName];
      if (!stat) {
        stat = authorStats[authorFullName] = {
          articleCount: 0,
          totalDurationSeconds: 0,
          totalBounceRate: 0,
          bounceCount: 0,
          categories: new Set(),
        };
      }

      stat.articleCount++;

      // Parse duration efficiently
      if (session.averageDuration) {
        const parts = session.averageDuration.split(":");
        if (parts.length === 3) {
          stat.totalDurationSeconds += 
            (parseInt(parts[0]) || 0) * 3600 + 
            (parseInt(parts[1]) || 0) * 60 + 
            (parseInt(parts[2]) || 0);
        }
      }

      // Parse bounce rate
      if (session.bounceRate != null && session.bounceRate !== "") {
        const br = parseFloat(session.bounceRate);
        if (!isNaN(br)) {
          stat.totalBounceRate += br;
          stat.bounceCount++;
        }
      }

      // Add category
      if (article.category?.name) {
        stat.categories.add(article.category.name);
      }

      processedSessions++;
    }

    console.log(`Processed ${processedSessions} sessions for ${Object.keys(authorStats).length} authors`);

    // Generate final results
    const allResults = Object.entries(authorStats).map(([authorName, stat]) => ({
      author: authorName,
      articleCount: stat.articleCount,
      totalDuration: formatDuration(stat.totalDurationSeconds),
      avgDuration: formatDuration(Math.floor(stat.totalDurationSeconds / stat.articleCount)),
      avgBounceRate: stat.bounceCount > 0 ? 
        Math.round((stat.totalBounceRate / stat.bounceCount) * 100) / 100 : 0,
      categories: Array.from(stat.categories),
    }));

    // Sort by article count (descending) for better UX
    allResults.sort((a, b) => b.articleCount - a.articleCount);

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginated = allResults.slice(startIndex, startIndex + limit);

    const totalTime = Date.now() - startTime;
    console.log(`Completed in ${totalTime}ms`);

    return {
      success: true,
      total: allResults.length,
      page: Number(page),
      limit: Number(limit),
      processingTimeMs: totalTime,
      data: paginated,
    };

  } catch (error) {
    console.error("getJournalistProductivity error:", error.message);
    throw error;
  }
}