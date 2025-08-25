import axios from "axios";

// Simple in-memory cache for batch fetches
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Expanded Dummy Data Generators ---
const generateResourceData = () => {
  const base = [
    {
      resource_id: "RES001",
      resource_name: "Dell Latitude 5520",
      resource_type: "Laptop",
      department: "Editorial",
      status: "Active",
      hours_used: 168,
      capacity_hours: 240,
      utilization_rate: 70,
      last_maintenance_date: "2025-01-15",
      maintenance_cost: 150,
      downtime_hours: 2,
      power_usage: 65,
      energy_cost: 25.50,
      cost_center: "IT Equipment",
      monthly_cost: 300
    },
    {
      resource_id: "RES002",
      resource_name: "Canon Printer MX920",
      resource_type: "Printer",
      department: "Administration",
      status: "Active",
      hours_used: 120,
      capacity_hours: 200,
      utilization_rate: 60,
      last_maintenance_date: "2025-01-10",
      maintenance_cost: 80,
      downtime_hours: 0,
      power_usage: 15,
      energy_cost: 12.00,
      cost_center: "Office Supplies",
      monthly_cost: 85
    },
    {
      resource_id: "RES003",
      resource_name: "Toyota Hiace Van",
      resource_type: "Vehicle",
      department: "Operations",
      status: "Maintenance",
      hours_used: 160,
      capacity_hours: 200,
      utilization_rate: 80,
      last_maintenance_date: "2025-01-20",
      maintenance_cost: 450,
      downtime_hours: 8,
      power_usage: 0,
      energy_cost: 180.00,
      cost_center: "Transport",
      monthly_cost: 850
    },
    {
      resource_id: "RES004",
      resource_name: "Server HP ProLiant",
      resource_type: "Server",
      department: "IT",
      status: "Active",
      hours_used: 720,
      capacity_hours: 720,
      utilization_rate: 100,
      last_maintenance_date: "2024-12-15",
      maintenance_cost: 1200,
      downtime_hours: 5,
      power_usage: 400,
      energy_cost: 95.00,
      cost_center: "Infrastructure",
      monthly_cost: 2500
    },
    {
      resource_id: "RES005",
      resource_name: "Camera Sony FX3",
      resource_type: "Camera",
      department: "Video Production",
      status: "Active",
      hours_used: 45,
      capacity_hours: 168,
      utilization_rate: 27,
      last_maintenance_date: "2025-01-05",
      maintenance_cost: 200,
      downtime_hours: 0,
      power_usage: 8,
      energy_cost: 5.50,
      cost_center: "Production Equipment",
      monthly_cost: 450
    }
  ];
  // Add more dummy resources for realism
  const departments = ["Editorial", "Administration", "Operations", "IT", "Video Production", "Finance", "HR"];
  const types = ["Laptop", "Printer", "Vehicle", "Server", "Camera", "Projector", "Router"];
  for (let i = 6; i <= 30; i++) {
    base.push({
      resource_id: `RES${String(i).padStart(3, "0")}`,
      resource_name: `Resource ${i}`,
      resource_type: types[i % types.length],
      department: departments[i % departments.length],
      status: i % 5 === 0 ? "Maintenance" : "Active",
      hours_used: 50 + (i * 10) % 700,
      capacity_hours: 100 + (i * 20) % 800,
      utilization_rate: Math.round(Math.random() * 100),
      last_maintenance_date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
      maintenance_cost: 50 + (i * 15) % 1200,
      downtime_hours: i % 4,
      power_usage: 10 + (i * 5) % 500,
      energy_cost: Math.round(Math.random() * 100),
      cost_center: ["IT Equipment", "Office Supplies", "Transport", "Infrastructure", "Production Equipment"][i % 5],
      monthly_cost: 100 + (i * 50) % 3000
    });
  }
  return base;
};

