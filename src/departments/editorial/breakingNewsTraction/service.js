import axios from "axios";
import utils from "./utils.js";
const {
  matchArticles,
  //normalizeTitle,
  //calculateSimilarity,
  parseAverageDuration,
  calculateEngagementScore,
  categorizeTraffic,
} = utils;

class BreakingNewsService {
  constructor() {
    this.baseUrl = "https://cms-vgad.visiongroup.co.ug/api/api-listings";
  }

  async getBreakingNewsTraction({ startDate, endDate, limit, offset }) {
    try {
      // Fetch both APIs in parallel
      const [sessionData, articlesData] = await Promise.all([
        this.fetchSessionDuration(startDate, endDate),
        this.fetchArticles(startDate, endDate, offset, limit),
      ]);

      // Filter breaking news articles
      const breakingNewsArticles = articlesData.data.filter(
        (article) => article.breaking_news === true
      );

      // Match and combine data
      const combinedData = await this.combineArticleData(
        breakingNewsArticles,
        sessionData.data
      );

      // Calculate metrics
      const enrichedData = combinedData.map((article) => ({
        ...article,
        engagementScore: calculateEngagementScore(article),
        tractionLevel: this.calculateTractionLevel(article),
        trafficBreakdown: categorizeTraffic(article.sessionMedium),
      }));

      // Sort by engagement score
      enrichedData.sort((a, b) => b.engagementScore - a.engagementScore);

      return {
        articles: enrichedData,
        total: breakingNewsArticles.length,
        summary: this.generateSummary(enrichedData),
      };
    } catch (error) {
      throw new Error(`Failed to get breaking news traction: ${error.message}`);
    }
  }

