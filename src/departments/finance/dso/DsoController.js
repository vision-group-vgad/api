import axios from "axios";

class DsoController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
    this.dummyDSO = [
      {
        month: "January",
        creditSales: 10000,
        accountsReceivable: 12000,
        monthlyDSO: 36.0,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "February",
        creditSales: 11000,
        accountsReceivable: 13000,
        monthlyDSO: 35.45,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "March",
        creditSales: 12000,
        accountsReceivable: 14000,
        monthlyDSO: 35.0,
        quarterlyDSO: 38.18,
        annualDSO: 0,
      },

      {
        month: "April",
        creditSales: 13000,
        accountsReceivable: 12500,
        monthlyDSO: 28.85,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "May",
        creditSales: 12500,
        accountsReceivable: 13500,
        monthlyDSO: 32.4,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "June",
        creditSales: 13500,
        accountsReceivable: 14500,
        monthlyDSO: 32.22,
        quarterlyDSO: 29.0,
        annualDSO: 0,
      },

      {
        month: "July",
        creditSales: 14000,
        accountsReceivable: 15000,
        monthlyDSO: 32.14,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "August",
        creditSales: 14500,
        accountsReceivable: 15500,
        monthlyDSO: 32.07,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "September",
        creditSales: 15000,
        accountsReceivable: 16000,
        monthlyDSO: 32.0,
        quarterlyDSO: 29.47,
        annualDSO: 0,
      },

      {
        month: "October",
        creditSales: 15500,
        accountsReceivable: 17000,
        monthlyDSO: 32.9,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "November",
        creditSales: 16000,
        accountsReceivable: 17500,
        monthlyDSO: 32.81,
        quarterlyDSO: 0,
        annualDSO: 0,
      },
      {
        month: "December",
        creditSales: 16500,
        accountsReceivable: 18000,
        monthlyDSO: 32.73,
        quarterlyDSO: 29.79,
        annualDSO: 30.15,
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
          "DSO endpoint error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );

    this.initialized = true;
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

      this.transformed = this.dummyDSO;
      return this.transformed;
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      return { error: "Failed to fetch data for DSO" };
    }
  }
}

export default DsoController;
