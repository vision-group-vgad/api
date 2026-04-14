import {
  getRandomNumInRange,
  formatDate,
  getPlaceNames,
} from "../../../utils/common/common-functionalities.js";
import Article from "../../../utils/common/Article.js";

class ReadershipTrendController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  #processArticles(articles) {
    const processedArticles = articles.map((article) => {
      const noOfReaders = getRandomNumInRange(0, 300);
      const noOfUniqueReaders = Math.round(noOfReaders / 2);
      const males = getRandomNumInRange(0, noOfReaders);
      const females = noOfReaders - males;
      const defaultPlatform = "web";
      const defaultRefererer = "https://www.newvision.co.ug/";
      const defaultBounceRate = getRandomNumInRange(0, 2);
      const defaultAvgDuration = getRandomNumInRange(0, 60);
      const defaultScrolled = getRandomNumInRange(0, 100);
      const locations = getPlaceNames(getRandomNumInRange(0, 5));
      return {
        articleTitle: article.title,
        author: `${article.author.first_name} ${article.author.last_name}`,
        publishedOn: formatDate(article.published_on),
        platform: article.platform || defaultPlatform,
        noOfReaders: noOfReaders,
        noOfUniqueReaders: noOfUniqueReaders,
        demographics: {
          males: males,
          females: females,
          locations: locations,
        },
        referrerSource: article.pageReferrer || defaultRefererer,
        bounceRate: article.bounceRate || defaultBounceRate,
        averageDuration:
          article.averageDuration ||
          `00:${defaultAvgDuration}:${defaultAvgDuration}`,
        percentageScrolled: article.percentageScrolled || defaultScrolled,
      };
    });
    return processedArticles;
  }

  async getAnnualReadershipTrends(year) {
    const processedArticles = this.#processArticles(
      await this.#article.getInRangeArticles(year)
    );
    return processedArticles;
  }

  async getInRangeReadershipTrends(startDate, endDate) {
    const processedArticles = this.#processArticles(
      await this.#article.getInRangeArticles(startDate, endDate)
    );
    return processedArticles;
  }
}

export default ReadershipTrendController;
