class Server {
  constructor(
    serverName,
    totalCapacity,
    freeSpace,
    cpuLoad,
    totalMemory,
    usedMemory,
    networkIn,
    networkOut
  ) {
    this.serverName = serverName;
    this.totalCapacity = totalCapacity;
    this.freeSpace = freeSpace;
    this.cpuLoad = cpuLoad;
    this.totalMemory = totalMemory;
    this.usedMemory = usedMemory;
    this.networkIn = networkIn;
    this.networkOut = networkOut;
  }

  getServerName() {
    return this.serverName;
  }

  setServerName(serverName) {
    this.serverName = serverName;
  }

  getTotalCapacity() {
    return this.totalCapacity;
  }

  setTotalCapacity(totalCapacity) {
    this.totalCapacity = totalCapacity;
  }

  getFreeSpace() {
    return this.freeSpace;
  }

  setFreeSpace(freeSpace) {
    this.freeSpace = freeSpace;
  }

  getCpuLoad() {
    return this.cpuLoad;
  }

  setCpuLoad(cpuLoad) {
    this.cpuLoad = cpuLoad;
  }

  getTotalMemory() {
    return this.totalMemory;
  }

  setTotalMemory(totalMemory) {
    this.totalMemory = totalMemory;
  }

  getUsedMemory() {
    return this.usedMemory;
  }

  setUsedMemory(usedMemory) {
    this.usedMemory = usedMemory;
  }

  getFreeMemory() {
    return this.totalMemory - this.usedMemory;
  }

  getNetworkIn() {
    return this.networkIn;
  }

  setNetworkIn(networkIn) {
    this.networkIn = networkIn;
  }

  getNetworkOut() {
    return this.networkOut;
  }

  setNetworkOut(networkOut) {
    this.networkOut = networkOut;
  }
}

export default Server;
