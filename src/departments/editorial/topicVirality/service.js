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
    const response = await this.apiClient.get(url);
    const topics = response.data?.data || [];
    const metaData = response.data?.meta || [];
    return { topics, metaData };
  }

  #processTopics(topics) {
   
    return topics.map((topic) => ({
      topic: topic.name,
      articlesPublished: topic.articlesPublished ?? getRandomNumInRange(1, 20),
      engagements: topic.engagements ?? getRandomNumInRange(10, 1000),
      mediaMentions: topic.mediaMentions ?? getRandomNumInRange(1, 50),
      lastMentioned: formatDate(topic.lastMentioned || new Date()),
    }));
  }

  async getViralityByYear(year) {
    const url = `/api-listings/topic-virality/${year}`;
    const rawData = await this.#fetchData(url);
    return this.#processTopics(rawData.topics);
  }

  async getViralityByMonth(year, month) {
    const url = `/api-listings/topic-virality/${year}-${month}`;
    const rawData = await this.#fetchData(url);
    return this.#processTopics(rawData.topics);
  }
}

export default TopicVirality;