import Article from "../../../utils/common/Article.js";
import { readFile } from "fs/promises";
import {
  getMonthFromDate,
  extractYearFromDate,
} from "../../../utils/common/common-functionalities.js";

const rawData = await readFile(
  new URL("./competitors_dummy_data.json", import.meta.url)
);

const testData = JSON.parse(rawData);

class CompetitorBenchController {
  #article;
  constructor() {
    this.#article = new Article();
  }

  #filterMonthlyTrends(trends, startMonth, endMonth, year) {
    const monthMap = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    return trends.filter((entry) => {
      const monthNum = monthMap[entry.month];
      return (
        entry.year === year && monthNum >= startMonth && monthNum <= endMonth
      );
    });
  }

  #processArticles(articles) {
    return articles;
  }

  async getInRangeCompMetrics(startDate, endDate) {
    const data = this.#processArticles(JSON.parse(JSON.stringify(testData)));

    data.forEach((competitor) => {
      competitor.monthlyTrafficTrend = this.#filterMonthlyTrends(
        competitor.monthlyTrafficTrend,
        getMonthFromDate(startDate),
        getMonthFromDate(endDate),
        extractYearFromDate(startDate)
      );
    });
    return data;
  }
}

export default CompetitorBenchController;
