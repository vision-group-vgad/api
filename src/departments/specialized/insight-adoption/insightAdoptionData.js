export function generateInsightAdoptionDataRaw(count = 200) {
  const insights = [
    "Market Trend Report",
    "Customer Behavior Analysis",
    "Product Usage Insights",
    "Sales Forecast Q3",
    "Competitive Analysis 2025",
    "Quarterly Revenue Report",
    "Customer Satisfaction Survey",
    "Marketing Campaign Analysis",
    "Operational Efficiency Report",
    "R&D Project Insights"
  ];

  const departments = ["Marketing", "Sales", "Finance", "Operations", "R&D"];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const insightName = randomChoice(insights);
    const department = randomChoice(departments);
    const date = randomDate(startDate, endDate);

    // Raw values only (realistic ranges, no derived calcs)
    const views = Math.floor(30 + Math.random() * 220); // 30–250
    const downloads = Math.floor(10 + Math.random() * 120); // 10–130

    data.push({
      recordId: `INS-${String(i + 1).padStart(4, "0")}`,
      insightName,
      department,
      date: date.toISOString().slice(0, 10),
      views,
      downloads,
      
    });
  }

  return data;
}
