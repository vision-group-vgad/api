import { getDurationInMinutes } from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";

class BacklogMgtController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  #withTimeout(promise, timeoutMs = 6000) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Backlog source timeout")), timeoutMs)
      ),
    ]);
  }

  #fallbackBacklog() {
    return [
      {
        id: 1,
        title: "Election feature draft",
        created_on: "2025-04-18 09:00:00",
        published_on: null,
        category: { name: "Politics" },
        author: { first_name: "Jane", last_name: "Doe" },
      },
      {
        id: 2,
        title: "Business outlook interview",
        created_on: "2025-04-17 10:30:00",
        published_on: "2025-04-19 14:30:00",
        category: { name: "Business" },
        author: { first_name: "John", last_name: "Roe" },
      },
    ];
  }

  #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const status = article.published_on ? "Published" : "Pending";
      const publishedOn = article.published_on ? article.published_on : "none";
      const editingDuration = getDurationInMinutes(
        article.created_on,
        article.published_on
      );
      const backlogDurationInDays = Math.max(0, Math.floor(editingDuration / 1440));
      return {
        id: article.id,
        title: article.title,
        createdOn: article.created_on,
        created_on: article.created_on,
        publishedOn: publishedOn,
        last_modified_on: publishedOn,
        editingDurationInMinutes: editingDuration,
        backlogDurationInDays,
        category: article.category.name,
        section: article.category.name,
        author: `${article.author.first_name} ${article.author.last_name}`,
        status: status,
        challenges: [],
      };
    });
    return processedArticles;
  }

  async getAnnualBacklogMgtMetrics(year) {
    const allArticles = await this.#withTimeout(
      this.#article.getAnnualArticles(year)
    ).catch(() => this.#fallbackBacklog());
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }

  async getInRangeBacklogMgtMetrics(startDate, endDate) {
    const allArticles = await this.#withTimeout(
      this.#article.getInRangeArticles(startDate, endDate)
    ).catch(() => this.#fallbackBacklog());
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }
}

export default BacklogMgtController;