const generateSpaceData = () => {
  const base = [
    {
      space_id: "SP001",
      location: "HQ Floor 1",
      total_area: 1000,
      allocated_area: 800,
      vacant_area: 200,
      capacity: 50,
      current_usage: 42,
      occupancy_rate: 84,
      department_id: "Editorial",
      rent_cost: 25000,
      utilities_cost: 5000,
      cost_per_sqm: 30
    },
    {
      space_id: "SP002",
      location: "HQ Floor 2",
      total_area: 800,
      allocated_area: 600,
      vacant_area: 200,
      capacity: 40,
      current_usage: 35,
      occupancy_rate: 87.5,
      department_id: "Administration",
      rent_cost: 20000,
      utilities_cost: 4000,
      cost_per_sqm: 30
    },
    {
      space_id: "SP003",
      location: "Meeting Room A",
      total_area: 50,
      allocated_area: 50,
      vacant_area: 0,
      capacity: 12,
      current_usage: 5,
      occupancy_rate: 41.7,
      department_id: "Shared",
      bookings_count: 25,
      avg_usage_hours: 4,
      idle_hours: 60,
      rent_cost: 0,
      utilities_cost: 200,
      cost_per_sqm: 4
    },
    {
      space_id: "SP004",
      location: "Storage Warehouse",
      total_area: 500,
      allocated_area: 350,
      vacant_area: 150,
      capacity: 1000,
      current_usage: 700,
      occupancy_rate: 70,
      department_id: "Operations",
      rent_cost: 8000,
      utilities_cost: 800,
      cost_per_sqm: 17.6
    }
  ];
  // Add more dummy spaces
  for (let i = 5; i <= 20; i++) {
    base.push({
      space_id: `SP${String(i).padStart(3, "0")}`,
      location: `HQ Floor ${i}`,
      total_area: 200 + (i * 50) % 2000,
      allocated_area: 100 + (i * 40) % 1500,
      vacant_area: 50 + (i * 10) % 500,
      capacity: 10 + (i * 5) % 100,
      current_usage: 5 + (i * 3) % 80,
      occupancy_rate: Math.round(Math.random() * 100),
      department_id: ["Editorial", "Administration", "Operations", "IT", "Video Production", "Finance", "HR"][i % 7],
      rent_cost: 5000 + (i * 1000) % 30000,
      utilities_cost: 500 + (i * 200) % 7000,
      cost_per_sqm: 10 + (i * 2) % 40
    });
  }
  return base;
};

