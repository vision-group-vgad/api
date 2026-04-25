// controller/freshnessAnalyticsController.js
import axios from 'axios';
import { parse, differenceInHours, format, differenceInDays } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

const fallbackArticles = [
  {
    id: 1,
    published_on: '4/29/2025 10:00:00 AM',
    category: { name: 'Politics' },
  },
  {
    id: 2,
    published_on: '4/30/2025 08:30:00 AM',
    category: { name: 'Business' },
  },
  {
    id: 3,
    published_on: '4/30/2025 01:15:00 PM',
    category: { name: 'Sports' },
  },
];

export const getFreshnessAnalytics = async (req, res) => {
  try {
    const { metric = 'percentage', now: nowParam, n: nParam } = req.query;

    const now = nowParam ? new Date(nowParam) : new Date('2025-05-01T16:30:00');

    const n = nParam ? Number(nParam) : 20;

    const apiUrl = `${process.env.CMC_API_BASE_URL}/api-listings/articles/2025-01-01/2025-04-30/${n}`;

    const headers = {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    };

    const response = await axios.get(apiUrl, { headers, timeout: 10000 });
    const sourceArticles = Array.isArray(response?.data?.data) ? response.data.data : [];
    const articles = sourceArticles.length > 0 ? sourceArticles : fallbackArticles;
    console.log("Fetched articles:", articles, articles.length, "items");

    if (metric === "all articles"){
      return res.json({
        articles
      });
    }

    //Freshness metrics calculations
    if (metric === 'percentage') {
      const freshArticles = articles.filter(article => {
        const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
        const diffInHours = differenceInHours(now, published);
        return diffInHours <= 48;
      });
      return res.json({
        percentage: ((freshArticles.length / articles.length) * 100).toFixed(2),
      });
    }

    // Heatmap of articles by section and recency

    if (metric === 'heatmap') {
    const heatmap = {};
    articles.forEach(article => {
    const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
    const date = format(published, 'yyyy-MM-dd');
    const section = article.category?.name || 'Unknown';
    const hoursSincePublished = differenceInHours(now, published);

    if (!heatmap[section]) heatmap[section] = {};
    if (!heatmap[section][date]) {
      heatmap[section][date] = { count: 0, recencyHours: hoursSincePublished };
    }
    heatmap[section][date].count++;

    // Update recencyHours to the smallest value (most recent article time) for that date & section
    if (hoursSincePublished < heatmap[section][date].recencyHours) {
      heatmap[section][date].recencyHours = hoursSincePublished;
    }
    });
    return res.json(heatmap);
   }

   // Average age of articles by section

    if (metric === 'averageAge') {
    const ageTrend = {};

    articles.forEach(article => {
      const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
      const date = format(published, 'yyyy-MM-dd');
      const hoursSincePublished = differenceInHours(now, published);

      if (!ageTrend[date]) {
        ageTrend[date] = { totalHours: 0, count: 0 };
      }

      ageTrend[date].totalHours += hoursSincePublished;
      ageTrend[date].count++;
    });

    const averageAgeTrend = Object.entries(ageTrend).reduce((acc, [date, data]) => {
      acc[date] = {
        avgAgeInHours: Number((data.totalHours / data.count).toFixed(2))
      };
      return acc;
    }, {});

    return res.json(averageAgeTrend);
  }

// Distribution of articles by recency

      if (metric === 'distribution') {
    const distribution = {};

    articles.forEach(article => {
      const published = parse(article.published_on, 'M/d/yyyy h:mm:ss a', new Date());
      const section = article.category?.name || 'Unknown';
      const ageDays = differenceInDays(now, published);

      if (!distribution[section]) {
        distribution[section] = {
          last24h: 0,
          last3d: 0,
          last7dPlus: 0
        };
      }

      if (ageDays <= 1) {
        distribution[section].last24h++;
      } else if (ageDays <= 3) {
        distribution[section].last3d++;
      } else if (ageDays > 7) {
        distribution[section].last7dPlus++;
      }
    });

    return res.json(distribution);
  }
  return res.json("Fetched Aticles:",articles)

  } catch (err) {
    console.error('❌ Freshness analytics error:', err);
    const articles = fallbackArticles;

    if (req.query.metric === "all articles") {
      return res.status(200).json({ articles, source: 'dummy' });
    }

    if (req.query.metric === 'heatmap') {
      return res.status(200).json({ Politics: { '2025-04-29': { count: 1, recencyHours: 24 } }, source: 'dummy' });
    }

    if (req.query.metric === 'averageAge') {
      return res.status(200).json({ '2025-04-29': { avgAgeInHours: 24 }, source: 'dummy' });
    }

    if (req.query.metric === 'distribution') {
      return res.status(200).json({ Politics: { last24h: 1, last3d: 0, last7dPlus: 0 }, source: 'dummy' });
    }

    return res.status(200).json({ percentage: '66.67', source: 'dummy' });
  }
};
