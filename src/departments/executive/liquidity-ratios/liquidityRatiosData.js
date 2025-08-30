// generateLiquidityRatiosRaw.js
export function generateLiquidityRatiosRaw(count = 200) {
  const businessUnits = ["Sales", "Operations", "Marketing", "Finance", "IT"];

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
    const businessUnit = randomChoice(businessUnits);
    const date = randomDate(startDate, endDate);

    // Raw values only (no ratios yet)
    const currentAssets = Math.floor(300000 + Math.random() * 1200000);  // 300K – 1.5M
    const currentLiabilities = Math.floor(150000 + Math.random() * 850000); // 150K – 1M
    const inventory = Math.floor(currentAssets * (0.1 + Math.random() * 0.25)); // 10–35% of assets
    const cash = Math.floor(currentAssets * (0.05 + Math.random() * 0.35)); // 5–40% of assets
    const totalLiabilities = Math.floor(currentLiabilities * (1.2 + Math.random() * 2)); // 120%–300% of CL
    const equity = Math.floor(totalLiabilities * (0.4 + Math.random() * 2)); // ~40%–240% of TL

    data.push({
      recordId: `LR-${String(i + 1).padStart(4, "0")}`,
      businessUnit,
      date: date.toISOString().slice(0, 10),
      currentAssets,
      currentLiabilities,
      inventory,
      cash,
      totalLiabilities,
      equity
    });
  }

  return data;
}
