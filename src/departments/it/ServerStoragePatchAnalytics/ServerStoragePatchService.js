import IT from "../../../utils/common/IT.js";

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const it = new IT();

async function fetchLive(endpoint, fallback) {
  try {
    const data = await it.fetchLiveData(endpoint);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn(`[ServerStoragePatch] Live fetch failed [${endpoint}]:`, err.message);
  }
  return fallback();
}

const generateServerData = () => [
  { server_id: "srv001", hostname: "web01", cpu_usage: 62, memory_usage: 78, active_processes: 112, network_in: 120, network_out: 95, uptime_hours: 720 },
  { server_id: "srv002", hostname: "db01", cpu_usage: 45, memory_usage: 65, active_processes: 89, network_in: 80, network_out: 70, uptime_hours: 680 },
  { server_id: "srv003", hostname: "cache01", cpu_usage: 80, memory_usage: 90, active_processes: 130, network_in: 200, network_out: 180, uptime_hours: 800 },
  { server_id: "srv004", hostname: "app01", cpu_usage: 55, memory_usage: 60, active_processes: 100, network_in: 110, network_out: 105, uptime_hours: 500 },
  { server_id: "srv005", hostname: "web02", cpu_usage: 70, memory_usage: 82, active_processes: 120, network_in: 140, network_out: 100, uptime_hours: 900 },
];

const generateStorageData = () => [
  { storage_id: "stg001", disk_name: "C:", capacity_total: 500, capacity_used: 420, capacity_free: 80, iops: 1500, growth_rate: 12, backup_status: "Success", backup_completion_rate: 98, threshold_alert: false },
  { storage_id: "stg002", disk_name: "D:", capacity_total: 1000, capacity_used: 700, capacity_free: 300, iops: 1200, growth_rate: 25, backup_status: "Warning", backup_completion_rate: 85, threshold_alert: true },
];

const generatePatchData = () => [
  { server_id: "srv001", os_version: "Ubuntu 22.04", last_patch_date: "2025-08-01", pending_patches: 2, compliance_score: 95, vulnerability_count: 1, patch_age_days: 21, critical_issues: 0, high_issues: 1, medium_issues: 2 },
  { server_id: "srv002", os_version: "Windows Server 2022", last_patch_date: "2025-07-28", pending_patches: 5, compliance_score: 80, vulnerability_count: 3, patch_age_days: 30, critical_issues: 1, high_issues: 1, medium_issues: 1 },
];

class ServerStoragePatchService {
  async fetchAllServers({ hostname, page = 1, pageSize = 10 } = {}) {
    const cacheKey = `servers_${hostname || "all"}_${page}_${pageSize}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { servers: cached.data, totalCount: cached.totalCount };
    }
    let allServers = await fetchLive('/it/server-infrastructure', generateServerData);
    if (hostname) allServers = allServers.filter(s => s.hostname === hostname || s.serverName?.toLowerCase().includes(hostname.toLowerCase()));
    const totalCount = allServers.length;
    const paged = allServers.slice((page - 1) * pageSize, page * pageSize);
    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { servers: paged, totalCount };
  }

  async getServerLoadKPIs(filters = {}) {
    const { servers } = await this.fetchAllServers({ ...filters, page: 1, pageSize: 1000 });
    const avg = (key) => +(servers.reduce((a, b) => a + (b[key] || 0), 0) / (servers.length || 1)).toFixed(2);
    return {
      avgCpu: avg("cpu_usage"), peakCpu: servers.length ? Math.max(...servers.map(s => s.cpu_usage || 0)) : 0,
      avgMem: avg("memory_usage"), avgProcesses: avg("active_processes"),
      avgNetworkIn: avg("network_in"), avgNetworkOut: avg("network_out"),
      avgUptime: avg("uptime_hours"), serverCount: servers.length,
    };
  }

  async fetchAllStorages({ diskName, page = 1, pageSize = 10 } = {}) {
    const cacheKey = `storages_${diskName || "all"}_${page}_${pageSize}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { storages: cached.data, totalCount: cached.totalCount };
    }
    let allStorages = await fetchLive('/it/storage-utilization', generateStorageData);
    if (diskName) allStorages = allStorages.filter(s => s.disk_name === diskName);
    const totalCount = allStorages.length;
    const paged = allStorages.slice((page - 1) * pageSize, page * pageSize);
    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { storages: paged, totalCount };
  }

  async getStorageKPIs(filters = {}) {
    const { storages } = await this.fetchAllStorages({ ...filters, page: 1, pageSize: 1000 });
    const sum = (key) => storages.reduce((a, b) => a + (b[key] || 0), 0);
    const avg = (key) => +(sum(key) / (storages.length || 1)).toFixed(2);
    return {
      totalCapacity: sum("capacity_total"), usedCapacity: sum("capacity_used"),
      freeCapacity: sum("capacity_free"), avgIOPS: avg("iops"),
      avgGrowthRate: avg("growth_rate"), avgBackupCompletion: avg("backup_completion_rate"),
      thresholdAlerts: storages.filter(s => s.threshold_alert).length,
      storageCount: storages.length,
    };
  }

  async fetchAllPatchCompliance({ osVersion, page = 1, pageSize = 10 } = {}) {
    const cacheKey = `patchComp_${osVersion || "all"}_${page}_${pageSize}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return { patchCompliance: cached.data, totalCount: cached.totalCount };
    }
    let allPatch = await fetchLive('/it/patch-compliance', generatePatchData);
    if (osVersion) allPatch = allPatch.filter(s => s.os_version === osVersion);
    const totalCount = allPatch.length;
    const paged = allPatch.slice((page - 1) * pageSize, page * pageSize);
    cache.set(cacheKey, { data: paged, totalCount, timestamp: Date.now() });
    return { patchCompliance: paged, totalCount };
  }

  async getPatchComplianceKPIs(filters = {}) {
    const { patchCompliance } = await this.fetchAllPatchCompliance({ ...filters, page: 1, pageSize: 1000 });
    const avg = (key) => +(patchCompliance.reduce((a, b) => a + (b[key] || 0), 0) / (patchCompliance.length || 1)).toFixed(2);
    const sum = (key) => patchCompliance.reduce((a, b) => a + (b[key] || 0), 0);
    return {
      avgCompliance: avg("compliance_score"), avgPatchAge: avg("patch_age_days"),
      pendingUpdates: sum("pending_patches"), totalCritical: sum("critical_issues"),
      totalHigh: sum("high_issues"), totalMedium: sum("medium_issues"),
      serverCount: patchCompliance.length,
    };
  }
}

export default new ServerStoragePatchService();
