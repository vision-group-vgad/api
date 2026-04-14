import ServerController from "../../departments/it/server-load-piechart/ServerController.js";
import Server from "../../departments/it/server-load-piechart/Server.js";
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  test,
  expect,
} from "@jest/globals";

describe("ServerController", () => {
  let serverController;

  const mockServersData = [
    {
      name: "Server A",
      capacity: 1000,
      free_space: 400,
      cpu: 45,
      memory_total: 32,
      memory_used: 18,
      net_in: 10.5,
      net_out: 7.8,
    },
    {
      name: "Server B",
      capacity: 2000,
      free_space: 1500,
      cpu: 30,
      memory_total: 16,
      memory_used: 10,
      net_in: 8.2,
      net_out: 4.5,
    },
  ];

  beforeEach(() => {
    serverController = new ServerController();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getAllServers should return mock data", async () => {
    const getSpy = jest
      .spyOn(serverController, "getAllServers")
      .mockResolvedValue(mockServersData);

    const result = await serverController.getAllServers("7d");

    expect(getSpy).toHaveBeenCalled();
    expect(result).toEqual(mockServersData);
  });

  test("#filterServers should populate servers array with Server instances", async () => {
    jest
      .spyOn(serverController, "getAllServers")
      .mockResolvedValue(mockServersData);

    await serverController.getComputedServerStats("7d");

    expect(serverController.servers.length).toBe(2);
    serverController.servers.forEach((server, idx) => {
      expect(server).toBeInstanceOf(Server);
      expect(server.getServerName()).toBe(mockServersData[idx].name);
      expect(server.getTotalCapacity()).toBe(mockServersData[idx].capacity);
      expect(server.getFreeSpace()).toBe(mockServersData[idx].free_space);
      expect(server.getCpuLoad()).toBe(mockServersData[idx].cpu);
      expect(server.getTotalMemory()).toBe(mockServersData[idx].memory_total);
      expect(server.getUsedMemory()).toBe(mockServersData[idx].memory_used);
      expect(server.getNetworkIn()).toBe(mockServersData[idx].net_in);
      expect(server.getNetworkOut()).toBe(mockServersData[idx].net_out);
    });
  });

  test("getComputedServerStats calculates storage, memory, cpu percentages and degrees correctly", async () => {
    jest
      .spyOn(serverController, "getAllServers")
      .mockResolvedValue(mockServersData);

    const results = await serverController.getComputedServerStats("7d");

    expect(results.length).toBe(2);

    const used0 = 1000 - 400;
    const used1 = 2000 - 1500;

    expect(results[0].storagePercentage).toBe(Math.round((used0 * 100) / 1000));
    expect(results[0].storageDegrees).toBe(Math.round((used0 * 360) / 1000));
    expect(results[0].storagePercentageLabel).toBe(
      `${Math.round((used0 * 100) / 1000)}%`
    );

    expect(results[1].storagePercentage).toBe(Math.round((used1 * 100) / 2000));
    expect(results[1].storageDegrees).toBe(Math.round((used1 * 360) / 2000));
    expect(results[1].storagePercentageLabel).toBe(
      `${Math.round((used1 * 100) / 2000)}%`
    );

    expect(results[0].memoryPercentage).toBe(
      Math.round(
        (mockServersData[0].memory_used * 100) / mockServersData[0].memory_total
      )
    );
    expect(results[0].memoryDegrees).toBe(
      Math.round(
        (mockServersData[0].memory_used * 360) / mockServersData[0].memory_total
      )
    );
    expect(results[0].memoryPercentageLabel).toBe(
      `${Math.round(
        (mockServersData[0].memory_used * 100) / mockServersData[0].memory_total
      )}%`
    );

    expect(results[1].memoryPercentage).toBe(
      Math.round(
        (mockServersData[1].memory_used * 100) / mockServersData[1].memory_total
      )
    );
    expect(results[1].memoryDegrees).toBe(
      Math.round(
        (mockServersData[1].memory_used * 360) / mockServersData[1].memory_total
      )
    );
    expect(results[1].memoryPercentageLabel).toBe(
      `${Math.round(
        (mockServersData[1].memory_used * 100) / mockServersData[1].memory_total
      )}%`
    );

    expect(results[0].cpuLoadPercentage).toBe(mockServersData[0].cpu);
    expect(results[0].cpuLoadDegrees).toBe(
      Math.round((mockServersData[0].cpu * 360) / 100)
    );
    expect(results[0].cpuLoadLabel).toBe(`${mockServersData[0].cpu}%`);

    expect(results[1].cpuLoadPercentage).toBe(mockServersData[1].cpu);
    expect(results[1].cpuLoadDegrees).toBe(
      Math.round((mockServersData[1].cpu * 360) / 100)
    );
    expect(results[1].cpuLoadLabel).toBe(`${mockServersData[1].cpu}%`);

    expect(results[0].networkIn).toBe(mockServersData[0].net_in);
    expect(results[0].networkInLabel).toBe(`${mockServersData[0].net_in} MB/s`);
    expect(results[0].networkOut).toBe(mockServersData[0].net_out);
    expect(results[0].networkOutLabel).toBe(
      `${mockServersData[0].net_out} MB/s`
    );

    expect(results[1].networkIn).toBe(mockServersData[1].net_in);
    expect(results[1].networkInLabel).toBe(`${mockServersData[1].net_in} MB/s`);
    expect(results[1].networkOut).toBe(mockServersData[1].net_out);
    expect(results[1].networkOutLabel).toBe(
      `${mockServersData[1].net_out} MB/s`
    );
  });
});
