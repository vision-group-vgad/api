import axios from "axios";
import { truncateToDecimals } from "../../../utils/common/common-functionalities.js";

class VersionControlController {
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
      const allData = response.data?.data || [];
      const splicedData = allData.splice(0, 300);

      return splicedData;
    } catch (error) {
      throw new error();
    }
  }

  async #aggregateData() {
    const dataset1Url = `/api-listings/articles/2025-01-02/2025-02-02/0`;
    const dataset2Url = `/api-listings/articles/2025-01-02/2025-02-02/10`;
    const dataset3Url = `/api-listings/articles/2025-01-02/2025-02-02/20`;

    const dataset1 = await this.#fetchData(dataset1Url);
    const dataset2 = await this.#fetchData(dataset2Url);
    const dataset3 = await this.#fetchData(dataset3Url);

    let aggregatedArticles = [];
    aggregatedArticles = [...dataset1, ...dataset2, ...dataset3];

    return aggregatedArticles;
  }

  async getAnnualData() {
    const articles = await this.#aggregateData();
    return this.#processArticles(articles);
  }

  #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const authors = article.authors.map((author) => {
        `${author.first_name} ${author.last_name}`;
      });
      return {
        title: article.title,
        dateCreated: article.created_on,
        datePublished: article.published_on,
        category: article.category.name,
        tags: [...article.tags],
        authors: [...authors],
        editor: `${article.editor.first_name} ${article.editor.last_name}`,
      };
    });
    return {
      articles: [...processedArticles],
      summary: {
        totalArticles: this.#getTotalArticles(articles),
        articlesPerDay: this.#getArticlesPerDay(articles),
        uniqueEditorCount: this.#getUniqueEditorsCount(articles),
        articleByCategory: this.#getArticlesByCategory(articles),
        uniqueTagsCount: this.#getUniqueTagsCount(articles),
        avgPulbishDelay: truncateToDecimals(
          this.#getAveragePublishDelay(articles),
          1
        ),
      },
    };
  }

  #getTotalArticles(articles) {
    return articles.length;
  }

  #getArticlesPerDay(articles) {
    return articles.reduce((acc, article) => {
      const day = new Date(article.created_on).toISOString().split("T")[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
  }

  #getUniqueEditorsCount(articles) {
    const editors = new Set();
    articles.forEach((article) => {
      if (article.editor && article.editor.id) {
        editors.add(article.editor.id);
      }
    });
    return editors.size;
  }

  #getArticlesByCategory(articles) {
    return articles.reduce((acc, article) => {
      const cat = article.category?.name || "Unknown";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
  }

  #getUniqueTagsCount(articles) {
    const tagsSet = new Set();
    articles.forEach((article) => {
      (article.tags || []).forEach((tag) => tagsSet.add(tag));
    });
    return tagsSet.size;
  }

  #getAveragePublishDelay(articles) {
    const totalDelayMs = articles.reduce((acc, article) => {
      const created = new Date(article.created_on);
      const published = new Date(article.published_on);
      const delay = published - created;
      return acc + (delay > 0 ? delay : 0);
    }, 0);
    const avgDelayMs = totalDelayMs / articles.length;
    return avgDelayMs / (1000 * 60 * 60);
  }
}

export default VersionControlController;
