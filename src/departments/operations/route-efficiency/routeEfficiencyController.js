import { generateRouteEfficiency } from "./routeEfficiencyData.js";
import OpsProduction from "../../../utils/common/OpsProduction.js";

const opsProduction = new OpsProduction();

export const getRouteEfficiency = async (req, res) => {
  try {
    const { driverName, vehicle, region, startDate, endDate } = req.query;

    const today = new Date().toISOString().slice(0, 10);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const fetchStart = startDate || thirtyDaysAgo;
    const fetchEnd = endDate || today;

    let data;
    try {
      const response = await opsProduction.fetchModuleData('route-efficiency', fetchStart, fetchEnd);
      data = Array.isArray(response.data) && response.data.length > 0 ? response.data : generateRouteEfficiency(200);
      if (!Array.isArray(response.data) || response.data.length === 0) {
        console.warn('[RouteEfficiency] Live data empty, falling back to generated data');
      }
    } catch (fetchError) {
      console.warn('[RouteEfficiency] Live data fetch failed, using generated data:', fetchError.message);
      data = generateRouteEfficiency(200);
    }

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
