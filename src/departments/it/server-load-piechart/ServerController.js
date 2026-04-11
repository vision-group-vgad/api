import Server from "./Server.js";
import IT from "../../../utils/common/IT.js";

const _it = new IT();
const dummyServers = [
  { name: "Server A", capacity: 1000, free_space: 300, cpu: 45, memory_total: 32, memory_used: 18, net_in: 10.5, net_out: 7.8 },
  { name: "Server B", capacity: 500, free_space: 200, cpu: 30, memory_total: 16, memory_used: 10, net_in: 8.2, net_out: 4.5 },
  { name: "Server C", capacity: 1200, free_space: 1000, cpu: 15, memory_total: 64, memory_used: 20, net_in: 3.5, net_out: 2.8 },
  { name: "Server D", capacity: 750, free_space: 150, cpu: 70, memory_total: 24, memory_used: 22, net_in: 11.1, net_out: 9.4 },
  { name: "Server E", capacity: 2000, free_space: 400, cpu: 55, memory_total: 128, memory_used: 90, net_in: 15.6, net_out: 13.7 },
  { name: "Server F", capacity: 3000, free_space: 2500, cpu: 25, memory_total: 64, memory_used: 20, net_in: 4.0, net_out: 3.0 },
  { name: "Server G", capacity: 1800, free_space: 900, cpu: 35, memory_total: 32, memory_used: 28, net_in: 5.2, net_out: 4.8 },
  { name: "Server H", capacity: 2200, free_space: 1200, cpu: 20, memory_total: 48, memory_used: 30, net_in: 6.9, net_out: 5.1 },
  { name: "Server I", capacity: 800, free_space: 100, cpu: 85, memory_total: 16, memory_used: 15, net_in: 12.0, net_out: 11.0 },
  { name: "Server J", capacity: 1600, free_space: 600, cpu: 40, memory_total: 32, memory_used: 25, net_in: 7.5, net_out: 6.2 },
];

class ServerController {
  constructor() {
    this.servers = [];
  }

  async getAllServers(duration) {
    try {
      const liveData = await _it.fetchLiveData('/it/server-infrastructure');
      if (Array.isArray(liveData) && liveData.length > 0) {
        return liveData.map(s => {
          const diskPct = s.diskUsagePercent || 0;
          const memPct  = s.memoryUsagePercent || s.memory_usage || 0;
          const capacity = s.capacity || s.storage_total || 1000;
          return {
            name: s.serverName || s.hostname || s.name || s.server_name || 'Server',
            capacity,
            free_space: s.free_space || s.storage_free || Math.round(capacity * (1 - diskPct / 100)),
            cpu: s.cpuUsagePercent || s.cpu_usage || s.cpu || 0,
            memory_total: s.memory_total || s.ram_total || 100,
            memory_used: s.memory_used || s.ram_used || Math.round((s.memory_total || 100) * memPct / 100),
            net_in:  s.networkTrafficMbps != null ? +(s.networkTrafficMbps / 2).toFixed(1) : (s.network_in || s.net_in || 0),
            net_out: s.networkTrafficMbps != null ? +(s.networkTrafficMbps / 2).toFixed(1) : (s.network_out || s.net_out || 0),
          };
        });
      }
    } catch (err) {
      console.warn('[ServerController] Live fetch failed, using dummy:', err.message);
    }
    return dummyServers;
  }

  async #filterServers(duration) {
    const data = await this.getAllServers(duration);
    this.servers = data.map((server) =>
      new Server(server.name, server.capacity, server.free_space, server.cpu, server.memory_total, server.memory_used, server.net_in, server.net_out)
    );
  }

  #calcPercentage(total, used) {
    return total === 0 ? 0 : Math.round((used * 100) / total);
  }

  #calcDegrees(total, used) {
    return total === 0 ? 0 : Math.round((used * 360) / total);
  }

  async getComputedServerStats(duration) {
    await this.#filterServers(duration);
    return this.servers.map((server) => {
      const usedStorage = server.getTotalCapacity() - server.getFreeSpace();
      const usedMemory = server.getUsedMemory();
      const totalMemory = server.getTotalMemory();
      const cpuLoad = server.getCpuLoad();
      return {
        name: server.getServerName(),
        totalStorage: server.getTotalCapacity(),
        freeStorage: server.getFreeSpace(),
        usedStorage,
        storagePercentage: this.#calcPercentage(server.getTotalCapacity(), usedStorage),
        storageDegrees: this.#calcDegrees(server.getTotalCapacity(), usedStorage),
        storagePercentageLabel: `${this.#calcPercentage(server.getTotalCapacity(), usedStorage)}%`,
        totalMemory,
        usedMemory,
        freeMemory: server.getFreeMemory(),
        memoryPercentage: this.#calcPercentage(totalMemory, usedMemory),
        memoryDegrees: this.#calcDegrees(totalMemory, usedMemory),
        memoryPercentageLabel: `${this.#calcPercentage(totalMemory, usedMemory)}%`,
        cpuLoadPercentage: cpuLoad,
        cpuLoadDegrees: this.#calcDegrees(100, cpuLoad),
        cpuLoadLabel: `${cpuLoad}%`,
        networkIn: server.getNetworkIn(),
        networkInLabel: `${server.getNetworkIn()} MB/s`,
        networkOut: server.getNetworkOut(),
        networkOutLabel: `${server.getNetworkOut()} MB/s`,
      };
    });
  }
}

export default ServerController;
