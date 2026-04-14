import { parse, format, differenceInDays, isFuture } from 'date-fns';
import dotenv from 'dotenv';
import mockBacklogArticles from './backlogAnalyticsData.js';
dotenv.config();

export const getBacklogAnalytics = async (req, res) => {
  try {
    const { metric = 'backlogKPI', now: nowParam, n: nParam } = req.query;
    const now = nowParam ? new Date(nowParam) : new Date('2025-05-01T16:30:00');
    const n = nParam ? Number(nParam) : 1000;
    const bottleneckThreshold = 5; // days
    const staleReadyThreshold = 10; // days for stale ready articles

    // ✅ Use ONLY mock articles created from your defined file
    const articles = mockBacklogArticles.slice(0, n);
    console.log(`🔍 Fetching backlog analytics for ${articles.length} articles...`);

    const backlogArticles = articles
      .filter(article => {
        const status = article.status;
        if (!status) return false;

        // Include if in draft, in-review, or ready
        if (status === 'draft' || status === 'in-review' || status === 'ready') return true;

        // Include 'ready' only if not yet published (redundant given above but kept for logic clarity)
        if (status === 'ready' && article.published_on && isFuture(new Date(article.published_on))) {
          return true;
        }

        return false;
      })
      .map(article => {
        const created = parse(article.created_on, 'M/d/yyyy h:mm:ss a', new Date());
        const modified = article.last_modified_on
          ? parse(article.last_modified_on, 'M/d/yyyy h:mm:ss a', new Date())
          : created;

        // Clamp negative durations to 0 to avoid negative backlog days
        const rawDiff = differenceInDays(now, modified);
        const backlogDuration = rawDiff < 0 ? 0 : rawDiff;

        return {
          id: article.id,
          title: article.title,
          author: `${article.author.first_name} ${article.author.last_name}`,
          category: article.category,
          status: article.status,
          created_on: article.created_on,
          last_modified_on: article.last_modified_on || article.created_on,
          backlogDurationInDays: backlogDuration,
        };
      });

    // Return all backlog articles with metadata
    if (metric === 'backlogDetails') {
      const backlogDetails = backlogArticles.map(article => ({
        id: article.id,
        title: article.title,
        author: article.author,
        section: article.category?.name || 'Unknown',
        status: article.status,
        created_on: article.created_on,
        last_modified_on: article.last_modified_on,
        backlogDurationInDays: article.backlogDurationInDays,
      }));

      return res.json({
        metric,
        count: backlogDetails.length,
        data: backlogDetails,
        explanation: 'Detailed backlog articles info including metadata and backlog duration',
      });
    }

    // Detect bottlenecks: drafts with no activity over X days (bottleneckThreshold)
    if (metric === 'bottlenecks') {
      const bottlenecks = backlogArticles.filter(
        article => article.status === 'draft' && article.backlogDurationInDays >= bottleneckThreshold
      );

      return res.json({
        metric,
        count: bottlenecks.length,
        data: bottlenecks,
        explanation: `Draft articles with no activity over ${bottleneckThreshold} days (bottlenecks)`,
      });
    }

    // Detect stale ready articles (ready but unchanged for too long)
    if (metric === 'staleReadyArticles') {
      const staleReady = backlogArticles.filter(
        article => article.status === 'ready' && article.backlogDurationInDays >= staleReadyThreshold
      );

      return res.json({
        metric,
        count: staleReady.length,
        data: staleReady,
        explanation: `Ready articles that have been in backlog for over ${staleReadyThreshold} days without updates`,
      });
    }

    res.status(400).json({ error: 'Unsupported metric type.' });
  } catch (err) {
    console.error('❌ Backlog analytics error:', err);
    res.status(500).json({ error: 'Failed to retrieve backlog analytics' });
  }
};
