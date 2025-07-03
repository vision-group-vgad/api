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
    { name: "Server A", capacity: 1000, free_space: 400 },
    { name: "Server B", capacity: 2000, free_space: 1500 },
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

    const result = await serverController.getAllServers();

    expect(getSpy).toHaveBeenCalled();
    expect(result).toEqual(mockServersData);
  });

  test("#filterServers should populate servers array with Server instances", async () => {
    jest
      .spyOn(serverController, "getAllServers")
      .mockResolvedValue(mockServersData);

    await serverController.getComputedStorages();

    expect(serverController.servers.length).toBe(2);
    serverController.servers.forEach((server, idx) => {
      expect(server).toBeInstanceOf(Server);
      expect(server.getServerName()).toBe(mockServersData[idx].name);
      expect(server.getTotalCapacity()).toBe(mockServersData[idx].capacity);
      expect(server.getFreeSpace()).toBe(mockServersData[idx].free_space);
    });
  });

  test("getComputedStorages calculates usedStorPercentage and usedStorDegrees correctly", async () => {
    jest
      .spyOn(serverController, "getAllServers")
      .mockResolvedValue(mockServersData);

    const results = await serverController.getComputedStorages();

    expect(results.length).toBe(2);

    const used0 = 1000 - 400;
    const used1 = 2000 - 1500;

    expect(results[0].usedStorPercentage).toBe(
      Math.round((used0 * 100) / 1000)
    );
    expect(results[0].usedStorDegrees).toBe(Math.round((used0 * 360) / 1000));

    expect(results[1].usedStorPercentage).toBe(
      Math.round((used1 * 100) / 2000)
    );
    expect(results[1].usedStorDegrees).toBe(Math.round((used1 * 360) / 2000));
  });
});
