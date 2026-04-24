import axios from "axios";

class BadDebtRatiosController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
    this.dummyBadDebtsRatios = {
      annual: {
        creditSales: 150000,
        badDebts: 12300,
        badDebtRatioPercentage: 8.2,
      },
      quarterly: [
        {
          quarter: "Q1",
          creditSales: 33000,
          badDebts: 2550,
          badDebtRatioPercentage: 7.73,
        },
        {
          quarter: "Q2",
          creditSales: 36000,
          badDebts: 2900,
          badDebtRatioPercentage: 8.06,
        },
        {
          quarter: "Q3",
          creditSales: 39000,
          badDebts: 3300,
          badDebtRatioPercentage: 8.46,
        },
        {
          quarter: "Q4",
          creditSales: 42000,
          badDebts: 3550,
          badDebtRatioPercentage: 8.45,
        },
      ],
      monthly: [
        {
          month: "2021-01",
          creditSales: 10000,
          badDebts: 800,
          badDebtRatioPercentage: 8,
        },
        {
          month: "2021-02",
          creditSales: 11000,
          badDebts: 900,
          badDebtRatioPercentage: 8.18,
        },
        {
          month: "2021-03",
          creditSales: 12000,
          badDebts: 850,
          badDebtRatioPercentage: 7.08,
        },
        {
          month: "2021-04",
          creditSales: 13000,
          badDebts: 1000,
          badDebtRatioPercentage: 7.69,
        },
        {
          month: "2021-05",
          creditSales: 12000,
          badDebts: 950,
          badDebtRatioPercentage: 7.92,
        },
        {
          month: "2021-06",
          creditSales: 11000,
          badDebts: 950,
          badDebtRatioPercentage: 8.64,
        },
        {
          month: "2021-07",
          creditSales: 13000,
          badDebts: 1100,
          badDebtRatioPercentage: 8.46,
        },
        {
          month: "2021-08",
          creditSales: 13000,
          badDebts: 1150,
          badDebtRatioPercentage: 8.85,
        },
        {
          month: "2021-09",
          creditSales: 13000,
          badDebts: 1050,
          badDebtRatioPercentage: 8.08,
        },
        {
          month: "2021-10",
          creditSales: 14000,
          badDebts: 1200,
          badDebtRatioPercentage: 8.57,
        },
        {
          month: "2021-11",
          creditSales: 14000,
          badDebts: 1150,
          badDebtRatioPercentage: 8.21,
        },
        {
          month: "2021-12",
          creditSales: 14000,
          badDebts: 1200,
          badDebtRatioPercentage: 8.57,
        },
      ],
    };
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
          "Bad debt ratios endpoint error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData(startDate, endDate, _limit = 100) {
    this.initialize();
    const url = `/bc-datasets/${startDate}/${endDate}`;

    if (!this.BC_URL || !this.BC_API_KEY) {
      return this.dummyBadDebtsRatios;
    }

    try {
      await this.apiClient.get(url);

      this.transformed = this.dummyBadDebtsRatios;
      return this.transformed;
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      return this.dummyBadDebtsRatios;
    }
  }

  async getAnnualData() {
    return this.dummyBadDebtsRatios;
  }

  async getRatiosByMonth(year, month) {
    const data = this.dummyBadDebtsRatios;

    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;

    const monthEntry = data.monthly.find(
      (entry) => entry.month === formattedMonth
    );

    if (!monthEntry) {
      return {
        error: `No data found for month: ${formattedMonth}`,
      };
    }

    return {
      month: monthEntry.month,
      creditSales: monthEntry.creditSales,
      badDebts: monthEntry.badDebts,
      badDebtRatioPercentage: monthEntry.badDebtRatioPercentage,
    };
  }

  async getRatiosByDateRange(startDate, endDate, limit = 100) {
    const data = await this.#fetchData(startDate, endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredMonthly = data.monthly.filter((entry) => {
      const entryDate = new Date(entry.month + "-01");
      return entryDate >= start && entryDate <= end;
    });

    const limitedFiltered = filteredMonthly.slice(0, limit);

    const totals = limitedFiltered.reduce(
      (acc, entry) => {
        acc.creditSales += entry.creditSales;
        acc.badDebts += entry.badDebts;
        return acc;
      },
      { creditSales: 0, badDebts: 0 }
    );

    const overallRatio =
      totals.creditSales > 0 ? (totals.badDebts / totals.creditSales) * 100 : 0;

    return {
      filteredMonthly: limitedFiltered,
      totalCreditSales: totals.creditSales,
      totalBadDebts: totals.badDebts,
      overallBadDebtRatioPercentage: parseFloat(overallRatio.toFixed(2)),
    };
  }
}

export default BadDebtRatiosController;
