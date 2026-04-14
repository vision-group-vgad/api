import { getStorageUtilization } from "../../departments/it/storage-utilization-donutchart/storageService.js";
import { describe, it, expect } from "@jest/globals";

describe("getStorageUtilization service", () => {
  it("returns all disks when no label is given", () => {
    const result = getStorageUtilization();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("label");
    expect(result[0]).toHaveProperty("available");
  });

  it("filters data by label", () => {
    const result = getStorageUtilization("Disk A");
    expect(result.length).toBe(1);
    expect(result[0].label).toBe("Disk A");
  });

  it("returns correct calculation for used + available", () => {
    const [disk] = getStorageUtilization("Disk A");
    expect(disk.used + disk.available).toBe(disk.totalCapacity);
  });

  it("returns empty array for unknown label", () => {
    const result = getStorageUtilization("NonExistentDisk");
    expect(result).toEqual([]);
  });
});
