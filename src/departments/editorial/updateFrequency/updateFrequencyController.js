// controller/updateFrequencyController.js
import axios from 'axios';
import { parse, differenceInDays, differenceInHours, format } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

export const getFreshnessAnalytics = async (req, res) => {
  try {
    const { metric = 'percentage', now: nowParam, n: nParam } = req.query;

    const now = nowParam ? new Date(nowParam) : new Date('2025-05-01T16:30:00');
    const n = nParam ? Number(nParam) : 20;

    const apiUrl = `${process.env.CMC_API_BASE_URL}/api-listings/articles/2025-01-01/2025-04-30/${n}`;
    const headers = { Authorization: `Bearer ${process.env.CMS_API_KEY}` };
    const response = await axios.get(apiUrl, { headers });
    const articles = response.data.data || [];

    console.log("Fetched articles:", articles.length, "items");

    if (metric === 'updateFrequencyBar') {
      const updatesPerSection = {};

      articles.forEach(article => {
        const section = article.author
          ? `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim()
          : 'Unknown';
        const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
        const dateKey = format(published, 'yyyy-MM-dd');

        if (!updatesPerSection[section]) updatesPerSection[section] = {};
        if (!updatesPerSection[section][dateKey]) updatesPerSection[section][dateKey] = 0;

        updatesPerSection[section][dateKey]++;
      });

      return res.json({
        metric,
        data: updatesPerSection,
        explanation: 'Bar chart showing number of content updates per journalist per day.'
      });
    }

    if (metric === 'updateFrequencyLine') {
      const updatesOverTime = {};

      articles.forEach(article => {
        const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
        const date = format(published, 'yyyy-MM-dd');

        if (!updatesOverTime[date]) updatesOverTime[date] = 0;
        updatesOverTime[date]++;
      });

      return res.json({
        metric,
        data: updatesOverTime,
        explanation: 'Time series line chart showing number of content updates per day.'
      });
    }

    if (metric === 'updateFrequencyKPI') {
      const days = new Set();
      const articlesPerDay = {};

      articles.forEach(article => {
        const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
        const date = format(published, 'yyyy-MM-dd');

        days.add(date);
        if (!articlesPerDay[date]) articlesPerDay[date] = 0;
        articlesPerDay[date]++;
      });

      const totalUpdates = articles.length;
      const avgPerDay = totalUpdates / days.size;
      const avgPerArticle = 1.0; // One update per article in this model

      return res.json({
        metric,
        data: {
          averageUpdatesPerDay: avgPerDay.toFixed(2),
          averageUpdatesPerArticle: avgPerArticle.toFixed(2)
        },
        explanation: 'KPI card showing average number of updates per day and per content piece.'
      });
    }

    if (metric === 'updateFrequencyCalendar') {
      const heatmap = {};

      articles.forEach(article => {
        const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
        const date = format(published, 'yyyy-MM-dd');

        if (!heatmap[date]) heatmap[date] = 0;
        heatmap[date]++;
      });

      return res.json({
        metric,
        data: heatmap,
        explanation: 'Calendar heatmap showing number of updates per day. Higher counts indicate busier editorial days.'
      });
    }

    res.status(400).json({ error: 'Unsupported metric type.' });
  } catch (err) {
    console.error('❌ Freshness analytics error:', err);
    res.status(500).json({ error: 'Failed to retrieve update frequency analytics' });
  }
};
