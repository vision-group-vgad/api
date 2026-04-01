import dotenv from "dotenv";
dotenv.config();

export default class RVSAnalyticsService {
  static async getCombinedOverview(department) {
    try {
      // Simulate fetching from multiple APIs / DB
      const resources = {
        totalResources: 120,
        allocatedResources: 95,
        availableResources: 25,
        avgUtilizationRate: 78.33,
        totalMonthlyCost: 540000,
        avgEnergyConsumption: 320.5,
      };

      const spaces = {
        totalSpaces: 50,
        totalArea: 100000,
        allocatedArea: 76000,
        vacantArea: 24000,
        avgOccupancyRate: 76.5,
        totalSpaceCost: 1250000,
        departments: 6,
      };

      const vendors = {
        totalVendors: 30,
        activeVendors: 24,
        inactiveVendors: 6,
        totalContractValue: 4500000,
        totalActualCost: 4100000,
        costVariance: 400000,
      };

      // Filter logic example (you can replace with real DB queries)
      if (department !== "All") {
        // Here you can filter each section based on department
        // For demo, we'll just append department to summary
        resources.department = department;
        spaces.department = department;
        vendors.department = department;
      }

      const summary = {
        totalResources: resources.totalResources,
        totalSpaces: spaces.totalSpaces,
        totalVendors: vendors.totalVendors,
        totalMonthlyCost:
          resources.totalMonthlyCost + spaces.totalSpaceCost + vendors.totalActualCost,
        overallUtilizationRate: resources.avgUtilizationRate,
        overallOccupancyRate: spaces.avgOccupancyRate,
      };

      return { resources, spaces, vendors, summary };
    } catch (err) {
      console.error("RVS Analytics Service Error:", err);
      throw err;
    }
  }
}