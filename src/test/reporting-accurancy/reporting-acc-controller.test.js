import ReportingAccController from "../../departments/finance/reporting-acc-pie-chart/ReportingAccController.js";
import { describe, beforeEach, test, expect, jest } from "@jest/globals";

describe("ReportingAccController", () => {
  let controller;

  beforeEach(() => {
    controller = new ReportingAccController();
  });

  test("Computes totals and degrees correctly", async () => {
    const mockReports = [
      {
        report_category: "Test Reports",
        no_of_reports: 10,
        no_of_modified_reports: 4,
      },
      {
        report_category: "Demo Reports",
        no_of_reports: 20,
        no_of_modified_reports: 6,
      },
    ];

    jest.spyOn(controller, "_fetchData").mockImplementation(async () => {
      controller.reports = mockReports;
    });

    const reports = await controller.getReports();

    expect(controller.totalReports).toBe(30);
    expect(controller.totalModifiedReports).toBe(10);
    expect(reports).toEqual([
      {
        report_category: "Test Reports",
        no_of_reports: 10,
        no_of_modified_reports: 4,
        degree_of_modification: 144,
      },
      {
        report_category: "Demo Reports",
        no_of_reports: 20,
        no_of_modified_reports: 6,
        degree_of_modification: 216,
      },
    ]);
  });
});
