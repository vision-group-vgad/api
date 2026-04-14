import { response } from "./brk-dummy.js";

class BreakingNewsController {
  constructor() {
  }

  async getInRangeBreakingNews(_startDate, _endDate) {
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
