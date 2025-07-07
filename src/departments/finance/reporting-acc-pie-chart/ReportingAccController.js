import axios from "axios";

class ReportingAccController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.CMS_API_KEY = process.env.CMS_API_KEY;
    this.response = "";
    this.reports = [];
    this.totalReports = "";
    this.totalModifiedReports = "";
  }

  async _fetchData(duration) {
    // const response = await axios.get(
    //   this.VISION_GROUP_CMS_ROOT_URL + "/reports",
    //   {
    //     params: {
    //       duration: duration,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${this.CMS_API_KEY}`,
    //     },
    //   }
    // );
    // this.response = response.data;
    this.reports = [
      {
        report_category: "Income Statements",
        no_of_reports: 15,
        no_of_modified_reports: 6,
      },
      {
        report_category: "Balance Sheets",
        no_of_reports: 18,
        no_of_modified_reports: 8,
      },
      {
        report_category: "Cash Flow Statements",
        no_of_reports: 20,
        no_of_modified_reports: 9,
      },
      {
        report_category: "Equity Reports",
        no_of_reports: 10,
        no_of_modified_reports: 4,
      },
      {
        report_category: "Asset Reports",
        no_of_reports: 12,
        no_of_modified_reports: 5,
      },
      {
        report_category: "Liability Reports",
        no_of_reports: 14,
        no_of_modified_reports: 7,
      },
      {
        report_category: "Revenue Reports",
        no_of_reports: 22,
        no_of_modified_reports: 10,
      },
      {
        report_category: "Expense Reports",
        no_of_reports: 16,
        no_of_modified_reports: 6,
      },
      {
        report_category: "Trial Balance",
        no_of_reports: 13,
        no_of_modified_reports: 5,
      },
      {
        report_category: "General Ledger",
        no_of_reports: 17,
        no_of_modified_reports: 8,
      },
      {
        report_category: "Accounts Receivable",
        no_of_reports: 11,
        no_of_modified_reports: 4,
      },
      {
        report_category: "Accounts Payable",
        no_of_reports: 19,
        no_of_modified_reports: 9,
      },
      {
        report_category: "Inventory Reports",
        no_of_reports: 10,
        no_of_modified_reports: 3,
      },
      {
        report_category: "Payroll Reports",
        no_of_reports: 15,
        no_of_modified_reports: 6,
      },
      {
        report_category: "Budget Reports",
        no_of_reports: 14,
        no_of_modified_reports: 5,
      },
      {
        report_category: "Variance Reports",
        no_of_reports: 16,
        no_of_modified_reports: 7,
      },
      {
        report_category: "Tax Reports",
        no_of_reports: 12,
        no_of_modified_reports: 4,
      },
      {
        report_category: "Capital Expenditure Reports",
        no_of_reports: 9,
        no_of_modified_reports: 2,
      },
      {
        report_category: "Depreciation Reports",
        no_of_reports: 13,
        no_of_modified_reports: 6,
      },
      {
        report_category: "Compliance Reports",
        no_of_reports: 11,
        no_of_modified_reports: 3,
      },
    ];
  }

  #getTotalReports() {
    const totalReports = this.reports
      .map((report) => report.no_of_reports)
      .reduce((acc, curr) => acc + curr, 0);
    this.totalReports = totalReports;
  }

  #getTotalModifiedReports() {
    const totalModifiedReports = this.reports
      .map((report) => report.no_of_modified_reports)
      .reduce((acc, curr) => acc + curr, 0);
    this.totalModifiedReports = totalModifiedReports;
  }

  #calculateModificationDegreePerCat(catModifiedReports, totalModifiedReports) {
    const degrees = 360;
    return Math.round((catModifiedReports / totalModifiedReports) * degrees);
  }

  async getReports(duration) {
    await this._fetchData(duration);
    this.#getTotalReports();
    this.#getTotalModifiedReports();

    const reports = this.reports.map((report) => {
      return {
        ...report,
        degree_of_modification: this.#calculateModificationDegreePerCat(
          report.no_of_modified_reports,
          this.totalModifiedReports
        ),
      };
    });

    return reports;
  }
}

export default ReportingAccController;
