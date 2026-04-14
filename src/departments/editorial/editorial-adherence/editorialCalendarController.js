// editorialCalendarController.js
import { generateEditorialDemoData } from './editorialAdherenceData.js';

export function assessEditorialCalendar(req, res) {
  const { section, author, startDate, endDate, published_status } = req.query;

  let articles = generateEditorialDemoData(100);

  // Optional Filters
  if (section) {
    articles = articles.filter(a => a.section.toLowerCase() === section.toLowerCase());
  }
  if (author) {
    articles = articles.filter(a => a.author.toLowerCase() === author.toLowerCase());
  }

  // Date range filter (inclusive)
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    articles = articles.filter(item => {
      const scheduled = new Date(item.scheduled_publication_date);
      return scheduled >= start && scheduled <= end;
    });
  }

  // Label each article
  articles = articles.map(a => {
    const scheduled = new Date(a.scheduled_publication_date);
    const actual = new Date(a.actual_publication_date);

    let status;
    if (actual < scheduled) status = "early";
    else if (actual.toDateString() === scheduled.toDateString()) status = "on-time";
    else status = "late";

    return { ...a, published_status: status };
  });

  // Published status filter (optional)
  if (published_status) {
    articles = articles.filter(a => a.published_status.toLowerCase() === published_status.toLowerCase());
  }

  // Aggregate counts per category
  const aggregation = articles.reduce((acc, a) => {
    acc[a.published_status] = (acc[a.published_status] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    metric: "editorialCalendarAdherence",
    count: articles.length,
    filtersApplied: { section, author, startDate, endDate, published_status },
    data: articles,
    summary: aggregation,
    explanation: "Labels each article as early, on-time, or late based on scheduled vs actual publication dates."
  });
}
