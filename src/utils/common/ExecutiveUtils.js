import axios from "axios";

const DEFAULT_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api";

class ExecutiveUtils {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY;

    this.apiClient = axios.create({
      baseURL: process.env.CMC_API_BASE_URL || DEFAULT_BASE_URL,
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
    });

    this.initialized = true;
  }

  async getCeoAnalytics() {
    this.initialize();
    const r = await this.apiClient.get("/executive/ceo-analytics");
    return r.data;
  }

  async getRiskCases() {
    this.initialize();
    const r = await this.apiClient.get("/executive/risk-cases");
    return r.data;
  }

  async getRiskHeatmap() {
    this.initialize();
    const r = await this.apiClient.get("/executive/risk-heatmap");
    return r.data;
  }

  async getRetention() {
    this.initialize();
    const r = await this.apiClient.get("/executive/retention");
    return r.data;
  }

  async getCompensation() {
    this.initialize();
    const r = await this.apiClient.get("/executive/compensation");
    return r.data;
  }

  async getFinanceHealth() {
    this.initialize();
    const r = await this.apiClient.get("/executive/finance-health");
    return r.data;
  }

  async getCompliance() {
    this.initialize();
    const r = await this.apiClient.get("/executive/compliance");
    return r.data;
  }

  async getControlEffectiveness() {
    this.initialize();
    const r = await this.apiClient.get("/executive/control-effectiveness");
    return r.data;
  }

  async getCostOptimization() {
    this.initialize();
    const r = await this.apiClient.get("/executive/cost-optimization");
    return r.data;
  }

  async getCompanyKpis() {
    this.initialize();
    // CMS does not support date-range path params for this endpoint
    const r = await this.apiClient.get("/executive/company-kpis");
    return r.data;
  }
}

export default ExecutiveUtils;
