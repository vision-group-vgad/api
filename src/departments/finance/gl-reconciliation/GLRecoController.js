import axios from "axios";

class GLRecoController {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    this.BC_URL = "https://cms-vgad.visiongroup.co.ug/api";
    this.BC_API_KEY =
      "38d79da61a89bf9e65dc1dcac80138a35c542a57832337d0e08bbfa4e4269e6f8ccb2bc1065717d50b29db806272ffec9593dd09c9bb8b13c013e98b687b2ca6f8edde07b57b246a464301e3f0ea63d0b0e6b30b09709ed7f06e1aa39dfd0c54ac632a2fa25f20500acce9d1633cbf2406652154c6f8bb7cf5d5b1c3dd9ce043";

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
