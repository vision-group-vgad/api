import AdminUtils from "../../../utils/common/AdminUtils.js";
import { rvsDummy } from "./rvs-dummy.js";

const adminUtils = new AdminUtils();

export default class RVSAnalyticsService {
  static async getOverview(department) {
    try {
      const data = await adminUtils.getRVSAnalytics(department);
      if (!data || Object.keys(data).length === 0) return rvsDummy;
      return data;
    } catch (error) {
      console.warn("[RVSAnalytics] Live fetch failed, using dummy:", error.message);
      return rvsDummy;
    }
  }

  static async getResourceUtilizationAnalytics(filters = {}) {
    let src;
    try {
      const live = await adminUtils.getRVSAnalytics(filters.department);
      src = live?.resources || null;
    } catch (_) {
      src = null;
    }
    const r = src || rvsDummy.resources;
    const items = r.items || [];
    const utilPct = parseFloat(r.utilizationRate) || 80;
    const types = [...new Set(items.map((i) => i.type))];
    const byDept = {};
    items.forEach((i) => {
      byDept[i.department] = (byDept[i.department] || 0) + 1;
    });
    const chartData = Object.entries(byDept).map(([label, count]) => ({
      label,
      value: Math.round((count / items.length) * utilPct),
    }));
    return {
      kpis: {
        totalResources: r.totalResources || 0,
        activeResources: r.allocatedResources || 0,
        inactiveResources: r.availableResources || 0,
        avgUtilizationRate: utilPct,
        totalDowntimeHours: 24,
        totalMaintenanceCost: 1500000,
        totalMonthlyCost: 3200000,
        avgEnergyConsumption: 12.5,
        resourceTypes: types.length || 3,
      },
      chartData: chartData.length ? chartData : [{ label: "Operations", value: utilPct }],
    };
  }

  static async getVendorPerformanceAnalytics(filters = {}) {
    let src;
    try {
      const live = await adminUtils.getRVSAnalytics(filters.department);
      src = live?.suppliers || null;
    } catch (_) {
      src = null;
    }
    const s = src || rvsDummy.suppliers;
    const items = s.items || [];
    const chartData = items.map((v) => ({
      label: v.name,
      value: v.rating || 4.0,
    }));
    const avgQuality =
      items.length > 0
        ? items.reduce((sum, v) => sum + (v.rating || 4.0), 0) / items.length
        : 4.2;
    return {
      kpis: {
        totalVendors: s.totalSuppliers || 0,
        activeVendors: s.activeSuppliers || 0,
        onTimeDeliveryRate: 85.5,
        avgServiceQuality: parseFloat(avgQuality.toFixed(2)),
        totalComplaints: 3,
        avgPaymentDays: 22,
      },
      chartData: chartData.length ? chartData : [{ label: "No Data", value: 0 }],
    };
  }

  static async getSpaceOptimizationAnalytics(filters = {}) {
    let src;
    try {
      const live = await adminUtils.getRVSAnalytics(filters.department);
      src = live?.venues || null;
    } catch (_) {
      src = null;
    }
    const v = src || rvsDummy.venues;
    const items = v.items || [];
    const bookingRate = parseFloat(v.bookingRate) || 67;
    const chartData = items.map((space) => ({
      label: space.name,
      value: space.status === "Booked" ? bookingRate : 30,
    }));
    return {
      kpis: {
        totalSpaces: v.totalVenues || 0,
        utilizedSpaces: v.bookedVenues || 0,
        avgUtilizationRate: bookingRate,
        avgOccupancyRate: 72.5,
        idleSpaces: v.availableVenues || 0,
        reservedSpaces: Math.floor((v.bookedVenues || 0) * 0.25),
      },
      chartData: chartData.length ? chartData : [{ label: "No Data", value: 0 }],
    };
  }
}