// contentProductionController.js
import { generateContentProductionDemoData } from "./contentProductionData.js";

export const getContentProductionStats = (req, res) => {
  const { interval = "daily", section, author, platform, startDate, endDate } = req.query;

  // Default date range (July 2024 → July 2025)
  const defaultStart = new Date("2024-07-01T00:00:00Z");
  const defaultEnd = new Date("2025-07-31T23:59:59Z");

  let articles = generateContentProductionDemoData(10000);

  // Optional filters
  if (section) articles = articles.filter(a => a.section.toLowerCase() === section.toLowerCase());
  if (author) articles = articles.filter(a => a.author.toLowerCase() === author.toLowerCase());
  if (platform) articles = articles.filter(a => a.platform.toLowerCase() === platform.toLowerCase());

  // Date range filter (inclusive)
  const start = startDate ? new Date(startDate) : defaultStart;
  const end = endDate ? new Date(endDate) : defaultEnd;

  articles = articles.filter(item => {
    const published = new Date(item.publish_date);
    return published >= start && published <= end;
  });

  // Group by selected interval
  const grouped = {};
  for (const article of articles) {
    let key;
    const date = new Date(article.publish_date);

    if (interval === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (interval === "weekly") {
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      key = weekStart.toISOString().split("T")[0];
    } else if (interval === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    grouped[key] = (grouped[key] || 0) + 1;
  }

  const trend = Object.entries(grouped).map(([period, count]) => ({
    period,
    count
  }));

  const total = trend.reduce((sum, r) => sum + r.count, 0);
  const average = trend.length ? total / trend.length : 0;

  res.json({
    interval,
    start: start.toISOString(),
    end: end.toISOString(),
    total,
    average,
    trend,
    articles,
  });
};
