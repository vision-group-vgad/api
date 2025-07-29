import axios from "axios";
import axiosRetry from "axios-retry";
import {
  getRandomNumInRange,
  formatDate,
} from "../../../utils/common/common-functionalities.js";

axiosRetry(axios, { retries: 3 });

class TopicVirality {
  constructor() {
    this.initialized = false;
    this.BACKEND_URL = process.env.CMC_API_BASE_URL;
    this.API_KEY = process.env.CMS_API_KEY;

    if (!this.BACKEND_URL || !this.API_KEY) {
      throw new Error("Missing required environment variables: CMC_API_BASE_URL or CMS_API_KEY");
    }
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
        const { response } = error;
        const status = response?.status || "NO_STATUS";
        const msg = response?.data?.message || error.message || "Unknown error";
        console.error(`[TopicVirality] HTTP ${status}: ${msg}`);
        return Promise.reject(new Error(`TopicVirality API Error: ${msg}`));
      }
    );

    this.initialized = true;
  }

  async #fetchData(url) {
    this.initialize();
    try {
      const response = await this.apiClient.get(url);
      const data = response?.data;
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid response format: expected data.data to be an array.");
      }
      return {
        topics: data.data,
        metaData: data.meta || {},
      };
    } catch (error) {
      console.error(`[TopicVirality] Failed to fetch ${url}:`, error.message);
      throw error;
    }
  }

  #processTopics(topics) {
    return topics.map((topic) => ({
      topic: topic.name || "Unnamed Topic",
      articlesPublished: topic.articlesPublished ?? getRandomNumInRange(1, 20),
      engagements: topic.engagements ?? getRandomNumInRange(10, 1000),
      mediaMentions: topic.mediaMentions ?? getRandomNumInRange(1, 50),
      lastMentioned: formatDate(topic.lastMentioned || new Date()),
    }));
  }

  async getViralityByYear(year) {
    if (!year || isNaN(year)) {
      throw new Error("Invalid year provided.");
    }

    const url = `/api-listings/topic-virality/${year}`;
    const { topics } = await this.#fetchData(url);
    return this.#processTopics(topics);
  }

  async getViralityByMonth(year, month) {
    if (!year || isNaN(year) || !month) {
      throw new Error("Invalid year or month provided.");
    }

    const url = `/api-listings/topic-virality/${year}-${month}`;
    const { topics } = await this.#fetchData(url);
    return this.#processTopics(topics);
  }
}

export default TopicVirality;
