import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

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
      console.error("Fetch error:", error.response?.data || error.message);
      return { error: "Failed to fetch GL reconciliation data" };
    }
  }

  async getTransformedLedgers(startDate, endDate, limit = 100) {
    const data = await this.#fetchData(startDate, endDate, limit);

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
      entryCount: entries.length,
    };

    return {
      summary,
      entries,
    };
  }
}

export default GLRecoController;
