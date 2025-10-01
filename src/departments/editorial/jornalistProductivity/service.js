import axios from "axios";
import axiosRetry from "axios-retry";
import { extractExternalId } from "../utils.js";
import { journalistData } from "./dummy.js"; 

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

  

  // Process all chunks concurrently
  const promises = chunks.map(async (chunk, index) => {
    try {
      const url = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${chunk.start}/${chunk.end}`;
      const response = await axiosInstance.get(url);
      
      return response.data.data;
    } catch (error) {
     
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
    
    return articlesCache;
  }

  try {
    

    const firstRes = await axiosInstance.get(
      `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/0`
    );

    const totalCount = firstRes.data.meta.totalCount;
    const totalPages = Math.ceil(totalCount / 10);
    

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

    

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      

      const promises = batch.map(async (offset) => {
        try {
          const response = await axiosInstance.get(
            `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/${offset}`
          );
          return response.data.data;
        } catch (err) {
          
          return [];
        }
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach((articles) => results.push(...articles));

      if (batchIndex < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

   

    // Cache the results
    articlesCache = results;
    articlesCacheTimestamp = Date.now();

    return results;
  } catch (error) {
    
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
  limit = 20, // <-- only fetch this many results
  sort = "articleCount",
  order = "desc",
}) {
  const startTime = Date.now();

  try {
    const pageSize = 10; // CMS API returns 10 per page
    const startOffset = (page - 1) * limit;
    const neededPages = Math.ceil((startOffset + limit) / pageSize);

    let articles = [];

    // Fetch only enough pages to cover the requested limit
    for (let i = 0; i < neededPages; i++) {
      const offset = i * pageSize;
      const res = await axiosInstance.get(
        `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles/${startDate}/${endDate}/${offset}`
      );
      articles.push(...(res.data?.data || []));

      // Stop early if we already have enough
      if (articles.length >= startOffset + limit) break;
    }

    // Filter by author/category
    const filteredArticles = articles.filter(article => {
      const authorName = `${article.author?.first_name || ""} ${article.author?.last_name || ""}`.trim().toLowerCase();
      const categoryName = article.category?.name?.toLowerCase() || "";
      const authorMatch = author ? authorName.includes(author.toLowerCase()) : true;
      const categoryMatch = category ? categoryName.includes(category.toLowerCase()) : true;
      return authorMatch && categoryMatch;
    });

    // Slice for pagination
    const paginatedArticles = filteredArticles.slice(startOffset, startOffset + limit);

    // Fetch session data for these articles
    const sessionsRes = await axiosInstance.get(
      `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration/${startDate}/${endDate}`
    );
    const sessions = sessionsRes.data?.data || [];

    // Map sessions to articles
    const articleMap = new Map();
    paginatedArticles.forEach(a => {
      if (a.externalId) articleMap.set(a.externalId, a);
    });

    const results = paginatedArticles.map(article => {
      const match = sessions.find(
        s => s.pagePath.endsWith(article.externalId) || s.pagePath.includes(article.externalId)
      );
      const [h, m, s] = (match?.averageDuration || "00:00:00").split(":").map(Number);
      return {
        author: `${article.author?.first_name || ""} ${article.author?.last_name || ""}`.trim(),
        title: article.title,
        category: article.category?.name || "",
        avgDuration: `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`,
        bounceRate: parseFloat(match?.bounceRate || 0),
      };
    });

    return {
      success: true,
      total: filteredArticles.length,
      page,
      limit,
      data: results,
      processingTimeMs: Date.now() - startTime,
    };

  } catch (err) {
    
    return { success: false, error: err.message };
  }
}


/**
 * Dummy Data Fetcher
 * Returns all dummy journalist data, optionally filtered by author, category, and date range
 */
export async function getDummyJournalistProductivity({
  author,
  category,
  startDate,
  endDate,
}) {
  try {
    let data = journalistData;

    // Filter by author
    if (author) {
      data = data.filter(d =>
        d.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      data = data.filter(d =>
        d.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by date range if publishDate exists
    if (startDate || endDate) {
      data = data.filter(d => {
        if (!d.publishDate) return false;
        const publishTime = new Date(d.publishDate).getTime();
        const startTime = startDate ? new Date(startDate).getTime() : -Infinity;
        const endTime = endDate ? new Date(endDate).getTime() : Infinity;
        return publishTime >= startTime && publishTime <= endTime;
      });
    }

    return {
      success: true,
      total: data.length,
      data,
    };
  } catch (err) {
    
    return { success: false, error: err.message };
  }
}