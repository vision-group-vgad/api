import axios from "axios";

class AdminSup {
  constructor() {
    this.initialized = false;
    this.BACKEND_URL = process.env.CMC_API_BASE_URL;
    this.API_KEY = process.env.CMS_API_KEY;
  }

  initialize() {
    if (this.initialized) return;

    this.apiClient = axios.create({
      baseURL: this.BACKEND_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.API_KEY}`;
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData(url) {
    this.initialize();

    try {
      const response = await this.apiClient.get(url);
      const data = response.data?.data || [];
      const metaData = response.data?.meta || [];
      return { articles: data, metaData };
    } catch (error) {
      throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  async getInRangeNewsLetAnalytics(startDate, endDate) {
    const url = `/api-listings/newsletter-analytics/summary/${startDate}/${endDate}`;
    const analytics = this.#fetchData(url);
    return analytics;
  }
}

export default AdminSup;
