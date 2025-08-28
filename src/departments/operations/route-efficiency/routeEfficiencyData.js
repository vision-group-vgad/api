export function generateRouteEfficiency(count = 200) {
  const drivers = [
    { id: "D001", name: "John Miller" },
    { id: "D002", name: "Sophia Lopez" },
    { id: "D003", name: "Michael Brown" },
    { id: "D004", name: "Emily Davis" },
    { id: "D005", name: "James Wilson" },
  ];

  const vehicles = ["Truck A", "Van B", "Truck C", "Bike D"];
  const regions = ["North", "South", "East", "West"];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDateTime(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const driver = randomChoice(drivers);
    const vehicle = randomChoice(vehicles);
    const region = randomChoice(regions);
    const date = randomDateTime(startDate, endDate);

    const plannedDistance = Math.floor(50 + Math.random() * 200); // km
    const actualDistance = plannedDistance + Math.floor((Math.random() - 0.5) * 40); // ±20 km
    const etaMinutes = 60 + Math.floor(Math.random() * 180); // 1–4 hrs planned
    const actualMinutes = etaMinutes + Math.floor((Math.random() - 0.5) * 60); // ±30 min
    const deviationPercent = ((actualDistance - plannedDistance) / plannedDistance) * 100;

    // Completed routes: 1–5
    const completedRoutes = Math.floor(1 + Math.random() * 5);

    let missedWaypoints = 0;
    let skippedWaypoints = 0;

    if (deviationPercent > 0) {
      if (deviationPercent > 15) missedWaypoints = Math.floor(1 + Math.random() * 2);
      else if (deviationPercent > 5) missedWaypoints = Math.random() < 0.3 ? 1 : 0;
    } else if (deviationPercent < 0) {
      skippedWaypoints = Math.floor(1 + Math.random() * 2);
    }

    if (actualMinutes - etaMinutes > 20) skippedWaypoints = Math.max(skippedWaypoints, Math.random() < 0.5 ? 1 : 0);

    data.push({
      routeId: `R-${String(i + 1).padStart(4, "0")}`,
      driverId: driver.id,
      driverName: driver.name,
      vehicle,
      region,
      date: date.toISOString().slice(0, 10),
      plannedDistance,
      actualDistance,
      etaMinutes,
      actualMinutes,
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      missedWaypoints,
      skippedWaypoints,
      completedRoutes,
    });
  }

  return data;
}
