import Article from "../../../utils/common/Article.js";
import { getDateFromTimestamp } from "../../../utils/common/common-functionalities.js";
import { response } from "./brk-dummy.js";

class BreakingNewsController {
  #article;

  constructor() {
    this.#article = new Article();
  }

  #processArticles(detailedArticles, summarizedArticles) {
    const processedArticles = detailedArticles.map((detailedArticle) => {
      const matchingArticle = summarizedArticles.find((sumArticle) =>
        sumArticle.pagePath.includes(detailedArticle.externalId)
      );
      return {
        title: detailedArticle.title,
        percentageScrolled: matchingArticle?.percentScrolled || "",
        avgDuration: matchingArticle?.averageDuration || "",
        bounceRate: matchingArticle?.bounceRate || "",
        publishedDate: getDateFromTimestamp(detailedArticle.published_on),
        pageLocation: matchingArticle?.pageLocation || "",
        category: detailedArticle.category.name,
        author: `${detailedArticle.author.first_name} ${detailedArticle.author.last_name}`,
        streamName: matchingArticle?.streamName || "",
        breakingNews: detailedArticle.breaking_news,
      };
    });
    const trendingStories = processedArticles
      .filter((article) => article.breakingNews === true)
      .slice(0, 5);
    const monthlyCategoryPerformances =
      this.#getMonthlyCategoryCounts(processedArticles);
    return { trendingStories, monthlyCategoryPerformances };
  }

  #getMonthlyCategoryCounts(articles) {
    const result = {};

    articles.forEach((article) => {
      const [year, month] = article.publishedDate.split("-");
      const monthName = new Date(`${year}-${month}-01`).toLocaleString(
        "default",
        {
          month: "short",
        }
      );
      const key = `${monthName} ${year}`;

      if (!result[key]) {
        result[key] = {};
      }

      const category = article.category;

      if (!result[key][category]) {
        result[key][category] = 0;
      }

      result[key][category]++;
    });

    const formatted = Object.entries(result).map(([month, categories]) => ({
      month,
      ...categories,
    }));

    return formatted;
  }

  async getInRangeBreakingNews(startDate, endDate) {
    // const summarizedArticles =
    //   await this.#article.getSummarizedInRangeArticles();
    // const detailedArticles = await this.#article.getInRangeArticles(
    //   startDate,
    //   endDate
    // );
    // const breakingNews = this.#processArticles(
    //   detailedArticles,
    //   summarizedArticles
    // );
    // return breakingNews;
    return response;
  }
}

export default BreakingNewsController;
