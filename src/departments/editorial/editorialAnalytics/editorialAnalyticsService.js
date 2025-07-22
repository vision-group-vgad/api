import axios from "axios";

// Simple in-memory cache for batch fetches
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
      timeout: 30000,
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

  // Fetch ALL session data for the date range (NO pagination in URL)
  async fetchAllSessions({ startDate, endDate, platform, sessionMedium, streamName }) {
    this.initialize();
    console.log("🔍 [Service] fetchAllSessions called", { startDate, endDate, platform, sessionMedium, streamName });
    const cacheKey = `sessions_${startDate}_${endDate}_${platform || "all"}_${sessionMedium || "all"}_${streamName || "all"}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log("💾 [Service] Returning cached sessions:", data.length);
        return { sessions: data, totalCount: data.length };
      }
    }
    const endpoint = `/api-listings/article-session-duration/${startDate}/${endDate}`;
    const params = {};
    if (platform) params.platform = platform;
    if (sessionMedium) params.sessionMedium = sessionMedium;
    if (streamName) params.streamName = streamName;
    try {
      console.log(`🌐 [Service] Fetching all sessions for range, no offset`);
      const res = await this.apiClient.get(endpoint, { params });
      const sessions = res.data.data || [];
      const totalCount = sessions.length;
      cache.set(cacheKey, { data: sessions, totalCount, timestamp: Date.now() });
      console.log(`✅ [Service] Fetched sessions: ${sessions.length}`);
      return { sessions, totalCount };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn("⚠️ [Service] No sessions found for range, returning empty array");
        return { sessions: [], totalCount: 0 };
      }
      console.error("❌ [Service] Error in fetchAllSessions:", error.message);
      throw error;
    }
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
    const { articles, totalCount: articleTotalCount } = await this.fetchAllArticles({ ...sessionFilters, category, page, pageSize });
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
    const totalPages = Math.ceil(articleTotalCount / pageSize);

    console.log(`📄 [Service] Paginated records: page=${page} size=${pageSize} totalPages=${totalPages}, returned=${joined.length}`);

    return {
      data: joined,
      total: articleTotalCount,
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