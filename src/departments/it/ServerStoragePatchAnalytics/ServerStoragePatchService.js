import axios from "axios";

// Simple in-memory cache for batch fetches
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Dummy data generators
const generateServerData = () => [
  { server_id: "srv001", hostname: "web01", cpu_usage: 62, memory_usage: 78, active_processes: 112, network_in: 120, network_out: 95, uptime_hours: 720 },
  { server_id: "srv002", hostname: "db01", cpu_usage: 45, memory_usage: 65, active_processes: 89, network_in: 80, network_out: 70, uptime_hours: 680 },
  { server_id: "srv003", hostname: "cache01", cpu_usage: 80, memory_usage: 90, active_processes: 130, network_in: 200, network_out: 180, uptime_hours: 800 },
  { server_id: "srv004", hostname: "app01", cpu_usage: 55, memory_usage: 60, active_processes: 100, network_in: 110, network_out: 105, uptime_hours: 500 },
  { server_id: "srv005", hostname: "web02", cpu_usage: 70, memory_usage: 82, active_processes: 120, network_in: 140, network_out: 100, uptime_hours: 900 },
  { server_id: "srv006", hostname: "db02", cpu_usage: 38, memory_usage: 55, active_processes: 75, network_in: 60, network_out: 50, uptime_hours: 400 },
  { server_id: "srv007", hostname: "backup01", cpu_usage: 25, memory_usage: 40, active_processes: 40, network_in: 30, network_out: 25, uptime_hours: 1200 },
  { server_id: "srv008", hostname: "dev01", cpu_usage: 65, memory_usage: 70, active_processes: 110, network_in: 100, network_out: 90, uptime_hours: 350 },
  { server_id: "srv009", hostname: "test01", cpu_usage: 50, memory_usage: 60, active_processes: 80, network_in: 75, network_out: 60, uptime_hours: 250 },
  { server_id: "srv010", hostname: "mail01", cpu_usage: 48, memory_usage: 68, active_processes: 95, network_in: 95, network_out: 85, uptime_hours: 600 },
  { server_id: "srv011", hostname: "web03", cpu_usage: 58, memory_usage: 74, active_processes: 105, network_in: 110, network_out: 90, uptime_hours: 650 },
  { server_id: "srv012", hostname: "db03", cpu_usage: 42, memory_usage: 60, active_processes: 80, network_in: 70, network_out: 65, uptime_hours: 480 },
  { server_id: "srv013", hostname: "cache02", cpu_usage: 77, memory_usage: 88, active_processes: 125, network_in: 190, network_out: 170, uptime_hours: 780 },
  { server_id: "srv014", hostname: "app02", cpu_usage: 60, memory_usage: 63, active_processes: 102, network_in: 115, network_out: 108, uptime_hours: 520 },
  { server_id: "srv015", hostname: "web04", cpu_usage: 73, memory_usage: 85, active_processes: 122, network_in: 145, network_out: 105, uptime_hours: 950 }
];

const generateStorageData = () => [
  { storage_id: "stg001", disk_name: "C:", capacity_total: 500, capacity_used: 420, capacity_free: 80, iops: 1500, growth_rate: 12, backup_status: "Success", backup_completion_rate: 98, threshold_alert: false },
  { storage_id: "stg002", disk_name: "D:", capacity_total: 1000, capacity_used: 700, capacity_free: 300, iops: 1200, growth_rate: 25, backup_status: "Warning", backup_completion_rate: 85, threshold_alert: true },
  { storage_id: "stg003", disk_name: "E:", capacity_total: 2000, capacity_used: 1500, capacity_free: 500, iops: 1800, growth_rate: 30, backup_status: "Success", backup_completion_rate: 99, threshold_alert: false },
  { storage_id: "stg004", disk_name: "/data", capacity_total: 3000, capacity_used: 2500, capacity_free: 500, iops: 2100, growth_rate: 40, backup_status: "Failed", backup_completion_rate: 60, threshold_alert: true },
  { storage_id: "stg005", disk_name: "/backup", capacity_total: 1500, capacity_used: 800, capacity_free: 700, iops: 900, growth_rate: 10, backup_status: "Success", backup_completion_rate: 95, threshold_alert: false },
  { storage_id: "stg006", disk_name: "/var", capacity_total: 800, capacity_used: 600, capacity_free: 200, iops: 1100, growth_rate: 15, backup_status: "Warning", backup_completion_rate: 80, threshold_alert: true },
  { storage_id: "stg007", disk_name: "/home", capacity_total: 1200, capacity_used: 900, capacity_free: 300, iops: 1000, growth_rate: 18, backup_status: "Success", backup_completion_rate: 97, threshold_alert: false },
  { storage_id: "stg008", disk_name: "/mnt/storage", capacity_total: 4000, capacity_used: 3500, capacity_free: 500, iops: 2500, growth_rate: 50, backup_status: "Failed", backup_completion_rate: 55, threshold_alert: true },
  { storage_id: "stg009", disk_name: "F:", capacity_total: 600, capacity_used: 400, capacity_free: 200, iops: 800, growth_rate: 8, backup_status: "Success", backup_completion_rate: 92, threshold_alert: false },
  { storage_id: "stg010", disk_name: "G:", capacity_total: 750, capacity_used: 500, capacity_free: 250, iops: 950, growth_rate: 13, backup_status: "Warning", backup_completion_rate: 78, threshold_alert: true },
  { storage_id: "stg011", disk_name: "/srv", capacity_total: 1600, capacity_used: 1200, capacity_free: 400, iops: 1300, growth_rate: 22, backup_status: "Success", backup_completion_rate: 96, threshold_alert: false },
  { storage_id: "stg012", disk_name: "/opt", capacity_total: 900, capacity_used: 700, capacity_free: 200, iops: 1050, growth_rate: 17, backup_status: "Warning", backup_completion_rate: 82, threshold_alert: true },
  { storage_id: "stg013", disk_name: "/logs", capacity_total: 2000, capacity_used: 1800, capacity_free: 200, iops: 2200, growth_rate: 35, backup_status: "Failed", backup_completion_rate: 65, threshold_alert: true },
  { storage_id: "stg014", disk_name: "/media", capacity_total: 3500, capacity_used: 3200, capacity_free: 300, iops: 2400, growth_rate: 45, backup_status: "Success", backup_completion_rate: 94, threshold_alert: false },
  { storage_id: "stg015", disk_name: "/tmp", capacity_total: 500, capacity_used: 350, capacity_free: 150, iops: 700, growth_rate: 9, backup_status: "Success", backup_completion_rate: 99, threshold_alert: false }
];

