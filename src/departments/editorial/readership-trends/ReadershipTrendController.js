import axios from "axios";
import {
  getRandomDate,
  getRandomNumInRange,
  getMonthFromDate,
  getDayFromDate,
  extractYearFromDate,
  getUniqueName,
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

  async #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const noOfReaders = getRandomNumInRange(0, 300);
      const noOfUniqueReaders = Math.round(noOfReaders / 2);
      const males = getRandomNumInRange(0, noOfReaders);
      const females = noOfReaders - males;
      const locations = getPlaceNames(getRandomNumInRange(0, 5));
      return {
        articleTitle: article.pageTitle,
        noOfReaders: noOfReaders,
        noOfUniqueReaders: noOfUniqueReaders,
        demographics: {
          males: males,
          females: females,
          locations: locations,
        },
        referrerSource: article.pageReferrer,
        bounceRate: article.bounceRate,
        averageDuration: article.averageDuration,
        percentageScrolled: article.percentageScrolled,
      };
    });
  }
}

export default ReadershipTrendController;
