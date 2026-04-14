import { vcData } from "./vc_dummy.js";

class VersionControlController {
  constructor() {
  }

  async getInRangeArticles(_startDate, _endDate) {
    // const fetchedData = await this.#article.getInRangeArticles(
    //   startDate,
    //   endDate
    // );
    // return this.#processArticles(fetchedData);
    return vcData;
  }
}

export default VersionControlController;
