// demoEditorialData.js
export function generateEditorialDemoData(n = 50) {
  const authors = ["John Smith", "Jane Doe", "Alice Johnson", "Bob Brown", "Carol Davis"];
  const sections = ["Sports", "Politics", "Technology", "Entertainment", "Health"];

  const start = new Date("2024-07-01T00:00:00Z").getTime();
  const end = new Date("2025-07-31T23:59:59Z").getTime();

  const data = [];

  for (let i = 0; i < n; i++) {
    const scheduledTime = new Date(start + Math.random() * (end - start));

    // Randomly create an actual publication date around the scheduled date
    const variationDays = Math.floor(Math.random() * 5) - 2; // -2 to +2 days variation
    let actualTime = new Date(scheduledTime);
    actualTime.setDate(actualTime.getDate() + variationDays);

    // Ensure actualTime stays within range
    if (actualTime.getTime() < start) actualTime = new Date(start);
    if (actualTime.getTime() > end) actualTime = new Date(end);

    data.push({
      id: i + 1,
      title: `Mock Article ${i + 1}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      section: sections[Math.floor(Math.random() * sections.length)],
      scheduled_publication_date: scheduledTime.toISOString(),
      actual_publication_date: actualTime.toISOString()
    });
  }

  return data;
}

