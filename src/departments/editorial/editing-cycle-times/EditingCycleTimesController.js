import axios from "axios";
import {
  getRandomDate,
  getRandomNumInRange,
  getMonthFromDate,
  getDayFromDate,
  extractYearFromDate,
  getUniqueName,
} from "../../../utils/common/common-functionalities.js";

class EditCycTimesController {
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
        console.error(
          "Share point endpoint error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData() {
    this.initialize();
    // const url = `/api-listings/article-session-duration/${startDate}/${endDate}`;
    const url = `/api-listings/article-session-duration/2025-01-01/2025-04-30`;

    try {
      const response = await this.apiClient.get(url);
      const allData = response.data?.data || [];
      const splicedData = allData.splice(0, 300);

      return splicedData;
    } catch (error) {
      throw new error();
    }
  }

  #getUpdateLogs(startDate, updatesCount) {
    const logs = [];
    const month = getMonthFromDate(startDate);
    const day = getDayFromDate(startDate);
    const year = extractYearFromDate(startDate);
    const endDay = 30;
    const endMonth = 4;

    for (let i = 1; i <= updatesCount; i++) {
      logs.push(
        `${year}-${getRandomNumInRange(month, endMonth)}-${getRandomNumInRange(
          day,
          endDay
        )}`
      );
    }

    return logs;
  }

  #processData(articles) {
    const mappedArticles = articles.map((element) => {
      const updatesCount = getRandomNumInRange(0, 5);
      const authoredOn = getRandomDate();
      const updateLogs = this.#getUpdateLogs(authoredOn, updatesCount);
      return {
        pageTitle: element.pageTitle,
        author: getUniqueName(),
        streamName: element.streamName,
        platform: element.platform,
        averageDuration: element.averageDuration,
        percentageScrolled: element.percentageScrolled,
        bounceRate: element.bounceRate,
        authoredOn: authoredOn,
        updatesCount: updatesCount,
        updateLogs: updateLogs,
      };
    });

    const updatesSum = mappedArticles
      .map((article) => article.updatesCount)
      .reduce((prevCount, nxtCount) => prevCount + nxtCount, 0);

    const totalArticles = mappedArticles.length;

    const averageUpdates = Math.round(updatesSum / totalArticles);

    const processedData = {
      averageUpdates: averageUpdates,
      articleCount: totalArticles,
      articles: mappedArticles,
    };
    return processedData;
  }

  async getAnnualData() {
    const articles = await this.#fetchData();
    return this.#processData(articles);
  }

  async getMonthlyData(year, month) {
    const annualData = await this.getAnnualData();
    const articles = annualData.articles.filter(
      (article) =>
        getMonthFromDate(article.authoredOn) === month &&
        extractYearFromDate(article.authoredOn) === year
    );
    return {
      articleCount: articles.length,
      articles: articles,
    };
  }
}

export default EditCycTimesController;
