import {
  getRandomDate,
  getRandomNumInRange,
  getDurationInMinutes,
} from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";
import dummyArticles from "./dummy-data.js";

class ErrorRateController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  #processArticles(articlesArray, startDate, endDate) {
    const mappedArticles = articlesArray
      .filter((article) => article.date >= startDate && article.date <= endDate)
      .map((article) => {
        const editingDuration = getDurationInMinutes(
          article.createdOn,
          article.publishedOn
        );
        const fallbackPlatform = "web";
        const fallbackStreamName = "New Vision Website";
        return {
          pageTitle: article.pageTitle,
          author: article.author,
          streamName: article.streamName || fallbackStreamName,
          platform: article.platform || fallbackPlatform,
          createdOn: article.createdOn,
          publishedOn: article.publishedOn,
          editingDuration: editingDuration,
          editor: article.editor,
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
    const processedData = this.#processArticles(
      dummyArticles,
      startDate,
      endDate
    );
    return processedData;
  }
}

export default ErrorRateController;
