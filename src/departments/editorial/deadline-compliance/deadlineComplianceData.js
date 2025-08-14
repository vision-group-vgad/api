// contentProductionData.js

export function generateDeadlineComplianceData(count = 200) {
  const startDate = new Date("2024-07-01T00:00:00Z").getTime();
  const endDate = new Date("2025-07-31T23:59:59Z").getTime();

  const data = [];

  for (let i = 0; i < count; i++) {
    const deadlineDate = new Date(startDate + Math.random() * (endDate - startDate));
    let publishedAt;

    // Randomly assign status: early, on time, or late
    const statusRand = Math.random();
    if (statusRand < 0.33) {
      // Early: published before deadline
      publishedAt = new Date(deadlineDate.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    } else if (statusRand < 0.66) {
      // On time: published exactly at deadline
      publishedAt = new Date(deadlineDate.getTime());
    } else {
      // Late: published after deadline
      publishedAt = new Date(deadlineDate.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    }

    data.push({
      id: i + 1,
      title: `Article ${i + 1}`,
      deadlineDate: deadlineDate.toISOString(),
      publishedAt: publishedAt.toISOString()
    });
  }

  return data;
}
