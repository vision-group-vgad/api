import axios from "axios";
import axiosRetry from "axios-retry";
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

// Main function with optimizations
export async function getJournalistProductivity({
  startDate,
  endDate,
  author,
  category,
  page = 1,
  limit = 20, // <-- only fetch this many results
  sort: _sort = "articleCount",
  order: _order = "desc",
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