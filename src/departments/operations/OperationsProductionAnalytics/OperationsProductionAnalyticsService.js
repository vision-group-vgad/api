import axios from "axios";

// --- Dummy Data Generators ---
const operators = ["John Doe", "Jane Smith", "Paul Okello", "Grace Nanyonga", "Sam Mugisha"];
const machines = [
  { machine_id: "M-01", machine_name: "Cutter" },
  { machine_id: "M-02", machine_name: "Assembler" },
  { machine_id: "M-03", machine_name: "Printer" },
  { machine_id: "M-04", machine_name: "Camera" },
  { machine_id: "M-05", machine_name: "Finisher" }
];
const shifts = ["Day", "Night"];
const wasteReasons = ["Spillage", "Defect", "Machine Malfunction", "Setup Loss", "Overproduction"];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (month, year) => {
  const day = rand(1, 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const generateProductionYieldData = () => {
  let batches = [];
  for (let i = 0; i < 30; i++) {
    const machine = machines[rand(0, machines.length - 1)];
    const shift = shifts[rand(0, 1)];
    const operator = operators[rand(0, operators.length - 1)];
    const planned = rand(4000, 7000);
    const actual = planned - rand(0, 300);
    const defective = rand(0, 200);
    batches.push({
      batch_id: `B${1001 + i}`,
      production_date: randomDate(8, 2025),
      shift,
      machine_id: machine.machine_id,
      planned_units: planned,
      actual_units_produced: actual,
      defective_units: defective,
      operator
    });
  }
  return batches;
};

const generateMachineOEEData = () => {
  let data = [];
  for (let i = 0; i < machines.length; i++) {
    const m = machines[i];
    const planned_runtime = 480;
    const downtime = rand(10, 60);
    const actual_runtime = planned_runtime - downtime;
    const ideal_cycle_time = Math.round((0.4 + Math.random() * 0.3) * 100) / 100; // 0.4 - 0.7
    const total_units = rand(600, 1200);
    const good_units = total_units - rand(0, 50);
    data.push({
      machine_id: m.machine_id,
      machine_name: m.machine_name,
      planned_runtime,
      actual_runtime,
      downtime,
      ideal_cycle_time,
      total_units_produced: total_units,
      good_units
    });
  }
  return data;
};

const generateMaterialWasteData = () => {
  let wastes = [];
  for (let i = 0; i < 25; i++) {
    const batch_id = `B${1001 + rand(0, 29)}`;
    const material_id = `MAT-${String(rand(1, 5)).padStart(2, "0")}`;
    const material_name = ["Steel Sheets", "Plastic Resin", "Ink", "Paper Rolls", "Adhesive"][rand(0, 4)];
    const issued = rand(500, 2000);
    const used = issued - rand(10, 100);
    const waste = issued - used;
    const waste_reason = wasteReasons[rand(0, wasteReasons.length - 1)];
    const cost_per_kg = Math.round((2 + Math.random() * 8) * 100) / 100;
    wastes.push({
      batch_id,
      material_id,
      material_name,
      material_issued_kg: issued,
      material_used_kg: used,
      waste_kg: waste,
      waste_reason,
      cost_per_kg
    });
  }
  return wastes;
};

class OperationsProductionAnalyticsService {
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
    console.log("🔧 [Production Service] OperationsProductionAnalyticsService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 [Production Service] Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 [Production Service] Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [Production Service] API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // --- Production Yield ---
  async fetchProductionYield(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/production-yield', { params: filters });
    // return response.data;

    let batches = generateProductionYieldData();
    const { date, shift, machine, operator, page = 1, pageSize = 10 } = filters;
    if (date) batches = batches.filter(b => b.production_date === date);
    if (shift) batches = batches.filter(b => b.shift === shift);
    if (machine) batches = batches.filter(b => b.machine_id === machine);
    if (operator) batches = batches.filter(b => b.operator === operator);

    const totalCount = batches.length;
    const startIdx = (page - 1) * pageSize;
    const paged = batches.slice(startIdx, startIdx + pageSize);

    return { batches: paged, totalCount };
  }

  async getProductionYieldKPIs(filters = {}) {
    let batches = generateProductionYieldData();
    const { date, shift, machine, operator } = filters;
    if (date) batches = batches.filter(b => b.production_date === date);
    if (shift) batches = batches.filter(b => b.shift === shift);
    if (machine) batches = batches.filter(b => b.machine_id === machine);
    if (operator) batches = batches.filter(b => b.operator === operator);

    const totalPlanned = batches.reduce((sum, b) => sum + b.planned_units, 0);
    const totalActual = batches.reduce((sum, b) => sum + b.actual_units_produced, 0);
    const totalDefective = batches.reduce((sum, b) => sum + b.defective_units, 0);
    const yieldPercent = totalPlanned ? Math.round(((totalActual - totalDefective) / totalPlanned) * 10000) / 100 : 0;

    // Yield per machine/shift/operator
    const byMachine = {};
    batches.forEach(b => {
      if (!byMachine[b.machine_id]) byMachine[b.machine_id] = { planned: 0, actual: 0, defective: 0 };
      byMachine[b.machine_id].planned += b.planned_units;
      byMachine[b.machine_id].actual += b.actual_units_produced;
      byMachine[b.machine_id].defective += b.defective_units;
    });
    const yieldPerMachine = Object.entries(byMachine).map(([machine_id, v]) => ({
      machine_id,
      yield: v.planned ? Math.round(((v.actual - v.defective) / v.planned) * 10000) / 100 : 0
    }));

    return {
      yieldPercent,
      totalPlanned,
      totalActual,
      totalDefective,
      yieldPerMachine
    };
  }

  // --- Machine OEE ---
  async fetchMachineOEE(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/machine-oee', { params: filters });
    // return response.data;

    let machinesData = generateMachineOEEData();
    const { machine, line, shift, date, page = 1, pageSize = 10 } = filters;
    if (machine) machinesData = machinesData.filter(m => m.machine_id === machine);

    const totalCount = machinesData.length;
    const startIdx = (page - 1) * pageSize;
    const paged = machinesData.slice(startIdx, startIdx + pageSize);

    return { machines: paged, totalCount };
  }

  async getMachineOEEKPIs(filters = {}) {
    let machinesData = generateMachineOEEData();
    const { machine } = filters;
    if (machine) machinesData = machinesData.filter(m => m.machine_id === machine);

    // OEE calculations
    const oeeList = machinesData.map(m => {
      const availability = m.planned_runtime ? (m.planned_runtime - m.downtime) / m.planned_runtime : 0;
      const performance = m.actual_runtime ? (m.ideal_cycle_time * m.total_units_produced) / m.actual_runtime : 0;
      const quality = m.total_units_produced ? m.good_units / m.total_units_produced : 0;
      const oee = availability * performance * quality;
      return {
        machine_id: m.machine_id,
        machine_name: m.machine_name,
        availability: Math.round(availability * 10000) / 100,
        performance: Math.round(performance * 10000) / 100,
        quality: Math.round(quality * 10000) / 100,
        oee: Math.round(oee * 10000) / 100
      };
    });

    // OEE average and benchmark
    const avgOEE = oeeList.length ? Math.round(oeeList.reduce((sum, m) => sum + m.oee, 0) / oeeList.length * 100) / 100 : 0;
    const worldClassOEE = 85;

    return {
      oeeList,
      avgOEE,
      worldClassOEE
    };
  }

  // --- Material Waste Analysis ---
  async fetchMaterialWaste(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/material-waste', { params: filters });
    // return response.data;

    let wastes = generateMaterialWasteData();
    const { date, material, machine, waste_reason, page = 1, pageSize = 10 } = filters;
    if (material) wastes = wastes.filter(w => w.material_name === material);
    if (waste_reason) wastes = wastes.filter(w => w.waste_reason === waste_reason);

    const totalCount = wastes.length;
    const startIdx = (page - 1) * pageSize;
    const paged = wastes.slice(startIdx, startIdx + pageSize);

    return { wastes: paged, totalCount };
  }

  async getMaterialWasteKPIs(filters = {}) {
    let wastes = generateMaterialWasteData();
    const { material, waste_reason } = filters;
    if (material) wastes = wastes.filter(w => w.material_name === material);
    if (waste_reason) wastes = wastes.filter(w => w.waste_reason === waste_reason);

    const totalWasteKg = wastes.reduce((sum, w) => sum + w.waste_kg, 0);
    const totalIssued = wastes.reduce((sum, w) => sum + w.material_issued_kg, 0);
    const totalWasteCost = wastes.reduce((sum, w) => sum + w.waste_kg * w.cost_per_kg, 0);
    const wastePercent = totalIssued ? Math.round((totalWasteKg / totalIssued) * 10000) / 100 : 0;

    // Waste by reason (Pareto)
    const byReason = {};
    wastes.forEach(w => {
      if (!byReason[w.waste_reason]) byReason[w.waste_reason] = { waste_kg: 0, waste_cost: 0 };
      byReason[w.waste_reason].waste_kg += w.waste_kg;
      byReason[w.waste_reason].waste_cost += w.waste_kg * w.cost_per_kg;
    });
    const wasteByReason = Object.entries(byReason).map(([reason, v]) => ({
      reason,
      waste_kg: v.waste_kg,
      waste_cost: Math.round(v.waste_cost * 100) / 100
    })).sort((a, b) => b.waste_kg - a.waste_kg);

    return {
      totalWasteKg,
      totalWasteCost: Math.round(totalWasteCost * 100) / 100,
      wastePercent,
      wasteByReason
    };
  }
}

export default new OperationsProductionAnalyticsService();