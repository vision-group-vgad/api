import axios from "axios";
import dummyData from "./dummyData.js";

class GLRecoController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
  }

  initialize() {
    if (this.initialized) return;

    this.apiClient = axios.create({
      baseURL: this.BC_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.BC_API_KEY}`;
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "GLReco API Error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData(startDate, endDate, limit = 100) {
    this.initialize();
    const url = `/bc-datasets/${startDate}/${endDate}`;

    try {
      const response = await this.apiClient.get(url);
      const allData = response.data?.data || [];
      const slicedData = allData.slice(0, limit);

      const transformed = slicedData.map((entry) => ({
        id: entry.id,
        ...entry.attributes,
      }));

      return transformed;
    } catch (error) {
      return {
        statusCode: 500,
        error: "Failed to fetch GL reconciliation data",
        details: error.response?.data || error.message,
      };
    }
  }

  async getDataUptoDate(startYear) {
    if (startYear < 2021 || startYear > 2025)
      return "No data from that year, the least is 2021 and latest 2025.";

    if (startYear == "2021") {
      const results = await this.getTransformedLedgers(
        "2021-08-01",
        "2021-08-31"
      );
      const entries = [results, ...dummyData];
      return entries;
    }

    if (startYear > "2021") {
      const results = dummyData.filter(
        (element) =>
          new Date(element.summary.periodStart).getFullYear() >= startYear
      );
      return results;
    }
  }

  async getTransformedLedgers(startDate, endDate) {
    if (
      new Date(startDate).getFullYear() < 2021 ||
      new Date(endDate).getFullYear() > 2025
    )
      return "No data from that year, the least is 2021 and latest 2025.";

    if (new Date(startDate).getFullYear() == "2021") {
      const data = await this.#fetchData(startDate, endDate, 100);

      if (!Array.isArray(data)) return data;

      const entries = [];
      let totalDebit = 0;
      let totalCredit = 0;

      data.forEach((entry) => {
        const debit = parseFloat(entry.Debit_Amount || "0");
        const credit = parseFloat(entry.Credit_Amount || "0");

        const isDebit = debit > 0;
        const amount = isDebit ? debit : credit;
        const type = isDebit ? "Debit" : "Credit";

        entries.push({
          date: entry.Posting_Date,
          accountName: entry.G_L_Account_Name,
          entryType: type,
          amount: amount,
        });

        totalDebit += debit;
        totalCredit += credit;
      });

      const generalLedgerDebitBalance = totalDebit + 5000;
      const generalLedgerCreditBalance = totalCredit + 2000;

      const summary = {
        periodStart: startDate,
        periodEnd: endDate,
        totalDebitAmount: totalDebit,
        totalCreditAmount: totalCredit,
        generalLedgerDebitBalance,
        generalLedgerCreditBalance,
      };

      const results2021 = { summary, entries };

      const results = dummyData.filter(
        (element) =>
          new Date(element.summary.periodStart).getFullYear() >=
            new Date(startDate).getFullYear() &&
          new Date(element.summary.periodStart).getFullYear() <=
            new Date(endDate).getFullYear()
      );

      return [results2021, ...results];
    }

    if (new Date(startDate).getFullYear() > "2021") {
      const results = dummyData.filter(
        (element) =>
          new Date(element.summary.periodStart).getFullYear() >=
            new Date(startDate).getFullYear() &&
          new Date(element.summary.periodStart).getFullYear() <=
            new Date(endDate).getFullYear()
      );
      return results;
    }
  }
}

export default GLRecoController;