const generateVendorData = () => {
  const base = [
    {
      vendor_id: "VEN001",
      vendor_name: "AFP News Agency",
      service_type: "News Feed",
      contract_terms: "Annual renewable",
      expected_delivery_date: "2025-01-15",
      actual_delivery_date: "2025-01-15",
      delay_days: 0,
      complaints_count: 1,
      service_quality_score: 9.2,
      regulatory_compliance: 100,
      contract_compliance: 98,
      budgeted_cost: 50000,
      actual_cost: 48500,
      variance: -1500,
      invoice_date: "2025-01-01",
      payment_date: "2025-01-30",
      days_to_pay: 29,
      contract_start: "2023-01-01",
      contract_end: "2025-12-31"
    },
    {
      vendor_id: "VEN002",
      vendor_name: "TechSupport Uganda",
      service_type: "IT Support",
      contract_terms: "Monthly service",
      expected_delivery_date: "2025-01-20",
      actual_delivery_date: "2025-01-23",
      delay_days: 3,
      complaints_count: 2,
      service_quality_score: 8.1,
      regulatory_compliance: 100,
      contract_compliance: 95,
      budgeted_cost: 15000,
      actual_cost: 16200,
      variance: 1200,
      invoice_date: "2025-01-01",
      payment_date: "2025-02-14",
      days_to_pay: 44,
      contract_start: "2024-06-01",
      contract_end: "2025-05-31"
    },
    {
      vendor_id: "VEN003",
      vendor_name: "Office Supplies Ltd",
      service_type: "Office Supplies",
      contract_terms: "As needed basis",
      expected_delivery_date: "2025-01-10",
      actual_delivery_date: "2025-01-12",
      delay_days: 2,
      complaints_count: 0,
      service_quality_score: 8.8,
      regulatory_compliance: 100,
      contract_compliance: 100,
      budgeted_cost: 5000,
      actual_cost: 4800,
      variance: -200,
      invoice_date: "2025-01-01",
      payment_date: "2025-01-25",
      days_to_pay: 24,
      contract_start: "2024-01-01",
      contract_end: "2025-12-31"
    },
    {
      vendor_id: "VEN004",
      vendor_name: "CleanPro Services",
      service_type: "Cleaning",
      contract_terms: "Monthly contract",
      expected_delivery_date: "2025-01-01",
      actual_delivery_date: "2025-01-01",
      delay_days: 0,
      complaints_count: 1,
      service_quality_score: 7.5,
      regulatory_compliance: 98,
      contract_compliance: 97,
      budgeted_cost: 8000,
      actual_cost: 8500,
      variance: 500,
      invoice_date: "2025-01-01",
      payment_date: "2025-02-05",
      days_to_pay: 35,
      contract_start: "2024-03-01",
      contract_end: "2025-02-28"
    }
  ];
  // Add more dummy vendors
  const serviceTypes = ["News Feed", "IT Support", "Office Supplies", "Cleaning", "Security", "Catering"];
  for (let i = 5; i <= 25; i++) {
    base.push({
      vendor_id: `VEN${String(i).padStart(3, "0")}`,
      vendor_name: `Vendor ${i}`,
      service_type: serviceTypes[i % serviceTypes.length],
      contract_terms: ["Annual", "Monthly", "As needed"][i % 3],
      expected_delivery_date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
      actual_delivery_date: `2025-01-${String((i % 28) + 1 + (i % 3)).padStart(2, "0")}`,
      delay_days: i % 4,
      complaints_count: i % 3,
      service_quality_score: Math.round((7 + Math.random() * 3) * 10) / 10,
      regulatory_compliance: 95 + (i % 6),
      contract_compliance: 90 + (i % 11),
      budgeted_cost: 5000 + (i * 2000) % 60000,
      actual_cost: 4800 + (i * 2100) % 65000,
      variance: -200 + (i * 100) % 3000,
      invoice_date: `2025-01-01`,
      payment_date: `2025-01-${String((i % 28) + 5).padStart(2, "0")}`,
      days_to_pay: 20 + (i % 30),
      contract_start: `2024-01-01`,
      contract_end: `2025-12-31`
    });
  }
  return base;
};

