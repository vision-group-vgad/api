import { getDurationInMinutes } from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";

class BacklogMgtController {
  #article;
  constructor() {
    this.#article = new Article();
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
    const allArticles = await this.#article.getAnnualArticles(year);
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }

  async getInRangeBacklogMgtMetrics(startDate, endDate) {
    const allArticles = await this.#article.getInRangeArticles(
      startDate,
      endDate
    );
    const processedArticles = this.#processArticles(allArticles);
    return processedArticles;
  }
}

export default BacklogMgtController;
