import axios from "axios";
import {
  getRandomDate,
  getRandomNumber0to5,
} from "../../../utils/common/common-functionalities.js";

class ErrorRateController {
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

  #extractYearFromDate(date) {
    return new Date(date).getFullYear();
  }

  #processArticles(articlesArray) {
    const mappedArticles = articlesArray.map((element) => {
      return {
        pageTitle: element.pageTitle,
        streamName: element.streamName,
        platform: element.platform,
        averageDuration: element.averageDuration,
        percentageScrolled: element.percentageScrolled,
        bounceRate: element.bounceRate,
        updates: getRandomNumber0to5(),
        date: getRandomDate(),
      };
    });

    const updatesSum = mappedArticles
      .map((article) => article.updates)
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

  async getAnnualArticles(startDate, endDate) {
    const extractedStartYear = this.#extractYearFromDate(startDate);
    const extractedEndYear = this.#extractYearFromDate(endDate);
    const validYear = 2025;
    if (extractedStartYear == validYear && extractedEndYear == validYear) {
      const results = await this.#fetchData();
      return this.#processArticles(results);
    } else {
      throw new ReferenceError(
        "Date out of range, available data runs from Jan - April 2025."
      );
    }
  }

  #getMonthFromDate(date) {
    return new Date(date).getMonth() + 1;
  }

  async getMonthlyArticles(month) {
    month = parseInt(month);
    if (month <= 12 && month >= 1) {
      if (month <= 4) {
        const annualArticles = await this.#fetchData();

        const monthlyArticles = this.#processArticles(
          annualArticles
        ).articles.filter((article) => {
          return this.#getMonthFromDate(article.date) === month;
        });
        const processedMonthlyArticles = this.#processArticles(monthlyArticles);
        return {
          month: month,
          processedMonthlyArticles,
        };
      }
      throw new ReferenceError(
        `No data for that month, enter January to April.`
      );
    } else {
      throw new ReferenceError("Invalid month.");
    }
  }
}

export default ErrorRateController;
