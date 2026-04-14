import {
  extractYearFromDate,
  getMonthFromDate,
  getDaysBetweenDates,
  getMostFrequentElement,
  truncateToDecimals,
} from "../../../utils/common/common-functionalities.js";
import { readFile } from "fs/promises";

const rawData = await readFile(
  new URL("./social-sentiments-test-data.json", import.meta.url)
);

const testData = JSON.parse(rawData);

class SocialSentimentController {
  constructor() {
  }

  #processSentiments(mentions, ratings) {
    const sentiments = mentions.map((mention) => {
      const matchingRatings = ratings.filter(
        (rating) => rating.date === mention.date
      );
      const matchingMentions = mentions.filter(
        (ment) => ment.date === mention.date
      );
      return {
        date: mention.date,
        mentions: [...matchingMentions],
        ratings: [...matchingRatings],
      };
    });
    sentiments.sort((s1, s2) => s1.date.localeCompare(s2.date));
    const summary = this.#getSentimentsSummary(sentiments);
    return { sentiments, summary };
  }

  #getSentimentsSummary(sentiments) {
    let noOfRatings = 0;
    let noOfMentions = 0;
    sentiments.forEach((sentiment) => {
      noOfRatings += sentiment.ratings.length;
      noOfMentions += sentiment.mentions.length;
    });
    const firstDate = sentiments[0].date;
    const lastDate = sentiments[sentiments.length - 1].date;

    const days = getDaysBetweenDates(firstDate, lastDate);

    const avgDailyMention = truncateToDecimals(noOfMentions / days, 1);
    const avgDailyRating = truncateToDecimals(noOfRatings / days, 1);
    const avgMonthlyMention = avgDailyMention * 30;
    const avgMonthlyRating = avgDailyRating * 30;

    return {
      avgDailyMention: avgDailyMention,
      avgMonthlyMention: avgMonthlyMention,
      avgDailyRating: avgDailyRating,
      avgMonthlyRating: avgMonthlyRating,
      topMetionPlatform: this.#getTopMentionPlatform(sentiments),
      topRatingPlatform: this.#getTopRatingPlatform(sentiments),
    };
  }

  #getTopMentionPlatform(sentiments) {
    const platforms = [];
    sentiments.forEach((sentiment) => {
      sentiment.mentions.forEach((mention) => platforms.push(mention.platform));
    });
    return getMostFrequentElement(platforms);
  }

  #getTopRatingPlatform(sentiments) {
    const platforms = [];
    sentiments.forEach((sentiment) => {
      sentiment.ratings.forEach((rating) => platforms.push(rating.platform));
    });
    return getMostFrequentElement(platforms);
  }

  getAnnualSentiments(year) {
    const annualRatings = testData.ratings.filter(
      (rating) => extractYearFromDate(rating.date) === year
    );
    const annualMentions = testData.mentions.filter(
      (mention) => extractYearFromDate(mention.date) === year
    );
    return this.#processSentiments(annualMentions, annualRatings);
  }

  getMontlySentiements(year, month) {
    const monthlyRatings = testData.ratings.filter(
      (rating) =>
        extractYearFromDate(rating.date) === year &&
        getMonthFromDate(rating.date) === month
    );
    const monthlyMentions = testData.mentions.filter(
      (mention) =>
        extractYearFromDate(mention.date) === year &&
        getMonthFromDate(mention.date) === month
    );

    return this.#processSentiments(monthlyMentions, monthlyRatings);
  }

  getInRangeSentiments(startDate, endDate) {
    const inRangeRatings = testData.ratings.filter(
      (rating) => rating.date >= startDate && rating.date <= endDate
    );
    const inRangeMentions = testData.mentions.filter(
      (mention) => mention.date >= startDate && mention.date <= endDate
    );

    return this.#processSentiments(inRangeMentions, inRangeRatings);
  }
}

export default SocialSentimentController;
