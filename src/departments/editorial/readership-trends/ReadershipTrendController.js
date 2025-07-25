import axios from "axios";
import {
  getRandomNumInRange,
  formatDate,
  getPlaceNames,
} from "../../../utils/common/common-functionalities.js";

class ReadershipTrendController {
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

  #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const noOfReaders = getRandomNumInRange(0, 300);
      const noOfUniqueReaders = Math.round(noOfReaders / 2);
      const males = getRandomNumInRange(0, noOfReaders);
      const females = noOfReaders - males;
      const defaultPlatform = "web";
      const defaultRefererer = "https://www.newvision.co.ug/";
      const defaultBounceRate = getRandomNumInRange(0, 2);
      const defaultAvgDuration = getRandomNumInRange(0, 60);
      const defaultScrolled = getRandomNumInRange(0, 100);
      const locations = getPlaceNames(getRandomNumInRange(0, 5));
      return {
        articleTitle: article.title,
        author: `${article.author.first_name} ${article.author.last_name}`,
        publishedOn: formatDate(article.published_on),
        platform: article.platform || defaultPlatform,
        noOfReaders: noOfReaders,
        noOfUniqueReaders: noOfUniqueReaders,
        demographics: {
          males: males,
          females: females,
          locations: locations,
        },
        referrerSource: article.pageReferrer || defaultRefererer,
        bounceRate: article.bounceRate || defaultBounceRate,
        averageDuration:
          article.averageDuration ||
          `00:${defaultAvgDuration}:${defaultAvgDuration}`,
        percentageScrolled: article.percentageScrolled || defaultScrolled,
      };
    });
    return processedArticles;
  }

  async getAnnualReadershipTrends(year) {
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

  async #fetchRemainingArticles(allArticles, remainingArticles, url) {
    for (let i = 10; i <= remainingArticles; i += 10) {
      const endPoint = `${url}/${i}`;
      const results = await this.#fetchData(endPoint);
      allArticles = [...allArticles, ...results.articles];
    }
    return allArticles;
  }

  async getInRangeReadershipTrends(startDate, endDate) {
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

export default ReadershipTrendController;
