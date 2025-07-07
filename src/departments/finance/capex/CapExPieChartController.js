import axios from "axios";

class CapExPieChartController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.CMS_API_KEY = process.env.CMS_API_KEY;
    this.response = "";
    this.reports = [];
    this.totalCapEx = 0;
  }

  async _fetchData(duration) {
    // Simulated API call
    // const response = await axios.get(
    //   this.VISION_GROUP_CMS_ROOT_URL + "/capex",
    //   {
    //     params: {
    //       duration: duration,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${this.CMS_API_KEY}`,
    //     },
    //   }
    // );
    // this.reports = response.data;

    this.reports = [
      { category: "IT Infrastructure", amount: 8000 },
      { category: "Facilities", amount: 12000 },
      { category: "Manufacturing", amount: 25000 },
      { category: "Power", amount: 6000 },
      { category: "Fleet", amount: 7000 },
    ];
  }

  #getTotalCapEx() {
    this.totalCapEx = this.reports
      .map((r) => r.amount)
      .reduce((acc, curr) => acc + curr, 0);
  }

  #calculateDegree(amount, total) {
    const degrees = 360;
    return Math.round((amount / total) * degrees);
  }

  async getCapExByCategory(duration) {
    await this._fetchData(duration);
    this.#getTotalCapEx();

    const reports = this.reports.map((report) => {
      return {
        ...report,
        degree: this.#calculateDegree(report.amount, this.totalCapEx),
      };
    });

    return reports;
  }
}

export default CapExPieChartController;
