// contentProductionData.js
export function generateContentProductionDemoData(n = 200) {
  const start = new Date("2024-07-01T00:00:00Z").getTime();
  const end = new Date("2025-07-31T23:59:59Z").getTime();

  const sections = ["Politics", "Sports", "Technology", "Entertainment", "Health"];
  const authors = ["Alice Johnson", "Bob Smith", "Charlie Davis", "Dana Lee", "Evan Brown"];
  const platforms = ["Web", "Mobile", "Print"];

  const data = [];

  for (let i = 0; i < n; i++) {
    const publishDate = new Date(start + Math.random() * (end - start));

    data.push({
      article_id: `A-${i + 1}`,
      title: `Article ${i + 1}`,
      section: sections[Math.floor(Math.random() * sections.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      publish_date: publishDate
    });
  }

  return data;
}
