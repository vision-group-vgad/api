import axios from "axios";

class StatementsVarianceController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
    this.dummyVariances = [
      {
        month: "2021-01",
        assetValue: 1000000,
        grossProfit: 200000,
        netProfit: 150000,
        revenue: 450000,
        expenses: 300000,
        liabilities: 200000,
        equity: 300000,
        netIncome: 150000,
      },
      {
        month: "2021-02",
        assetValue: 1010000,
        grossProfit: 210000,
        netProfit: 155000,
        revenue: 460000,
        expenses: 305000,
        liabilities: 205000,
        equity: 310000,
        netIncome: 155000,
      },
      {
        month: "2021-03",
        assetValue: 1020000,
        grossProfit: 220000,
        netProfit: 160000,
        revenue: 470000,
        expenses: 310000,
        liabilities: 210000,
        equity: 320000,
        netIncome: 160000,
      },
      {
        month: "2021-04",
        assetValue: 1030000,
        grossProfit: 230000,
        netProfit: 165000,
        revenue: 480000,
        expenses: 315000,
        liabilities: 215000,
        equity: 330000,
        netIncome: 165000,
      },
      {
        month: "2021-05",
        assetValue: 1040000,
        grossProfit: 240000,
        netProfit: 170000,
        revenue: 490000,
        expenses: 320000,
        liabilities: 220000,
        equity: 340000,
        netIncome: 170000,
      },
      {
        month: "2021-06",
        assetValue: 1050000,
        grossProfit: 250000,
        netProfit: 175000,
        revenue: 500000,
        expenses: 325000,
        liabilities: 225000,
        equity: 350000,
        netIncome: 175000,
      },
      {
        month: "2021-07",
        assetValue: 1060000,
        grossProfit: 260000,
        netProfit: 180000,
        revenue: 510000,
        expenses: 330000,
        liabilities: 230000,
        equity: 360000,
        netIncome: 180000,
      },
      {
        month: "2021-08",
        assetValue: 1070000,
        grossProfit: 270000,
        netProfit: 185000,
        revenue: 520000,
        expenses: 335000,
        liabilities: 235000,
        equity: 370000,
        netIncome: 185000,
      },
      {
        month: "2021-09",
        assetValue: 1080000,
        grossProfit: 280000,
        netProfit: 190000,
        revenue: 530000,
        expenses: 340000,
        liabilities: 240000,
        equity: 380000,
        netIncome: 190000,
      },
      {
        month: "2021-10",
        assetValue: 1090000,
        grossProfit: 290000,
        netProfit: 195000,
        revenue: 540000,
        expenses: 345000,
        liabilities: 245000,
        equity: 390000,
        netIncome: 195000,
      },
      {
        month: "2021-11",
        assetValue: 1100000,
        grossProfit: 300000,
        netProfit: 200000,
        revenue: 550000,
        expenses: 350000,
        liabilities: 250000,
        equity: 400000,
        netIncome: 200000,
      },
      {
        month: "2021-12",
        assetValue: 1110000,
        grossProfit: 310000,
        netProfit: 205000,
        revenue: 560000,
        expenses: 355000,
        liabilities: 255000,
        equity: 410000,
        netIncome: 205000,
      },
      {
        month: "2022-01",
        assetValue: 1120000,
        grossProfit: 320000,
        netProfit: 210000,
        revenue: 570000,
        expenses: 360000,
        liabilities: 260000,
        equity: 420000,
        netIncome: 210000,
      },
      {
        month: "2022-02",
        assetValue: 1130000,
        grossProfit: 330000,
        netProfit: 215000,
        revenue: 580000,
        expenses: 365000,
        liabilities: 265000,
        equity: 430000,
        netIncome: 215000,
      },
      {
        month: "2022-03",
        assetValue: 1140000,
        grossProfit: 340000,
        netProfit: 220000,
        revenue: 590000,
        expenses: 370000,
        liabilities: 270000,
        equity: 440000,
        netIncome: 220000,
      },
      {
        month: "2022-04",
        assetValue: 1150000,
        grossProfit: 350000,
        netProfit: 225000,
        revenue: 600000,
        expenses: 375000,
        liabilities: 275000,
        equity: 450000,
        netIncome: 225000,
      },
      {
        month: "2022-05",
        assetValue: 1160000,
        grossProfit: 360000,
        netProfit: 230000,
        revenue: 610000,
        expenses: 380000,
        liabilities: 280000,
        equity: 460000,
        netIncome: 230000,
      },
      {
        month: "2022-06",
        assetValue: 1170000,
        grossProfit: 370000,
        netProfit: 235000,
        revenue: 620000,
        expenses: 385000,
        liabilities: 285000,
        equity: 470000,
        netIncome: 235000,
      },
      {
        month: "2022-07",
        assetValue: 1180000,
        grossProfit: 380000,
        netProfit: 240000,
        revenue: 630000,
        expenses: 390000,
        liabilities: 290000,
        equity: 480000,
        netIncome: 240000,
      },
      {
        month: "2022-08",
        assetValue: 1190000,
        grossProfit: 390000,
        netProfit: 245000,
        revenue: 640000,
        expenses: 395000,
        liabilities: 295000,
        equity: 490000,
        netIncome: 245000,
      },
      {
        month: "2022-09",
        assetValue: 1200000,
        grossProfit: 400000,
        netProfit: 250000,
        revenue: 650000,
        expenses: 400000,
        liabilities: 300000,
        equity: 500000,
        netIncome: 250000,
      },
      {
        month: "2022-10",
        assetValue: 1210000,
        grossProfit: 410000,
        netProfit: 255000,
        revenue: 660000,
        expenses: 405000,
        liabilities: 305000,
        equity: 510000,
        netIncome: 255000,
      },
      {
        month: "2022-11",
        assetValue: 1220000,
        grossProfit: 420000,
        netProfit: 260000,
        revenue: 670000,
        expenses: 410000,
        liabilities: 310000,
        equity: 520000,
        netIncome: 260000,
      },
      {
        month: "2022-12",
        assetValue: 1230000,
        grossProfit: 430000,
        netProfit: 265000,
        revenue: 680000,
        expenses: 415000,
        liabilities: 315000,
        equity: 530000,
        netIncome: 265000,
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
          "Finance Statements Variance endpoint error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );
  }

  async fetchData(startDate, endDate, limit = 100) {
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
      return this.dummyVariances;
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      return {
        error: "Failed to fetch data for financial statements variance",
      };
    }
  }
}

export default StatementsVarianceController;
