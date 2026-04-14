import {
  getRandomNumInRange,
  getMonthFromDate,
  getDayFromDate,
  extractYearFromDate,
  getDurationInMinutes,
  getDateFromTimestamp,
} from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";
import { articles } from "./editing-cycle-dummy.js";

class EditCycTimesController {
  #article;

  constructor() {
    this.#article = new Article();
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
    const mappedArticles = articles.map((article) => {
      const updatesCount = getRandomNumInRange(0, 5);
      const updateLogs = this.#getUpdateLogs(
        getDateFromTimestamp(article.created_on),
        updatesCount
      );
      const fallbackPlatform = "web";
      const fallbackStreamName = "New Vision Website";
      const fallbackDuration = "00:10:21";
      const fallbackPercentage = 10;
      const fallbackRate = 1;
      const editingDuration = getDurationInMinutes(
        article.created_on,
        article.published_on
      );
      return {
        pageTitle: article.title,
        author: `${article.author.first_name} ${article.author.last_name}`,
        streamName: article.streamName || fallbackStreamName,
        platform: article.platform || fallbackPlatform,
        averageDuration: article.averageDuration || fallbackDuration,
        percentageScrolled: article.percentageScrolled || fallbackPercentage,
        bounceRate: article.bounceRate || fallbackRate,
        createdOn: article.created_on,
        publishedOn: article.published_on,
        editingDuration: editingDuration,
        editor: `${article.editor.first_name} ${article.editor.last_name}`,
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

  async getAnnualData(year) {
    const articles = await this.#article.getAnnualArticles(year);
    return this.#processData(articles);
  }

  async getInRangeData(_startDate, _endDate) {
    // const inRangeData = await this.#article.getInRangeArticles(
    //   startDate,
    //   endDate
    // );
    // const articles = this.#processData(inRangeData);
    // return {
    //   articleCount: articles.length,
    //   articles: articles,
    // };
    return articles;
  }
}

export default EditCycTimesController;