class rvsAnalyticsService {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    this.baseURL = process.env.CMC_API_BASE_URL || "https://cms-vgad.visiongroup.co.ug/api";
    this.bearerToken = process.env.CMC_API_BEARER_TOKEN;
    this.credentials = {
      username: process.env.CMC_API_USERNAME || "intern-developer@newvision.co.ug",
      password: process.env.CMC_API_PASSWORD || "45!3@Vgad2025",
    };

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    this.setupAuthentication();
    this.initialized = true;
    console.log("🔧 [RVS Service] RVSAnalyticsService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 [RVS Service] Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 [RVS Service] Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [RVS Service] RVS API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // RESOURCE UTILIZATION METHODS
  async fetchAllResources({ startDate, endDate, department, resourceType, page = 1, pageSize = 10 }) {
    // Uncomment and use real API when ready
    // this.initialize();
    // const response = await this.apiClient.get('/resources', { params: { startDate, endDate, department, resourceType, page, pageSize } });
    // return response.data;

    let resources = generateResourceData();

    if (department) {
      resources = resources.filter(r => r.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (resourceType) {
      resources = resources.filter(r => r.resource_type.toLowerCase().includes(resourceType.toLowerCase()));
    }

    const totalCount = resources.length;
    const startIdx = (page - 1) * pageSize;
    const paginatedResources = resources.slice(startIdx, startIdx + pageSize);

    return { resources: paginatedResources, totalCount };
  }

  // SPACE OPTIMIZATION METHODS
  async fetchAllSpaces({ startDate, endDate, location, department, page = 1, pageSize = 10 }) {
    // Uncomment and use real API when ready
    // this.initialize();
    // const response = await this.apiClient.get('/spaces', { params: { startDate, endDate, location, department, page, pageSize } });
    // return response.data;

    let spaces = generateSpaceData();

    if (location) {
      spaces = spaces.filter(s => s.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (department) {
      spaces = spaces.filter(s => s.department_id.toLowerCase().includes(department.toLowerCase()));
    }

    const totalCount = spaces.length;
    const startIdx = (page - 1) * pageSize;
    const paginatedSpaces = spaces.slice(startIdx, startIdx + pageSize);

    return { spaces: paginatedSpaces, totalCount };
  }

  // VENDOR PERFORMANCE METHODS
  async fetchAllVendors({ startDate, endDate, serviceType, vendor, page = 1, pageSize = 10 }) {
    // Uncomment and use real API when ready
    // this.initialize();
    // const response = await this.apiClient.get('/vendors', { params: { startDate, endDate, serviceType, vendor, page, pageSize } });
    // return response.data;

    let vendors = generateVendorData();

    if (serviceType) {
      vendors = vendors.filter(v => v.service_type.toLowerCase().includes(serviceType.toLowerCase()));
    }
    if (vendor) {
      vendors = vendors.filter(v => v.vendor_name.toLowerCase().includes(vendor.toLowerCase()));
    }

    const totalCount = vendors.length;
    const startIdx = (page - 1) * pageSize;
    const paginatedVendors = vendors.slice(startIdx, startIdx + pageSize);

    return { vendors: paginatedVendors, totalCount };
  }

  // KPI METHODS
  async getResourceKPIs(filters) {
    const { resources } = await this.fetchAllResources({ ...filters, page: 1, pageSize: 1000 });

    const totalResources = resources.length;
    const activeResources = resources.filter(r => r.status === "Active").length;
    const avgUtilizationRate = resources.reduce((sum, r) => sum + r.utilization_rate, 0) / totalResources;
    const totalDowntimeHours = resources.reduce((sum, r) => sum + r.downtime_hours, 0);
    const totalMaintenanceCost = resources.reduce((sum, r) => sum + r.maintenance_cost, 0);
    const totalMonthlyCost = resources.reduce((sum, r) => sum + r.monthly_cost, 0);
    const avgEnergyConsumption = resources.reduce((sum, r) => sum + r.power_usage, 0) / totalResources;

    return {
      totalResources,
      activeResources,
      inactiveResources: totalResources - activeResources,
      avgUtilizationRate: Math.round(avgUtilizationRate * 100) / 100,
      totalDowntimeHours,
      totalMaintenanceCost,
      totalMonthlyCost,
      avgEnergyConsumption: Math.round(avgEnergyConsumption * 100) / 100,
      resourceTypes: [...new Set(resources.map(r => r.resource_type))].length,
      departments: [...new Set(resources.map(r => r.department))].length
    };
  }

  async getSpaceKPIs(filters) {
    const { spaces } = await this.fetchAllSpaces({ ...filters, page: 1, pageSize: 1000 });

    const totalSpaces = spaces.length;
    const totalArea = spaces.reduce((sum, s) => sum + s.total_area, 0);
    const allocatedArea = spaces.reduce((sum, s) => sum + s.allocated_area, 0);
    const vacantArea = spaces.reduce((sum, s) => sum + s.vacant_area, 0);
    const avgOccupancyRate = spaces.reduce((sum, s) => sum + s.occupancy_rate, 0) / totalSpaces;
    const totalRentCost = spaces.reduce((sum, s) => sum + s.rent_cost, 0);
    const totalUtilitiesCost = spaces.reduce((sum, s) => sum + s.utilities_cost, 0);
    const avgCostPerSqm = spaces.reduce((sum, s) => sum + s.cost_per_sqm, 0) / totalSpaces;

    return {
      totalSpaces,
      totalArea,
      allocatedArea,
      vacantArea,
      spaceUtilizationRate: Math.round((allocatedArea / totalArea) * 100 * 100) / 100,
      avgOccupancyRate: Math.round(avgOccupancyRate * 100) / 100,
      totalRentCost,
      totalUtilitiesCost,
      totalSpaceCost: totalRentCost + totalUtilitiesCost,
      avgCostPerSqm: Math.round(avgCostPerSqm * 100) / 100,
      departments: [...new Set(spaces.map(s => s.department_id))].length
    };
  }

  async getVendorKPIs(filters) {
    const { vendors } = await this.fetchAllVendors({ ...filters, page: 1, pageSize: 1000 });

    const totalVendors = vendors.length;
    const onTimeDeliveries = vendors.filter(v => v.delay_days === 0).length;
    const onTimeDeliveryRate = (onTimeDeliveries / totalVendors) * 100;
    const avgServiceQuality = vendors.reduce((sum, v) => sum + v.service_quality_score, 0) / totalVendors;
    const totalBudgetedCost = vendors.reduce((sum, v) => sum + v.budgeted_cost, 0);
    const totalActualCost = vendors.reduce((sum, v) => sum + v.actual_cost, 0);
    const totalVariance = vendors.reduce((sum, v) => sum + v.variance, 0);
    const avgPaymentDays = vendors.reduce((sum, v) => sum + v.days_to_pay, 0) / totalVendors;
    const totalComplaints = vendors.reduce((sum, v) => sum + v.complaints_count, 0);
    const avgComplianceRate = vendors.reduce((sum, v) => sum + v.contract_compliance, 0) / totalVendors;

    return {
      totalVendors,
      activeVendors: totalVendors,
      onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 100) / 100,
      avgServiceQuality: Math.round(avgServiceQuality * 100) / 100,
      totalBudgetedCost,
      totalActualCost,
      totalVariance,
      costVariancePercentage: Math.round((totalVariance / totalBudgetedCost) * 100 * 100) / 100,
      avgPaymentDays: Math.round(avgPaymentDays * 100) / 100,
      totalComplaints,
      avgComplianceRate: Math.round(avgComplianceRate * 100) / 100,
      serviceTypes: [...new Set(vendors.map(v => v.service_type))].length
    };
  }

  // CHART DATA METHODS
  async getResourceChartData({ metric, groupBy, ...filters }) {
    const { resources } = await this.fetchAllResources({ ...filters, page: 1, pageSize: 1000 });

    const groups = {};
    resources.forEach((resource) => {
      const key = resource[groupBy] || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(resource);
    });

    const chartData = Object.entries(groups).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, r) => sum + (r[metric] || 0), 0) / items.length,
      count: items.length,
    }));

