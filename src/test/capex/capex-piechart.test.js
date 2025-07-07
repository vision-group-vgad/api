import CapExPieChartController from "../../departments/finance/capex/CapExPieChartController.js";
import { describe, beforeEach, test, expect, jest } from "@jest/globals";

describe("CapExPieChartController", () => {
  let controller;

  beforeEach(() => {
    controller = new CapExPieChartController();
  });

  test("Computes total CAPEX and degrees correctly", async () => {
    const mockReports = [
      { category: "IT", amount: 10000 },
      { category: "Facilities", amount: 15000 },
      { category: "Power", amount: 5000 },
    ];

    jest.spyOn(controller, "_fetchData").mockImplementation(async () => {
      controller.reports = mockReports;
    });

    const reports = await controller.getCapExByCategory();

    expect(controller.totalCapEx).toBe(30000);
    expect(reports).toEqual([
      { category: "IT", amount: 10000, degree: 120 },
      { category: "Facilities", amount: 15000, degree: 180 },
      { category: "Power", amount: 5000, degree: 60 },
    ]);
  });
});
