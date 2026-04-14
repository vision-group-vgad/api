import axios from "axios";

class IT {
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

    this.initialized = true;
  }

  async fetchLiveData(endpoint) {
    this.initialize();
    try {
      const response = await this.apiClient.get(endpoint);
      return response.data?.data || [];
    } catch (error) {
      throw new Error(`IT live fetch failed [${endpoint}]: ${error.message}`);
    }
  }
}

export default IT;
