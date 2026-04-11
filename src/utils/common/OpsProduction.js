import axios from "axios";

class OpsProduction {
  constructor() {
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY;

    this.apiClient = axios.create({
      baseURL: process.env.CMC_API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => { throw error; }
    );

    this.initialized = true;
  }

  async #fetchData(url, params = {}) {
    this.initialize();

    try {
      const response = await this.apiClient.get(url, { params });
      const data = response.data?.data || [];
      const metaData = response.data?.meta || [];
      return { data, metaData };
    } catch (error) {
      throw new Error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  async getInRangeAnalytics(startDate, endDate) {
    const url = `/data/${startDate}/${endDate}`;
    return this.#fetchData(url);
  }

  async fetchModuleData(module, startDate, endDate) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return this.#fetchData(`/operations/${module}`, params);
  }
}

export default OpsProduction;

