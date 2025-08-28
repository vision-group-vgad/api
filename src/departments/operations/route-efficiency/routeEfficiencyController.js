import { generateRouteEfficiency } from "./routeEfficiencyData.js";

export const getRouteEfficiency = (req, res) => {
  try {
    const data = generateRouteEfficiency(200);

    const { driverName, vehicle, region, startDate, endDate } = req.query;

    let filteredData = data;

    if (driverName) {
      const names = driverName.split(",");
      filteredData = filteredData.filter(d => names.includes(d.driverName));
    }
    if (vehicle) {
      const vehicles = vehicle.split(",");
      filteredData = filteredData.filter(d => vehicles.includes(d.vehicle));
    }
    if (region) {
      const regions = region.split(",");
      filteredData = filteredData.filter(d => regions.includes(d.region));
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredData = filteredData.filter(d => {
        const dDate = new Date(d.date);
        return dDate >= start && dDate <= end;
      });
    }

    const summary = {
      totalRoutes: filteredData.length,
      avgPlannedDistance: filteredData.reduce((a, b) => a + b.plannedDistance, 0) / filteredData.length || 0,
      avgActualDistance: filteredData.reduce((a, b) => a + b.actualDistance, 0) / filteredData.length || 0,
      avgDeviationPercent: filteredData.reduce((a, b) => a + b.deviationPercent, 0) / filteredData.length || 0,
      totalMissedWaypoints: filteredData.reduce((a, b) => a + b.missedWaypoints, 0),
      totalSkippedWaypoints: filteredData.reduce((a, b) => a + b.skippedWaypoints, 0),
      totalCompletedRoutes: filteredData.reduce((a, b) => a + b.completedRoutes, 0),
    };

    res.json({
      summary,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching route efficiency:", error);
    res.status(500).json({
      message: "Failed to fetch route efficiency",
      error: error.message,
    });
  }
};