const generatePatchComplianceData = () => [
  { server_id: "srv001", os_version: "Ubuntu 22.04", last_patch_date: "2025-08-01", pending_patches: 2, compliance_score: 95, vulnerability_count: 1, patch_age_days: 21, critical_issues: 0, high_issues: 1, medium_issues: 2 },
  { server_id: "srv002", os_version: "Windows Server 2022", last_patch_date: "2025-07-28", pending_patches: 5, compliance_score: 80, vulnerability_count: 3, patch_age_days: 30, critical_issues: 1, high_issues: 1, medium_issues: 1 },
  { server_id: "srv003", os_version: "CentOS 8", last_patch_date: "2025-08-10", pending_patches: 0, compliance_score: 100, vulnerability_count: 0, patch_age_days: 10, critical_issues: 0, high_issues: 0, medium_issues: 0 },
  { server_id: "srv004", os_version: "Ubuntu 20.04", last_patch_date: "2025-07-20", pending_patches: 4, compliance_score: 85, vulnerability_count: 2, patch_age_days: 35, critical_issues: 0, high_issues: 2, medium_issues: 1 },
  { server_id: "srv005", os_version: "Windows Server 2019", last_patch_date: "2025-08-05", pending_patches: 1, compliance_score: 92, vulnerability_count: 1, patch_age_days: 15, critical_issues: 0, high_issues: 1, medium_issues: 0 },
  { server_id: "srv006", os_version: "Red Hat Enterprise Linux 9", last_patch_date: "2025-07-30", pending_patches: 3, compliance_score: 88, vulnerability_count: 2, patch_age_days: 25, critical_issues: 1, high_issues: 0, medium_issues: 1 },
  { server_id: "srv007", os_version: "Debian 11", last_patch_date: "2025-08-12", pending_patches: 0, compliance_score: 100, vulnerability_count: 0, patch_age_days: 8, critical_issues: 0, high_issues: 0, medium_issues: 0 },
  { server_id: "srv008", os_version: "CentOS 7", last_patch_date: "2025-07-18", pending_patches: 6, compliance_score: 75, vulnerability_count: 4, patch_age_days: 37, critical_issues: 1, high_issues: 2, medium_issues: 1 },
  { server_id: "srv009", os_version: "Windows Server 2016", last_patch_date: "2025-08-08", pending_patches: 2, compliance_score: 90, vulnerability_count: 1, patch_age_days: 12, critical_issues: 0, high_issues: 1, medium_issues: 1 },
  { server_id: "srv010", os_version: "Ubuntu 18.04", last_patch_date: "2025-07-25", pending_patches: 3, compliance_score: 82, vulnerability_count: 2, patch_age_days: 28, critical_issues: 0, high_issues: 1, medium_issues: 2 }
];

