import axios from "axios";
import {
  getRandomNumInRange,
  getPlaceNames,
} from "../../../utils/common/common-functionalities.js";

class SectionPerformanceController {
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

  async #processArticles() {
    const rawArticles = await this.#aggregateData();

    const categories = this.#getCategories(rawArticles);

    const processedCategories = categories.map((category) => {
      const articleTitles = this.#getArticleTitlesByCategory(
        category,
        rawArticles
      );

      const detailedArticles = articleTitles.map((title) => {
        const authors = this.#getAuthorsByArticle(title, rawArticles);
        const editor = this.#getEditorByArticle(title, rawArticles);
        const timeStamp = this.#getDatePublishedByArticle(title, rawArticles);
        const locations = getPlaceNames(getRandomNumInRange(0, 10));
        return {
          articleTitle: title,
          publishedOn: timeStamp,
          authors: authors,
          editor: editor,
          locations: locations,
        };
      });

      const noOfReaders = getRandomNumInRange(100, 150);
      const noOfMales = Math.round(noOfReaders / getRandomNumInRange(1, 3));
      const noOfFemales = noOfReaders - noOfMales;
      const totalBounceRate = getRandomNumInRange(1, 10);
      const avgBr = Math.floor(totalBounceRate / detailedArticles.length);

      return {
        category: category,
        articles: [...detailedArticles],
        noOfArticles: detailedArticles.length,
        noOfReaders: noOfReaders,
        totalBounceRate: totalBounceRate,
        avgBounceRate: avgBr,
        demograhpics: {
          males: noOfMales,
          females: noOfFemales,
        },
      };
    });

    return processedCategories;
  }

  #getCategories(articles) {
    const categories = new Set();
    articles.forEach((article) => categories.add(article.category.name));
    return Array.from(categories);
  }

  #getArticleTitlesByCategory(category, articles) {
    const articleTitles = [];
    articles.forEach((article) => {
      if (article.category.name === category) articleTitles.push(article.title);
    });
    return articleTitles;
  }

  #getAuthorsByArticle(title, articles) {
    const authorsSet = new Set();
    articles.forEach((article) => {
      if (article.title === title) {
        article.authors.forEach((author) =>
          authorsSet.add(`${author.first_name} ${author.last_name}`)
        );
      }
    });
    return Array.from(authorsSet);
  }

  #getEditorByArticle(title, articles) {
    const editorsSet = new Set();
    articles.forEach((article) => {
      if (article.title === title) {
        editorsSet.add(
          `${article.editor.first_name} ${article.editor.last_name}`
        );
      }
    });
    return Array.from(editorsSet);
  }

  #getDatePublishedByArticle(title, articles) {
    const article = articles.find((article) => article.title === title);
    return article.published_on;
  }

  async getSectionPerformanceData() {
    const results = await this.#processArticles();
    return results;
  }
}

export default SectionPerformanceController;
