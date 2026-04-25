import axios from "axios";

// Simple in-memory cache for batch fetches
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const UPSTREAM_TIMEOUT_MS = Number(process.env.EDITORIAL_ANALYTICS_TIMEOUT_MS || 3000);

// Helper to format dates as YYYY-MM-DD
const formatDate = (date) => date.toISOString().slice(0, 10);
// Helper to add days to a Date object
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


class EditorialAnalyticsService {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    this.baseURL = process.env.CMC_API_BASE_URL || "https://cms-vgad.visiongroup.co.ug/api";
    this.bearerToken = process.env.CMC_API_BEARER_TOKEN;
    this.credentials = {
      username: process.env.CMC_API_USERNAME || "intern-developer@newvision.co.ug",
      password: process.env.CMC_API_PASSWORD || "45!3@Vgad2025",
    };

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: UPSTREAM_TIMEOUT_MS,
      headers: { "Content-Type": "application/json" },
    });

    this.setupAuthentication();
    this.initialized = true;
    console.log("🔧 [Service] EditorialAnalyticsService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 [Service] Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 [Service] Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [Service] Editorial API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Fetch ONE page of article metadata (true pagination)
  async fetchAllArticles({ startDate, endDate, category, page = 1, pageSize = 10 }) {
    this.initialize();
    console.log("🔍 [Service] fetchAllArticles called", { startDate, endDate, category, page, pageSize });
    const cacheKey = `articles_${startDate}_${endDate}_${category || "all"}_${page}_${pageSize}`;
    if (cache.has(cacheKey)) {
      const { data, totalCount, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log("💾 [Service] Returning cached articles:", data.length);
        return { articles: data, totalCount };
      }
    }

    const offset = (Number(page) - 1) * Number(pageSize);
    const endpoint = `/api-listings/articles/${startDate}/${endDate}/${offset}`;
    const params = {};
    if (category) params.category = category;

    try {
      console.log(`🌐 [Service] Fetching articles at offset ${offset}, pageSize ${pageSize}`);
      const res = await this.apiClient.get(endpoint, { params });
      const articles = res.data.data || [];
      const totalCount = res.data.meta?.totalCount || articles.length;

      cache.set(cacheKey, { data: articles, totalCount, timestamp: Date.now() });
      console.log(`✅ [Service] Fetched articles: ${articles.length} (page ${page}, totalCount: ${totalCount})`);
      return { articles, totalCount };
    } catch (error) {
      console.error("❌ [Service] Error in fetchAllArticles:", error.message);
      throw error;
    }
  }

// Fetch ALL session data for the date range (split into manageable chunks to avoid timeout)
  async fetchAllSessions({ startDate, endDate, platform, sessionMedium, streamName }) {
    this.initialize();
    console.log("🔍 [Service] fetchAllSessions called", { startDate, endDate, platform, sessionMedium, streamName });
    const cacheKey = `sessions_${startDate}_${endDate}_${platform || "all"}_${sessionMedium || "all"}_${streamName || "all"}`;
    if (cache.has(cacheKey)) {
      const { data, totalCount, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log("💾 [Service] Returning cached sessions:", data.length);
        return { sessions: data, totalCount };
      }
    }

    // Break up the date range if needed
    const maxDaysPerChunk = 365; // adjust as needed to avoid API timeouts
    let allSessions = [];
    let totalCount = 0;
    let chunkStart = new Date(startDate);
    const chunkEndDate = new Date(endDate);
    

    // Improved chunking: only request if chunkStart < chunkEnd
// ...inside fetchAllSessions...
// ...inside fetchAllSessions...
    while (chunkStart < chunkEndDate) {
      // Make chunkEnd exclusive
      const chunkEnd = addDays(chunkStart, maxDaysPerChunk);
      const actualChunkEnd = chunkEnd > addDays(chunkEndDate, 1) ? addDays(chunkEndDate, 1) : chunkEnd;
      const chunkStartStr = formatDate(chunkStart);
      const chunkEndStr = formatDate(actualChunkEnd);

      // Only request if chunkEnd > chunkStart
      if (chunkStartStr < chunkEndStr) {
        const endpoint = `/api-listings/article-session-duration/${chunkStartStr}/${chunkEndStr}`;
        const params = {};
        if (platform) params.platform = platform;
        if (sessionMedium) params.sessionMedium = sessionMedium;
        if (streamName) params.streamName = streamName;

        try {
          console.log(`🌐 [Service] Fetching sessions for chunk: ${chunkStartStr} - ${chunkEndStr}`);
          const res = await this.apiClient.get(endpoint, { params });
          const sessions = res.data.data || [];
          allSessions = allSessions.concat(sessions);
          totalCount += sessions.length;
          if (res.data.total >= 12000) {
            console.warn(`⚠️ [Service] Chunk ${chunkStartStr} - ${chunkEndStr} hit 10,000 record limit! Data may be incomplete for this chunk.`);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn(`⚠️ [Service] No sessions found for chunk ${chunkStartStr} - ${chunkEndStr}, skipping.`);
          } else {
            console.error("❌ [Service] Error in fetchAllSessions:", error.message);
            throw error;
          }
        }
        await sleep(300); // Add a 300ms pause between requests


      }

      chunkStart = actualChunkEnd;
    }

    cache.set(cacheKey, { data: allSessions, totalCount, timestamp: Date.now() });
    console.log(`✅ [Service] Fetched sessions: ${allSessions.length}`);
    return { sessions: allSessions, totalCount: allSessions.length };
  }

  // Join session and article data by externalId/pagePath or title, filter as needed, and paginate results
  async fetchJoinedData(filters) {
    console.log("🔗 [Service] fetchJoinedData called", filters);
    const {
      category,
      author,
      editor,
      page = 1,
      pageSize = 10,
      ...sessionFilters
    } = filters;

    // Only fetch the current page of articles!
    const { articles } = await this.fetchAllArticles({ ...sessionFilters, category, page, pageSize });
    const { sessions, totalCount: sessionTotalCount } = await this.fetchAllSessions(sessionFilters);

    // Build lookup
    const articleByExternalId = new Map();
    const articleByTitle = new Map();
    articles.forEach(a => {
      if (a.externalId) articleByExternalId.set(a.externalId, a);
      if (a.title) articleByTitle.set(a.title.trim(), a);
    });

    // Join
    let joined = sessions.map(session => {
      let article = null;
      if (session.pagePath) {
        const match = session.pagePath.match(/([A-Z]+_\d+)/);
        if (match) article = articleByExternalId.get(match[1]);
      }
      if (!article && session.pageTitle) article = articleByTitle.get(session.pageTitle.trim());

      return {
        ...session,
        articleId: article?.id,
        articleExternalId: article?.externalId,
        title: article?.title || session.pageTitle,
        category: article?.category?.name || null,
        author: article?.author ? `${article.author.first_name} ${article.author.last_name}` : null,
        authors: article?.authors?.map(a => `${a.first_name} ${a.last_name}`),
        editor: article?.editor
          ? `${article.editor.first_name} ${article.editor.last_name}`
          : null,
        published_on: article?.published_on,
        tags: article?.tags || [],
      };
    });

    // Filter by author/editor/category if provided
    if (author) joined = joined.filter(j => j.author && j.author.toLowerCase().includes(author.toLowerCase()));
    if (editor) joined = joined.filter(j => j.editor && j.editor.toLowerCase().includes(editor.toLowerCase()));
    if (category) joined = joined.filter(j => j.category && j.category.toLowerCase().includes(category.toLowerCase()));

    // Pagination meta
    const totalPages = Math.ceil(joined.length / pageSize); // Use joined.length for pagination

    const startIdx = (page - 1) * pageSize;
    const paginated = joined.slice(startIdx, startIdx + pageSize);

    console.log(`📄 [Service] Paginated records: page=${page} size=${pageSize} totalPages=${totalPages}, returned=${paginated.length}`);

    return {
      data: paginated,
      total: joined.length,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages,
      sessionTotal: sessionTotalCount
    };
  
  }

  async getKPIs(filters) {
    console.log("📊 [Service] getKPIs called", filters);
    // Use first 1000 articles for KPIs to avoid huge memory use
    const { articles } = await this.fetchAllArticles({ ...filters, page: 1, pageSize: 1000 });
    const { sessions } = await this.fetchAllSessions(filters);

    // Build lookup maps
    const articleByExternalId = new Map();
    const articleByTitle = new Map();
    articles.forEach(a => {
      if (a.externalId) articleByExternalId.set(a.externalId, a);
      if (a.title) articleByTitle.set(a.title.trim(), a);
    });

    let joined = sessions.map(session => {
      let article = null;
      if (session.pagePath) {
        const match = session.pagePath.match(/([A-Z]+_\d+)/);
        if (match) article = articleByExternalId.get(match[1]);
      }
      if (!article && session.pageTitle) article = articleByTitle.get(session.pageTitle.trim());

      return {
        ...session,
        articleId: article?.id,
        articleExternalId: article?.externalId,
        title: article?.title || session.pageTitle,
        category: article?.category?.name || null,
        author: article?.author ? `${article.author.first_name} ${article.author.last_name}` : null,
        authors: article?.authors?.map(a => `${a.first_name} ${a.last_name}`),
        editor: article?.editor
          ? `${article.editor.first_name} ${article.editor.last_name}`
          : null,
        published_on: article?.published_on,
        tags: article?.tags || [],
      };
    });

    const data = joined;
    const total = data.length;
    const totalDuration = data.reduce((s, d) => s + this.toSeconds(d.averageDuration), 0);
    const totalBounce = data.reduce((s, d) => s + Number(d.bounceRate || 0), 0);
    const uniquePlatforms = [...new Set(data.map((d) => d.platform))];
    const uniqueStreams = [...new Set(data.map((d) => d.streamName))];
    const uniqueMediums = [...new Set(data.map((d) => d.sessionMedium))];
    const uniqueTitles = [...new Set(data.map((d) => d.title))];
    const uniqueAuthors = [...new Set(data.map((d) => d.author))];
    const uniqueEditors = [...new Set(data.map((d) => d.editor))];
    const uniqueCategories = [...new Set(data.map((d) => d.category))];
    const outboundCount = data.filter((d) => d.outbound === "true").length;

    console.log(`📊 [Service] KPIs calculated: total=${total}, avgDuration=${Math.round(totalDuration / (total || 1))}`);

    return {
      totalArticles: total,
      totalPlatforms: uniquePlatforms.length,
      totalStreams: uniqueStreams.length,
      totalSessionMediums: uniqueMediums.length,
      totalPageTitles: uniqueTitles.length,
      totalAuthors: uniqueAuthors.length,
      totalEditors: uniqueEditors.length,
      totalCategories: uniqueCategories.length,
      averageDurationInSec: Math.round(totalDuration / (total || 1)),
      averageBounceRate: (totalBounce / (total || 1)).toFixed(2),
      outboundEngagementRate: (outboundCount / (total || 1)).toFixed(2),
      totalOutboundArticles: outboundCount,
    };
  }

  async getPlatforms() {
    this.initialize();
    const cacheKey = "all_platforms";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allPlatforms = new Set();
    let startYear = 2020; // adjust to earliest data year
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      const { sessions } = await this.fetchAllSessions({ startDate: chunkStart, endDate: chunkEnd });
      sessions.forEach(s => s.platform && allPlatforms.add(s.platform));
      await sleep(200);
    }
    const result = Array.from(allPlatforms);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getStreams() {
    this.initialize();
    const cacheKey = "all_streams";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allStreams = new Set();
    let startYear = 2020;
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      const { sessions } = await this.fetchAllSessions({ startDate: chunkStart, endDate: chunkEnd });
      sessions.forEach(s => s.streamName && allStreams.add(s.streamName));
      await sleep(200);
    }
    const result = Array.from(allStreams);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getSessionMediums() {
    this.initialize();
    const cacheKey = "all_session_mediums";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allMediums = new Set();
    let startYear = 2020;
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      const { sessions } = await this.fetchAllSessions({ startDate: chunkStart, endDate: chunkEnd });
      sessions.forEach(s => s.sessionMedium && allMediums.add(s.sessionMedium));
      await sleep(200);
    }
    const result = Array.from(allMediums);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getAuthors() {
    this.initialize();
    const cacheKey = "all_authors";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allAuthors = new Set();
    let startYear = 2020;
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      // Loop through pages for each year
      let page = 1, pageSize = 100;
      while (true) {
        const { articles } = await this.fetchAllArticles({ startDate: chunkStart, endDate: chunkEnd, page, pageSize });
        if (!articles.length) break;
        articles.forEach(a => a.author && allAuthors.add(`${a.author.first_name} ${a.author.last_name}`));
        if (articles.length < pageSize) break;
        page++;
        await sleep(200);
      }
    }
    const result = Array.from(allAuthors);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getEditors() {
    this.initialize();
    const cacheKey = "all_editors";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allEditors = new Set();
    let startYear = 2020;
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      let page = 1, pageSize = 100;
      while (true) {
        const { articles } = await this.fetchAllArticles({ startDate: chunkStart, endDate: chunkEnd, page, pageSize });
        if (!articles.length) break;
        articles.forEach(a => a.editor && allEditors.add(`${a.editor.first_name} ${a.editor.last_name}`));
        if (articles.length < pageSize) break;
        page++;
        await sleep(200);
      }
    }
    const result = Array.from(allEditors);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getCategories() {
    this.initialize();
    const cacheKey = "all_categories";
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }
    let allCategories = new Set();
    let startYear = 2020;
    let endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      const chunkStart = `${year}-01-01`;
      const chunkEnd = `${year}-12-31`;
      let page = 1, pageSize = 100;
      while (true) {
        const { articles } = await this.fetchAllArticles({ startDate: chunkStart, endDate: chunkEnd, page, pageSize });
        if (!articles.length) break;
        articles.forEach(a => a.category?.name && allCategories.add(a.category.name));
        if (articles.length < pageSize) break;
        page++;
        await sleep(200);
      }
    }
    const result = Array.from(allCategories);
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  }

  async getChartData({ metric, groupBy, ...filters }) {
    console.log("📈 [Service] getChartData called", { metric, groupBy, ...filters });
    // Use first 1000 articles for charts to avoid huge memory use
    const { articles } = await this.fetchAllArticles({ ...filters, page: 1, pageSize: 1000 });
    const { sessions } = await this.fetchAllSessions(filters);

    // Build lookup maps
    const articleByExternalId = new Map();
    const articleByTitle = new Map();
    articles.forEach(a => {
      if (a.externalId) articleByExternalId.set(a.externalId, a);
      if (a.title) articleByTitle.set(a.title.trim(), a);
    });

    let joined = sessions.map(session => {
      let article = null;
      if (session.pagePath) {
        const match = session.pagePath.match(/([A-Z]+_\d+)/);
        if (match) article = articleByExternalId.get(match[1]);
      }
      if (!article && session.pageTitle) article = articleByTitle.get(session.pageTitle.trim());

      return {
        ...session,
        articleId: article?.id,
        articleExternalId: article?.externalId,
        title: article?.title || session.pageTitle,
        category: article?.category?.name || null,
        author: article?.author ? `${article.author.first_name} ${article.author.last_name}` : null,
        authors: article?.authors?.map(a => `${a.first_name} ${a.last_name}`),
        editor: article?.editor
          ? `${article.editor.first_name} ${article.editor.last_name}`
          : null,
        published_on: article?.published_on,
        tags: article?.tags || [],
      };
    });

    // Group by key, aggregate metric
    const groups = {};
    joined.forEach((item) => {
      const key = item[groupBy] || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    // Aggregate per group
    const chartData = Object.entries(groups).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, d) => sum + this.toSeconds(d[metric] || 0), 0) / items.length,
      count: items.length,
    }));
    console.log(`📈 [Service] Chart data generated: ${chartData.length} groups`);
    return chartData;
  }

  toSeconds(time) {
    if (typeof time === 'number') return time;
    if (typeof time !== 'string') return 0;
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    // Handle numeric strings
    if (!isNaN(Number(time))) return Number(time);
    return 0;
  }
}

export default new EditorialAnalyticsService();