class ServerStoragePatchService {
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
    console.log("🔧 [IT Service] ServerStoragePatchService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 [IT Service] Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 [IT Service] Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [IT Service] IT API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // --- SERVER LOAD ---
  async fetchAllServers({ hostname, page = 1, pageSize = 10 }) {
    this.initialize();
    const cacheKey = `servers_${hostname || "all"}_${page}_${pageSize}`;
    if (cache.has(cacheKey)) {
      const { data, totalCount, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return { servers: data, totalCount };
    }
    let servers = generateServerData();
    if (hostname) servers = servers.filter(s => s.hostname === hostname);

    const totalCount = servers.length;
    const startIdx = (page - 1) * pageSize;
    const paged = servers.slice(startIdx, startIdx + pageSize);

    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { servers: paged, totalCount };
  }

  async getServerLoadKPIs(filters = {}) {
    this.initialize();
    const { servers } = await this.fetchAllServers({ ...filters, page: 1, pageSize: 1000 });
    const avgCpu = +(servers.reduce((a, b) => a + b.cpu_usage, 0) / servers.length || 0).toFixed(2);
    const peakCpu = servers.length ? Math.max(...servers.map(s => s.cpu_usage)) : 0;
    const avgMem = +(servers.reduce((a, b) => a + b.memory_usage, 0) / servers.length || 0).toFixed(2);
    const avgProcesses = +(servers.reduce((a, b) => a + b.active_processes, 0) / servers.length || 0).toFixed(2);
    const avgNetworkIn = +(servers.reduce((a, b) => a + b.network_in, 0) / servers.length || 0).toFixed(2);
    const avgNetworkOut = +(servers.reduce((a, b) => a + b.network_out, 0) / servers.length || 0).toFixed(2);
    const avgUptime = +(servers.reduce((a, b) => a + b.uptime_hours, 0) / servers.length || 0).toFixed(2);

    return {
      avgCpu, peakCpu, avgMem, avgProcesses,
      avgNetworkIn, avgNetworkOut, avgUptime,
      serverCount: servers.length
    };
  }

  // --- STORAGE UTILIZATION ---
  async fetchAllStorages({ diskName, page = 1, pageSize = 10 }) {
    this.initialize();
    const cacheKey = `storages_${diskName || "all"}_${page}_${pageSize}`;
    if (cache.has(cacheKey)) {
      const { data, totalCount, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return { storages: data, totalCount };
    }
    let storages = generateStorageData();
    if (diskName) storages = storages.filter(s => s.disk_name === diskName);

    const totalCount = storages.length;
    const startIdx = (page - 1) * pageSize;
    const paged = storages.slice(startIdx, startIdx + pageSize);

    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { storages: paged, totalCount };
  }

  async getStorageKPIs(filters = {}) {
    this.initialize();
    const { storages } = await this.fetchAllStorages({ ...filters, page: 1, pageSize: 1000 });
    const totalCapacity = storages.reduce((a, b) => a + b.capacity_total, 0);
    const usedCapacity = storages.reduce((a, b) => a + b.capacity_used, 0);
    const freeCapacity = storages.reduce((a, b) => a + b.capacity_free, 0);
    const avgIOPS = +(storages.reduce((a, b) => a + b.iops, 0) / storages.length || 0).toFixed(2);
    const avgGrowthRate = +(storages.reduce((a, b) => a + b.growth_rate, 0) / storages.length || 0).toFixed(2);
    const avgBackupCompletion = +(storages.reduce((a, b) => a + b.backup_completion_rate, 0) / storages.length || 0).toFixed(2);
    const thresholdAlerts = storages.filter(s => s.threshold_alert).length;

    return {
      totalCapacity, usedCapacity, freeCapacity,
      avgIOPS, avgGrowthRate, avgBackupCompletion,
      thresholdAlerts, storageCount: storages.length
    };
  }

  // --- PATCH COMPLIANCE ---
  async fetchAllPatchCompliance({ osVersion, page = 1, pageSize = 10 }) {
    this.initialize();
    const cacheKey = `patchComp_${osVersion || "all"}_${page}_${pageSize}`;
    if (cache.has(cacheKey)) {
      const { data, totalCount, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return { patchCompliance: data, totalCount };
    }
    let patchCompliance = generatePatchComplianceData();
    if (osVersion) patchCompliance = patchCompliance.filter(s => s.os_version === osVersion);

    const totalCount = patchCompliance.length;
    const startIdx = (page - 1) * pageSize;
    const paged = patchCompliance.slice(startIdx, startIdx + pageSize);

    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { patchCompliance: paged, totalCount };
  }

  async getPatchComplianceKPIs(filters = {}) {
    this.initialize();
    const { patchCompliance } = await this.fetchAllPatchCompliance({ ...filters, page: 1, pageSize: 1000 });
    const avgCompliance = +(patchCompliance.reduce((a, b) => a + b.compliance_score, 0) / patchCompliance.length || 0).toFixed(2);
    const avgPatchAge = +(patchCompliance.reduce((a, b) => a + b.patch_age_days, 0) / patchCompliance.length || 0).toFixed(2);
    const pendingUpdates = patchCompliance.reduce((a, b) => a + b.pending_patches, 0);
    const totalCritical = patchCompliance.reduce((a, b) => a + b.critical_issues, 0);
    const totalHigh = patchCompliance.reduce((a, b) => a + b.high_issues, 0);
    const totalMedium = patchCompliance.reduce((a, b) => a + b.medium_issues, 0);

    return {
      avgCompliance, avgPatchAge, pendingUpdates,
      totalCritical, totalHigh, totalMedium,
      serverCount: patchCompliance.length
    };
  }
}

export default new ServerStoragePatchService();