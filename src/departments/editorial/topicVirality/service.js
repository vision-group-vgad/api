import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

class TopicVirality {
  constructor() {
    this.initialized = false;
    this.BACKEND_URL = "https://cms-vgad.visiongroup.co.ug"; // This is not right!
    this.API_KEY = process.env.CMS_API_KEY;

    if (!this.API_KEY) {
      throw new Error("Missing required environment variable: CMS_API_KEY");
    }
  }

  initialize() {
    if (this.initialized) return;

    this.apiClient = axios.create({
      baseURL: this.BACKEND_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        const status = response?.status || "NO_STATUS";
        const msg = response?.data?.message || error.message || "Unknown error";
        console.error(`[TopicVirality] HTTP ${status}: ${msg}`);
        return Promise.reject(new Error(`TopicVirality API Error: ${msg}`));
      }
    );

    this.initialized = true;
  }

  #buildQueryParams({ category, author }) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (author) params.append("author", author);
    return params.toString() ? `?${params.toString()}` : "";
  }

  async getArticlesByOffset({
    startDate,
    endDate,
    offset = 0,
    category = null,
    author = null,
  }) {
    if (!startDate || !endDate)
      throw new Error("Both startDate and endDate must be provided.");
    this.initialize();

    const query = this.#buildQueryParams({ category, author });
    const url = `/api/api-listings/articles/${startDate}/${endDate}/${offset}${query}`;

    console.log("[TopicVirality] Requesting:", url);

    const response = await this.apiClient.get(url);
    const data = response?.data;

    if (!data?.data || !Array.isArray(data.data)) {
      throw new Error(
        "Invalid response format: expected data.data to be an array."
      );
    }

    return {
      data: data.data,
      meta: data.meta || {},
    };
  }

  async getAllArticles({ startDate, endDate, category = null, author = null }) {
    if (!startDate || !endDate)
      throw new Error("Both startDate and endDate must be provided.");
    this.initialize();

    const limit = 10;
    let offset = 0;
    let total = null;
    const allArticles = [];

    while (total === null || offset < total) {
      const { data, meta } = await this.getArticlesByOffset({
        startDate,
        endDate,
        offset,
        category,
        author,
      });

      allArticles.push(...data);
      total = meta.totalCount;
      offset += limit;
    }

    return {
      data: allArticles,
      meta: {
        totalCount: allArticles.length,
        pageSize: limit,
        pageCount: Math.ceil(allArticles.length / limit),
      },
    };
  }
}

const topicVirality = new TopicVirality();

export const getTopicVirality = async ({ year, month, category, author }) => {
  const paddedMonth = month ? String(month).padStart(2, "0") : null;

  let start, end;

  if (paddedMonth) {
    start = `${year}-${paddedMonth}-01`;

    // Calculate the last day of the month
    const nextMonth = new Date(year, parseInt(paddedMonth), 1);
    nextMonth.setDate(0); // Go back one day to get last day of current month
    const lastDay = String(nextMonth.getDate()).padStart(2, "0");
    end = `${year}-${paddedMonth}-${lastDay}`;
  } else {
    start = `${year}-01-01`;
    end = `${year}-12-31`;
  }

  return await topicVirality.getAllArticles({
    startDate: start,
    endDate: end,
    category,
    author,
  });
};
