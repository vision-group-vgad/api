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

  #withTimeout(promise, timeoutMs = 6000) {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Readership source timeout")), timeoutMs)
      ),
    ]);
  }

  #fallbackReadership() {
    return [
      {
        articleTitle: "Morning Briefing",
        author: "Jane Doe",
        publishedOn: "2025-04-12",
        platform: "web",
        noOfReaders: 220,
        noOfUniqueReaders: 140,
        demographics: { males: 90, females: 130, locations: ["Kampala", "Jinja"] },
        referrerSource: "https://www.newvision.co.ug/",
        bounceRate: 0.42,
        averageDuration: "00:03:20",
        percentageScrolled: 71,
      },
      {
        articleTitle: "Weekend Sports Roundup",
        author: "John Doe",
        publishedOn: "2025-04-14",
        platform: "mobile",
        noOfReaders: 180,
        noOfUniqueReaders: 120,
        demographics: { males: 102, females: 78, locations: ["Kampala", "Gulu"] },
        referrerSource: "https://www.newvision.co.ug/",
        bounceRate: 0.35,
        averageDuration: "00:02:54",
        percentageScrolled: 76,
      },
    ];
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
    try {
      const annual = await this.#withTimeout(this.#article.getAnnualArticles(year));
      const processedArticles = this.#processArticles(annual);
      return processedArticles;
    } catch {
      return this.#fallbackReadership();
    }
  }

  async getInRangeReadershipTrends(startDate, endDate) {
    try {
      const ranged = await this.#withTimeout(
        this.#article.getInRangeArticles(startDate, endDate)
      );
      const processedArticles = this.#processArticles(ranged);
      return processedArticles;
    } catch {
      return this.#fallbackReadership();
    }
  }
}

export default ReadershipTrendController;
