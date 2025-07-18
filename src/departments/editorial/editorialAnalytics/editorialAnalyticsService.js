import axios from "axios";

/**
 * EditorialAnalyticsService
 * Handles fetching and transforming editorial analytics data from CMC API.
 */
class EditorialAnalyticsService {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  /**
   * Initialize Axios client with authentication.
   */
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

    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("Editorial API Error:", error.response?.data || error.message);
        throw error;
      }
    );

    this.initialized = true;
  }

  /**
   * Fetch editorial session analytics from CMC API.
   * @param {Object} filters - Filtering options (may include limit/offset)
   * @returns {Promise<Array>} - Array of editorial analytics objects
   */
  async getEditorialSessionAnalytics(filters = {}) {
    this.initialize();

    try {
      let endpoint = "/api-listings/article-session-duration";
      if (filters.startDate && filters.endDate) {
        endpoint = `/api-listings/article-session-duration/${filters.startDate}/${filters.endDate}`;
      }

      const params = {};
      if (filters.platform) params.platform = filters.platform;
      if (filters.streamName) params.streamName = filters.streamName;
      if (filters.pageTitle) params.pageTitle = filters.pageTitle;
      if (filters.sessionMedium) params.sessionMedium = filters.sessionMedium;
      // Pass limit and offset if present (for API-side pagination)
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;

      console.log("Editorial API request:", endpoint, params);

      const response = await this.apiClient.get(endpoint, { params });
      const data = response.data.data || [];

      console.log("Editorial API response data length:", data.length);

      return this.transformEditorialData(data);
    } catch (error) {
      console.warn("⚠️ Using dummy editorial data - API not available:", error.message);
      return this.getDummyEditorialData();
    }
  }

  /**
   * Transform raw CMC API data to analytics-ready structure.
   * @param {Array} data
   * @returns {Array}
   */
  transformEditorialData(data) {
    if (!Array.isArray(data)) return [];

    return data.map((entry) => ({
      pageTitle: entry.attributes?.Page_Title || entry.pageTitle,
      pagePath: entry.attributes?.Page_Path || entry.pagePath,
      streamName: entry.attributes?.Stream_Name || entry.streamName,
      platform: entry.attributes?.Platform || entry.platform,
      pageLocation: entry.attributes?.Page_Location || entry.pageLocation,
      pageReferrer: entry.attributes?.Page_Referrer || entry.pageReferrer,
      sessionMedium: entry.attributes?.Session_Medium || entry.sessionMedium,
      percentScrolled: entry.attributes?.Percent_Scrolled || entry.percentScrolled,
      outbound: entry.attributes?.Outbound || entry.outbound,
      // Always return averageDuration as seconds (number)
      averageDuration: this.convertDurationToSeconds(
        entry.attributes?.Average_Duration ?? entry.averageDuration
      ),
      bounceRate: parseFloat(entry.attributes?.Bounce_Rate ?? entry.bounceRate) || 0,
    }));
  }

  /**
   * Convert duration string "HH:MM:SS" or numeric seconds to seconds (number).
   * @param {string|number} duration
   * @returns {number}
   */
  convertDurationToSeconds(duration) {
    if (!duration) return 0;
    if (typeof duration === "number") return duration;
    if (typeof duration !== "string") return 0;

    const parts = duration.split(":").map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    } else if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    return 0;
  }

  /**
   * Get high-level KPIs for editorial analytics.
   * @param {Object} filters
   * @returns {Promise<Object>}
   */
  async getEditorialKPIs(filters = {}) {
    const data = await this.getEditorialSessionAnalytics(filters);

    const totalArticles = data.length;
    const averageDuration =
      data.reduce((acc, d) => acc + d.averageDuration, 0) / (data.length || 1);
    const bounceRate =
      data.reduce((acc, d) => acc + d.bounceRate, 0) / (data.length || 1);

    const platforms = data.reduce((acc, d) => {
      acc[d.platform] = (acc[d.platform] || 0) + 1;
      return acc;
    }, {});

    return {
      totalArticles,
      averageDuration: Math.round(averageDuration),
      bounceRate: bounceRate.toFixed(2),
      platformDistribution: platforms,
    };
  }

  /**
   * Dummy data for development/fallback.
   * @returns {Array}
   */
  getDummyEditorialData() {
    return [
      {
        pageTitle: "404 Not Found - New Vision Official",
        pagePath: "/articledetails/NV_205125",
        streamName: "New Vision Website",
        platform: "web",
        pageLocation: "https://www.newvision.co.ug/articledetails/NV_205125",
        pageReferrer: "https://preview.page.link/",
        sessionMedium: "referral",
        percentScrolled: "",
        outbound: "",
        averageDuration: this.convertDurationToSeconds("03:39:56"),
        bounceRate: 0,
      },
      {
        pageTitle: "Eyasasaanyizza akatambi ka Nampeera...",
        pagePath: "/articledetails/BUK_140198",
        streamName: "New Vision Website",
        platform: "web",
        pageLocation: "https://www.newvision.co.ug/category/amawulire/eyasasaanyizza-akatambi-ka-nampeera-ngakola-s-BUK_140198",
        pageReferrer: "",
        sessionMedium: "organic",
        percentScrolled: "",
        outbound: "",
        averageDuration: this.convertDurationToSeconds("23:15:56"),
        bounceRate: 1,
      },
    ];
  }
}

export default new EditorialAnalyticsService();