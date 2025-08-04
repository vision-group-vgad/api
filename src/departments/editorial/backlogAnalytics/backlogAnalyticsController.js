// src/departments/editorial/backlogAnalytics/backlogAnalyticsController.js
import axios from 'axios';
import { parse, format, differenceInDays } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

export const getBacklogAnalytics = async (req, res) => {
  try {
    const { metric = 'backlogKPI', now: nowParam, n: nParam } = req.query;
    const now = nowParam ? new Date(nowParam) : new Date('2025-05-01T16:30:00');
    const n = nParam ? Number(nParam) : 20;

    const apiUrl = `${process.env.CMC_API_BASE_URL}/api-listings/articles/2025-01-01/2025-04-30/${n}`;
    const headers = { Authorization: `Bearer ${process.env.CMS_API_KEY}` };
    const response = await axios.get(apiUrl, { headers });
    const articles = response.data.data || [];

    console.log("Fetched articles:", articles.length, "items");

    if (metric === 'backlogKPI') {
      const totalBacklog = articles.length;
      const hardcodedDueDate = new Date('2025-04-29T13:30:00');

      const overdue = articles.filter(() => {
        return hardcodedDueDate < now;
      });

      const overduePercent = ((overdue.length / totalBacklog) * 100).toFixed(2);

      const avgDuration = (
        articles.reduce((sum, article) => {
          const created = parse(article.created_on, 'M/d/yyyy h:mm:ss a', new Date());
          return sum + differenceInDays(now, created);
        }, 0) / totalBacklog
      ).toFixed(2);

      return res.json({
        metric,
        data: {
          totalBacklog,
          overduePercent,
          averageBacklogDurationInDays: avgDuration
        },
        explanation: 'KPIs showing total backlog, percent overdue, and average backlog duration.'
      });
    }

    if (metric === 'backlogStackedBar') {
      const statusMap = {};
      const hardcodedDueDate = new Date('2025-05-01T16:30:00');

      articles.forEach(article => {
        const section = article.category?.name || 'Unknown';
        const isOverdue = hardcodedDueDate < now;
        const status = article.status || 'Pending';

        if (!statusMap[section]) {
          statusMap[section] = { Pending: 0, 'In Progress': 0, Overdue: 0 };
        }

        if (isOverdue) statusMap[section]['Overdue']++;
        else if (status === 'In Progress') statusMap[section]['In Progress']++;
        else statusMap[section]['Pending']++;
      });

      return res.json({
        metric,
        data: statusMap,
        explanation: 'Stacked bar chart data: Pending, In Progress, and Overdue content per section.'
      });
    }

    if (metric === 'backlogTrend') {
      const trendMap = {};

      articles.forEach(article => {
        const created = parse(article.created_on, 'M/d/yyyy h:mm:ss a', new Date());
        const date = format(created, 'yyyy-MM-dd');

        if (!trendMap[date]) trendMap[date] = 0;
        trendMap[date]++;
      });

      return res.json({
        metric,
        data: trendMap,
        explanation: 'Line chart showing trend in backlog size over time (by article creation date).'
      });
    }

    res.status(400).json({ error: 'Unsupported metric type.' });
  } catch (err) {
    console.error('❌ Backlog analytics error:', err);
    res.status(500).json({ error: 'Failed to retrieve backlog analytics' });
  }
};
