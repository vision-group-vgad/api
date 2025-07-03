class Server {
  constructor(serverName, totalCapacity, freeSpace) {
    this.serverName = serverName;
    this.totalCapacity = totalCapacity;
    this.freeSpace = freeSpace;
  }

  getServerName() {
    return this.serverName;
  }

  setServerName(storageName) {
    this.serverName = storageName;
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

  setFreeSpace(usedCapacity) {
    this.freeSpace = usedCapacity;
  }
}

export default Server;
