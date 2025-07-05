import { computeHealth } from "../../departments/it/systemHealth/service.js";
import { describe, it, expect } from "@jest/globals";

describe("computeHealth", () => {
  it("returns 100% for all operational systems", () => {
    const input = [
      { name: "A", status: "operational" },
      { name: "B", status: "operational" },
    ];
    const result = computeHealth(input);
    expect(result.healthPercentage).toBe(100);
    expect(result.operationalSystems).toBe(2);
    expect(result.offlineSystems).toBe(0);
  });

  it("returns 0% for all offline systems", () => {
    const input = [
      { name: "A", status: "offline" },
      { name: "B", status: "offline" },
    ];
    const result = computeHealth(input);
    expect(result.healthPercentage).toBe(0);
    expect(result.operationalSystems).toBe(0);
    expect(result.offlineSystems).toBe(2);
  });

  it("returns 50% for mixed systems", () => {
    const input = [
      { name: "A", status: "operational" },
      { name: "B", status: "offline" },
    ];
    const result = computeHealth(input);
    expect(result.healthPercentage).toBe(50);
    expect(result.operationalSystems).toBe(1);
    expect(result.offlineSystems).toBe(1);
  });

  it("returns 0% for empty system list", () => {
    const result = computeHealth([]);
    expect(result.healthPercentage).toBe(0);
    expect(result.totalSystems).toBe(0);
  });
});
