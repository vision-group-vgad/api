import axios from "axios";
import { getDurationInMinutes } from "../../../utils/common/common-functionalities.js";

class BacklogMgtController {
  constructor() {
    this.initialized = false;
    this.BACKEND_URL = process.env.CMC_API_BASE_URL;
    this.API_KEY = process.env.CMS_API_KEY;
  }

  initialize() {
    if (this.initialized) return;

    this.apiClient = axios.create({
      baseURL: this.BACKEND_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.API_KEY}`;
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData(url) {
    this.initialize();
    // const url = `/api-listings/article-session-duration/${startDate}/${endDate}`;

    try {
      const response = await this.apiClient.get(url);
      const articles = response.data?.data || [];
      const metaData = response.data?.meta || [];

      return { articles, metaData };
    } catch (error) {
      throw new error();
    }
  }

  async #fetchRemainingArticles(allArticles, remainingArticles, url) {
    for (let i = 10; i <= remainingArticles; i += 10) {
      const endPoint = `${url}/${i}`;
      const results = await this.#fetchData(endPoint);
      allArticles = [...allArticles, ...results.articles];
    }
    return allArticles;
  }

  #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const status = article.published_on ? "Published" : "Pending";
      const publishedOn = article.published_on ? article.published_on : "none";
      const editingDuration = getDurationInMinutes(
        article.created_on,
        article.published_on
      );
      return {
        id: article.id,
        title: article.title,
        createdOn: article.created_on,
        publishedOn: publishedOn,
        editingDurationInMinutes: editingDuration,
        category: article.category.name,
        author: `${article.author.first_name} ${article.author.last_name}`,
        status: status,
        challenges: [],
      };
    });
    return processedArticles;
  }

  async getAnnualBacklogMgtMetrics(year) {
    let allArticles = [];
    const maxArticleLimit = 10;
    const rawUrl = `/api-listings/articles/${year}-01-01/${year}-12-31`;
    const url = `${rawUrl}/0`;
    const rawData = await this.#fetchData(url);
    allArticles = [...rawData.articles];
    const allArticleCount = rawData.metaData.pagination.total;
    if (allArticleCount > maxArticleLimit) {
      const remainingArticles = allArticleCount - maxArticleLimit;
      await this.#fetchRemainingArticles(
        allArticles,
        remainingArticles,
        rawUrl
      );
    }
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }

  async getInRangeBacklogMgtMetrics(startDate, endDate) {
    let allArticles = [];
    const maxArticleLimit = 10;
    const rawUrl = `/api-listings/articles/${startDate}/${endDate}`;
    const url = `${rawUrl}/0`;
    const rawData = await this.#fetchData(url);
    allArticles = [...rawData.articles];
    const allArticleCount = rawData.metaData.pagination.total;
    if (allArticleCount > maxArticleLimit) {
      const remainingArticles = allArticleCount - maxArticleLimit;
      await this.#fetchRemainingArticles(
        allArticles,
        remainingArticles,
        rawUrl
      );
    }
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }
}

export default BacklogMgtController;
