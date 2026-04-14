// costOptimizationData.js
export function generateCostOptimizationData(count = 200) {
  const departments = ["Sales", "Operations", "Marketing", "Finance", "HR", "IT", "Legal"];
  
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
    const department = randomChoice(departments);
    const date = randomDate(startDate, endDate);

    // Budget and actual spend
    const budget = Math.floor(50000 + Math.random() * 150000); // 50K - 200K
    const actualSpend = Math.floor(budget * (0.7 + Math.random() * 0.6)); // 70%-130% of budget
    const legalSpend = department === "Legal" ? Math.floor(10000 + Math.random() * 50000) : Math.floor(Math.random() * 5000);

    data.push({
      recordId: `CO-${String(i + 1).padStart(4, "0")}`,
      department,
      date: date.toISOString().slice(0, 10),
      budget,
      actualSpend,
      legalSpend
    });
  }

  return data;
}
