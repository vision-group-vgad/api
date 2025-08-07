export const mergeData = (articles, sessions) => {
  return articles.map(article => {
    const externalId = article.externalId;
    const match = sessions.find(s =>
      s.pagePath.includes(externalId)
    );

    return {
      externalId,
      title: article.title,
      publishedDate: article.published_on,
      category: article.category?.name,
      tags: article.tags,
      author: article.author?.first_name,
      editor: `${article.editor?.first_name} ${article.editor?.last_name}`,
      platform: match?.platform || "web",
      avgSessionTime: match?.averageDuration || "00:00:00",
      scrollDepth: Number(match?.percentScrolled || 0),
      bounceRate: Number(match?.bounceRate || 1),
    };
  });
};

// Add dummy fields
export const generateDummyFields = (items) => {
  return items.map(item => {
    const views = Math.floor(Math.random() * 2000);
    const shares = Math.floor(Math.random() * 50);
    const comments = Math.floor(Math.random() * 20);
    const clicks = Math.floor(Math.random() * 30);
    const visualType = ["image", "video", "infographic"][Math.floor(Math.random() * 3)];
    const visualCount = Math.floor(Math.random() * 3) + 1;

    // Convert HH:MM:SS to seconds
    const [h, m, s] = item.avgSessionTime.split(":").map(Number);
    const sessionSecs = h * 3600 + m * 60 + s;

    const score = (
      (item.scrollDepth / 100) * 0.25 +
      (sessionSecs / 600) * 0.25 +
      ((1 - item.bounceRate) * 0.2) +
      (clicks / 10) * 0.1 +
      (shares / 10) * 0.1 +
      (comments / 5) * 0.1
    );

    return {
      ...item,
      views,
      shares,
      comments,
      clicks,
      visualType,
      visualCount,
      visualEngagementScore: Number(score.toFixed(2))
    };
  });
};
