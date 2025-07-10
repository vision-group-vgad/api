import axios from "axios";

class TaxProvController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
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
          " Tax provision endpoint error:",
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

      this.transformed = transformed;
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      return { error: "Failed to fetch data for tax provisioning" };
    }
  }

  async extractTaxProvisionings(startDate, endDate) {
    await this.#fetchData(startDate, endDate);
    if (!Array.isArray(this.transformed)) return this.transformed;

    const taxMap = new Map();

    this.transformed.forEach((entry) => {
      const taxGroupCode =
        entry.VAT_Bus_Posting_Group || entry.VAT_Prod_Posting_Group;
      const vatAmount = parseFloat(entry.VAT_Amount || "0");

      if (!taxGroupCode || vatAmount === 0) return;

      const absAmount = Math.abs(vatAmount);
      const transaction = {
        date: entry.Posting_Date,
        amount: absAmount,
      };

      if (!taxMap.has(taxGroupCode)) {
        taxMap.set(taxGroupCode, {
          taxType: taxGroupCode,
          provisionedAmount: 500000,
          totalSpent: 0,
          transactions: [],
        });
      }

      const taxEntry = taxMap.get(taxGroupCode);
      taxEntry.totalSpent += absAmount;
      taxEntry.transactions.push(transaction);
    });

    return Array.from(taxMap.values());
  }
}

export default TaxProvController;