  async fetchSessionDuration(startDate, endDate) {
    const url = `${this.baseUrl}/article-session-duration/${startDate}/${endDate}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      
      throw error;
    }
  }

  async fetchArticles(startDate, endDate, offset = 0, limit = 50) {
    const url = `${this.baseUrl}/articles/${startDate}/${endDate}/${offset}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      
      throw error;
    }
  }

  async combineArticleData(breakingNewsArticles, sessionData) {
    const combinedData = [];

    for (const article of breakingNewsArticles) {
      // Match article with session data
      const matchedSession = matchArticles(article, sessionData);

      if (matchedSession) {
        combinedData.push({
          // Article data
          id: article.id,
          externalId: article.externalId,
          title: article.title,
          publishedOn: article.published_on,
          category: article.category.name,
          isBreakingNews: article.breaking_news,
          breakingNewsDuration: article.breaking_news_duration,
          isFeatured: article.is_featured,
          isPremium: article.premium,
          author: article.author,
          tags: article.tags,

          // Session/Performance data
          averageDuration: matchedSession.averageDuration,
          averageDurationSeconds: parseAverageDuration(
            matchedSession.averageDuration
          ),
          bounceRate: parseFloat(matchedSession.bounceRate) || 0,
          sessionMedium: matchedSession.sessionMedium,
          pageReferrer: matchedSession.pageReferrer,
          platform: matchedSession.platform,
          streamName: matchedSession.streamName,

          // Calculated fields
          publishedTimestamp: new Date(article.published_on).getTime(),
          breakingNewsEndTime: this.calculateBreakingNewsEndTime(
            article.published_on,
            article.breaking_news_duration
          ),
        });
      }
    }

    return combinedData;
  }

  calculateBreakingNewsEndTime(publishedOn, duration) {
    const publishTime = new Date(publishedOn);
    return new Date(publishTime.getTime() + duration * 60 * 1000); // duration in minutes
  }

  calculateTractionLevel(article) {
    const score = article.engagementScore || 0;

    if (score >= 8) return "high";
    if (score >= 5) return "medium";
    return "low";
  }

  generateSummary(articles) {
    const total = articles.length;
    const highTraction = articles.filter(
      (a) => a.tractionLevel === "high"
    ).length;
    const avgEngagement =
      articles.reduce((sum, a) => sum + a.engagementScore, 0) / total;
    const avgDuration =
      articles.reduce((sum, a) => sum + a.averageDurationSeconds, 0) / total;

    return {
      totalBreakingNews: total,
      highTractionCount: highTraction,
      averageEngagementScore: Math.round(avgEngagement * 100) / 100,
      averageDurationSeconds: Math.round(avgDuration),
      topCategory: this.getTopCategory(articles),
      organicTrafficPercentage: this.getOrganicTrafficPercentage(articles),
    };
  }

  getTopCategory(articles) {
    const categories = {};
    articles.forEach((article) => {
      categories[article.category] = (categories[article.category] || 0) + 1;
    });

    return Object.keys(categories).reduce((a, b) =>
      categories[a] > categories[b] ? a : b
    );
  }

  getOrganicTrafficPercentage(articles) {
    const organicCount = articles.filter(
      (a) => a.sessionMedium === "organic"
    ).length;
    return Math.round((organicCount / articles.length) * 100);
  }

  async getAggregatedMetrics({ startDate, endDate }) {
    const tractionData = await this.getBreakingNewsTraction({
      startDate,
      endDate,
      limit: 1000,
      offset: 0,
    });

    return {
      overview: tractionData.summary,
      categoryBreakdown: this.getCategoryBreakdown(tractionData.articles),
      timelineMetrics: this.getTimelineMetrics(tractionData.articles),
      trafficSourceAnalysis: this.getTrafficSourceAnalysis(
        tractionData.articles
      ),
    };
  }

  getCategoryBreakdown(articles) {
    const breakdown = {};

    articles.forEach((article) => {
      if (!breakdown[article.category]) {
        breakdown[article.category] = {
          count: 0,
          totalEngagement: 0,
          avgDuration: 0,
          highTraction: 0,
        };
      }

      breakdown[article.category].count++;
      breakdown[article.category].totalEngagement += article.engagementScore;
      breakdown[article.category].avgDuration += article.averageDurationSeconds;
      if (article.tractionLevel === "high") {
        breakdown[article.category].highTraction++;
      }
    });

    // Calculate averages
    Object.keys(breakdown).forEach((category) => {
      const data = breakdown[category];
      data.avgEngagement =
        Math.round((data.totalEngagement / data.count) * 100) / 100;
      data.avgDuration = Math.round(data.avgDuration / data.count);
      data.highTractionPercentage = Math.round(
        (data.highTraction / data.count) * 100
      );
    });

    return breakdown;
  }

  getTimelineMetrics(articles) {
    // Group by hour of publication
    const timeline = {};

    articles.forEach((article) => {
      const hour = new Date(article.publishedOn).getHours();
      if (!timeline[hour]) {
        timeline[hour] = {
          count: 0,
          totalEngagement: 0,
          avgBounceRate: 0,
        };
      }

      timeline[hour].count++;
      timeline[hour].totalEngagement += article.engagementScore;
      timeline[hour].avgBounceRate += article.bounceRate;
    });

    // Calculate averages
    Object.keys(timeline).forEach((hour) => {
      const data = timeline[hour];
      data.avgEngagement =
        Math.round((data.totalEngagement / data.count) * 100) / 100;
      data.avgBounceRate =
        Math.round((data.avgBounceRate / data.count) * 100) / 100;
    });

    return timeline;
  }

  getTrafficSourceAnalysis(articles) {
    const sources = {};

    articles.forEach((article) => {
      const source = article.sessionMedium || "unknown";
      if (!sources[source]) {
        sources[source] = {
          count: 0,
          totalEngagement: 0,
          avgDuration: 0,
        };
      }

      sources[source].count++;
      sources[source].totalEngagement += article.engagementScore;
      sources[source].avgDuration += article.averageDurationSeconds;
    });

    Object.keys(sources).forEach((source) => {
      const data = sources[source];
      data.percentage = Math.round((data.count / articles.length) * 100);
      data.avgEngagement =
        Math.round((data.totalEngagement / data.count) * 100) / 100;
      data.avgDuration = Math.round(data.avgDuration / data.count);
    });

    return sources;
  }

  async getCurrentBreakingNews() {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const tomorrow = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const startDate = todayStart.toISOString().split("T")[0];
    const endDate = tomorrow.toISOString().split("T")[0];

    const data = await this.getBreakingNewsTraction({
      startDate,
      endDate,
      limit: 20,
      offset: 0,
    });

    // Filter only currently active breaking news
    const activeBreakingNews = data.articles.filter((article) => {
      const endTime = new Date(article.breakingNewsEndTime);
      return endTime > now;
    });

    return {
      activeBreakingNews,
      totalActive: activeBreakingNews.length,
      lastUpdated: now.toISOString(),
    };
  }
}

export default new BreakingNewsService();
