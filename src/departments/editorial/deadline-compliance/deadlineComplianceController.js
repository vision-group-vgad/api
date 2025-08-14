import { generateDeadlineComplianceData } from "./deadlineComplianceData.js";

export const getDeadlineCompliance = (req, res) => {
  const { status } = req.query; // Optional status filter
  const articles = generateDeadlineComplianceData(200);

  let onTimeCount = 0;
  let earlyCount = 0;
  let lateCount = 0;

  // Assign status to each article
  articles.forEach(article => {
    const publishedAt = new Date(article.publishedAt);
    const deadlineDate = new Date(article.deadlineDate);

    if (publishedAt < deadlineDate) {
      article.status = "early";
      earlyCount++;
    } else if (publishedAt.getTime() === deadlineDate.getTime()) {
      article.status = "on time";
      onTimeCount++;
    } else {
      article.status = "late";
      lateCount++;
    }
  });

  // Filter articles by status if provided, otherwise return all
  const filteredArticles = status
    ? articles.filter(article => article.status === status)
    : articles;

  const total = articles.length;
  const earlyPercentage = ((earlyCount / total) * 100).toFixed(2);
  const onTimePercentage = ((onTimeCount / total) * 100).toFixed(2);
  const latePercentage = ((lateCount / total) * 100).toFixed(2);

  res.json({
    totalArticles: filteredArticles.length,
    onTimeArticles: onTimeCount,
    earlyArticles: earlyCount,
    lateArticles: lateCount,
    earlyPercentage: `${earlyPercentage}%`,
    onTimePercentage: `${onTimePercentage}%`,
    latePercentage: `${latePercentage}%`,
    articles: filteredArticles
  });
};
