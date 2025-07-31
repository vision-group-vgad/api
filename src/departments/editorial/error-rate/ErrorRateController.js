import {
  getRandomDate,
  getRandomNumInRange,
  getDurationInMinutes,
} from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";

class ErrorRateController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  #processArticles(articlesArray) {
    const mappedArticles = articlesArray.map((article) => {
      const editingDuration = getDurationInMinutes(
        article.created_on,
        article.published_on
      );
      const fallbackPlatform = "web";
      const fallbackStreamName = "New Vision Website";
      return {
        pageTitle: article.title,
        author: `${article.author.first_name} ${article.author.last_name}`,
        streamName: article.streamName || fallbackStreamName,
        platform: article.platform || fallbackPlatform,
        createdOn: article.created_on,
        publishedOn: article.published_on,
        editingDuration: editingDuration,
        editor: `${article.editor.first_name} ${article.editor.last_name}`,
        updates: getRandomNumInRange(0, 5),
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

  async getAnnualArticles(year) {
    const annualData = await this.#article.getAnnualArticles(year);
    const processedData = this.#processArticles(annualData);
    return processedData;
  }

  async getInRangeArticles(startDate, endDate) {
    const inRangeData = await this.#article.getInRangeArticles(
      startDate,
      endDate
    );
    const processedData = this.#processArticles(inRangeData);
    return processedData;
  }
}

export default ErrorRateController;
