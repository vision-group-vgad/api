export function generateEditorialDemoData(n = 50) {
  const authors = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince"];
  const sections = ["Politics", "Sports", "Technology", "Entertainment"];

  // Fixed date range for publish and updates
  const start = new Date("2024-07-01T00:00:00Z").getTime();
  const end = new Date("2025-07-31T23:59:59Z").getTime();

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomDate(startTime, endTime) {
    return new Date(startTime + Math.random() * (endTime - startTime));
  }

  const articles = [];

  for (let i = 0; i < n; i++) {
    const publishDate = getRandomDate(start, end);
    const updateCount = Math.floor(Math.random() * 5); // 0 to 4 updates
    const updates = [];

    for (let j = 0; j < updateCount; j++) {
      updates.push({
        editor: getRandomItem(authors),
        timestamp: getRandomDate(publishDate.getTime(), end),
        update_type: getRandomItem([
          "Typo fix",
          "Content addition",
          "Image update",
          "SEO change"
        ])
      });
    }

    articles.push({
      article_id: `ART-${i + 1}`,
      title: `Sample Article ${i + 1}`,
      publish_date: publishDate,
      author: getRandomItem(authors),
      section: getRandomItem(sections),
      updates
    });
  }

  return articles;
}
