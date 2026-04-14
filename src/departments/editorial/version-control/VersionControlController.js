import { truncateToDecimals } from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";
import { vcData } from "./vc_dummy.js";

class VersionControlController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  async getInRangeArticles(startDate, endDate) {
    // const fetchedData = await this.#article.getInRangeArticles(
    //   startDate,
    //   endDate
    // );
    // return this.#processArticles(fetchedData);
    return vcData;
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
