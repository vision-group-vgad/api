import Server from "./Server.js";
import axios from "axios";

class ServerController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.servers = [];
  }

  async getAllServers() {
    // let response = await axios.get(`${this.VISION_GROUP_CMS_ROOT_URL}/servers`);
    // Simulated API response
    let response = {
      data: [
        { name: "Server A", capacity: 1000, free_space: 300 },
        { name: "Server B", capacity: 500, free_space: 200 },
        { name: "Server C", capacity: 1200, free_space: 1000 },
        { name: "Server D", capacity: 750, free_space: 150 },
        { name: "Server E", capacity: 2000, free_space: 400 },
        { name: "Server F", capacity: 3000, free_space: 2500 },
        { name: "Server G", capacity: 1800, free_space: 900 },
        { name: "Server H", capacity: 2200, free_space: 1200 },
        { name: "Server I", capacity: 800, free_space: 100 },
        { name: "Server J", capacity: 1600, free_space: 600 },
      ],
    };
    return response.data;
  }

  async #filterServers() {
    const data = await this.getAllServers();

    this.servers = data.map((server) => {
      const instance = new Server();
      instance.setFreeSpace(server.free_space);
      instance.setServerName(server.name);
      instance.setTotalCapacity(server.capacity);
      return instance;
    });
  }

  #getStorageCapacityForAllServers() {
    return this.servers
      .map((s) => s.totalCapacity)
      .reduce((acc, curr) => acc + curr, 0);
  }

  #calUsedStorPercent(totalCapacity, usedCapacity) {
    return Math.round((usedCapacity * 100) / totalCapacity);
  }

  #calUsedStorDegrees(totalCapacity, usedCapacity) {
    return Math.round((usedCapacity * 360) / totalCapacity);
  }

  async getComputedStorages() {
    await this.#filterServers();

    return this.servers.map((serverStorage) => {
      const used =
        serverStorage.getTotalCapacity() - serverStorage.getFreeSpace();
      const percentage = this.#calUsedStorPercent(
        serverStorage.getTotalCapacity(),
        used
      );
      const degrees = this.#calUsedStorDegrees(
        serverStorage.getTotalCapacity(),
        used
      );

      serverStorage.usedStorPercentage = percentage;
      serverStorage.usedStorDegrees = degrees;
      return serverStorage;
    });
  }
}

export default ServerController;
