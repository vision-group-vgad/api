// roiData.js
export function generateRoiData(count = 200) {
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const vendor = randomChoice(vendors);
    const date = randomDate(startDate, endDate);

    const processingCost = +(5 + Math.random() * 20).toFixed(2); // $5–25
    const processingTime = Math.floor(30 + Math.random() * 90); // 30–120 min
    const exceptionRate = +(Math.random() * 5).toFixed(2); // 0–5%
    const savings = Math.floor(processingCost * 10 + Math.random() * 500); // savings
    const automationCost = Math.floor(50 + Math.random() * 500); // automation cost per invoice

    data.push({
      recordId: `ROI-${String(i + 1).padStart(4, "0")}`,
      vendor,
      date: date.toISOString().slice(0, 10),
      processingCost,
      processingTime,
      exceptionRate,
      savings,
      automationCost
    });
  }

  return data;
}
