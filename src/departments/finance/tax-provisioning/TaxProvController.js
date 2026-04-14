import axios from "axios";

class TaxProvController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
    this.dummyTaxes = [
      {
        taxType: "Corporate Income Tax",
        provisionedAmount: 20000000,
        totalSpent: 19500000,
        transactions: [
          { date: "2021-03-15", amount: 12000000 },
          { date: "2021-06-15", amount: 7500000 },
        ],
      },
      {
        taxType: "Withholding Tax",
        provisionedAmount: 3000000,
        totalSpent: 2800000,
        transactions: [
          { date: "2021-05-10", amount: 1500000 },
          { date: "2021-06-10", amount: 1300000 },
        ],
      },
      {
        taxType: "Pay As You Earn (PAYE)",
        provisionedAmount: 10000000,
        totalSpent: 10250000,
        transactions: [
          { date: "2021-01-31", amount: 2500000 },
          { date: "2021-02-28", amount: 2500000 },
          { date: "2021-03-31", amount: 2500000 },
          { date: "2021-04-30", amount: 2750000 },
        ],
      },
      {
        taxType: "Local Service Tax",
        provisionedAmount: 1200000,
        totalSpent: 1200000,
        transactions: [
          { date: "2021-07-01", amount: 600000 },
          { date: "2021-12-01", amount: 600000 },
        ],
      },
      {
        taxType: "Excise Duty",
        provisionedAmount: 8500000,
        totalSpent: 9100000,
        transactions: [
          { date: "2021-06-18", amount: 4500000 },
          { date: "2021-07-18", amount: 4600000 },
        ],
      },
      {
        taxType: "Stamp Duty",
        provisionedAmount: 1000000,
        totalSpent: 980000,
        transactions: [
          { date: "2021-02-11", amount: 480000 },
          { date: "2021-04-25", amount: 500000 },
        ],
      },
      {
        taxType: "Environmental Levy",
        provisionedAmount: 2000000,
        totalSpent: 1850000,
        transactions: [
          { date: "2021-08-20", amount: 900000 },
          { date: "2021-09-20", amount: 950000 },
        ],
      },
      {
        taxType: "Taxes Summary",
        totalProvisionedAmount: 200000000,
        totalSpent: 185000000,
        transactions: [],
      },
    ];
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

    this.dummyTaxes.push(Array.from(taxMap.values())[0]);
    return Array.from(this.dummyTaxes);
  }
}

export default TaxProvController;
