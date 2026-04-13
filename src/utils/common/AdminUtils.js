import axios from "axios";

const DEFAULT_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api";

class AdminUtils {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY;

    this.apiClient = axios.create({
      baseURL: process.env.CMC_API_BASE_URL || DEFAULT_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
    });

    this.initialized = true;
  }

  async getMeetings(startDate, endDate) {
    this.initialize();
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await this.apiClient.get("/administrator/meetings", { params });
    return response.data;
  }

  async getProcessThroughput(startDate, endDate) {
    this.initialize();
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await this.apiClient.get("/administrator/processthroughput", { params });
    return response.data;
  }

  async getRVSAnalytics(department) {
    this.initialize();
    const params = {};
    if (department && department !== "All") params.department = department;
    const response = await this.apiClient.get("/administrator/rvs-analytics", { params });
    return response.data;
  }

  async getTaskCompletion(startDate, endDate) {
    this.initialize();
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await this.apiClient.get("/administrator/task-completion", { params });
    return response.data;
  }

  async getVisitorPatterns(department, visitorType) {
    this.initialize();
    const params = {};
    if (department && department !== "All") params.department = department;
    if (visitorType) params.visitorType = visitorType;
    const response = await this.apiClient.get("/administrator/visitor-patterns", { params });
    return response.data;
  }

  async getWaitTime(department, visitorType) {
    this.initialize();
    const params = {};
    if (department && department !== "All") params.department = department;
    if (visitorType) params.visitorType = visitorType;
    const response = await this.apiClient.get("/administrator/wait-time", { params });
    return response.data;
  }
}

export default AdminUtils;