    return chartData;
  }

  async getSpaceChartData({ metric, groupBy, ...filters }) {
    const { spaces } = await this.fetchAllSpaces({ ...filters, page: 1, pageSize: 1000 });

    const groups = {};
    spaces.forEach((space) => {
      const key = space[groupBy] || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(space);
    });

    const chartData = Object.entries(groups).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, s) => sum + (s[metric] || 0), 0) / items.length,
      count: items.length,
    }));

    return chartData;
  }

  async getVendorChartData({ metric, groupBy, ...filters }) {
    const { vendors } = await this.fetchAllVendors({ ...filters, page: 1, pageSize: 1000 });

    const groups = {};
    vendors.forEach((vendor) => {
      const key = vendor[groupBy] || "Unknown";
      if (!groups[key]) groups[key] = [];
      groups[key].push(vendor);
    });

    const chartData = Object.entries(groups).map(([key, items]) => ({
      label: key,
      value: items.reduce((sum, v) => sum + (v[metric] || 0), 0) / items.length,
      count: items.length,
    }));

    return chartData;
  }

  // DROPDOWN FILTER METHODS
  async getDepartments() {
    const resources = generateResourceData();
    return [...new Set(resources.map(r => r.department))];
  }

  async getResourceTypes() {
    const resources = generateResourceData();
    return [...new Set(resources.map(r => r.resource_type))];
  }

  async getLocations() {
    const spaces = generateSpaceData();
    return [...new Set(spaces.map(s => s.location))];
  }

  async getServiceTypes() {
    const vendors = generateVendorData();
    return [...new Set(vendors.map(v => v.service_type))];
  }

  async getVendorNames() {
    const vendors = generateVendorData();
    return [...new Set(vendors.map(v => v.vendor_name))];
  }
}

export default new rvsAnalyticsService();