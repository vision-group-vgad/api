// generateFinancialHealthRaw.js
export function generateFinancialHealthRaw(count = 200) {
  const departments = ["Sales", "Operations", "Marketing", "Finance", "HR", "IT"];

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

    // Raw values only
    const revenue = Math.floor(200000 + Math.random() * 800000); // 200K – 1M
    const cogs = Math.floor(revenue * (0.4 + Math.random() * 0.3)); // 40–70% of revenue
    const expenses = Math.floor((revenue - cogs) * (0.2 + Math.random() * 0.3)); // 20–50% of GP

    const monthlyBurn = Math.floor(15000 + Math.random() * 35000); // 15K – 50K
    const cashReserves = Math.floor(monthlyBurn * (3 + Math.random() * 12)); // 3–15 months

    const cashFlowInvesting = Math.floor(-60000 + Math.random() * 20000); // usually negative
    const cashFlowFinancing = Math.floor(-20000 + Math.random() * 40000); // can be inflow/outflow

    data.push({
      recordId: `FH-${String(i + 1).padStart(4, "0")}`,
      department,
      date: date.toISOString().slice(0, 10),
      revenue,
      cogs,
      expenses,
      cashReserves,
      monthlyBurn,
      cashFlowInvesting,
      cashFlowFinancing
    });
  }

  return data;
}
