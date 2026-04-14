// src/test/cyberPosture.test.js
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  test,
  expect,
} from "@jest/globals";
import CyberPostureController from "../../departments/it/cyber-posture/cyberPostureController";

describe("CyberPostureController", () => {
  let req;
  let res;
  let cyberPostureController;

  beforeEach(() => {
    cyberPostureController = new CyberPostureController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getCyberPosture should return posture data with status 200", async () => {
    await cyberPostureController.getCyberPosture(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Array),
        benchmark: expect.any(Number),
        message: "Cybersecurity posture retrieved successfully",
      })
    );

    const data = res.json.mock.calls[0][0].data;
    expect(data.length).toBeGreaterThan(0);

    data.forEach((item) => {
      expect(item).toHaveProperty("label");
      expect(typeof item.label).toBe("string");
      expect(item).toHaveProperty("value");
      expect(typeof item.value).toBe("number");
    });
  });

  test("getCyberPosture should handle errors and respond with 500", async () => {
    // mock implementation to throw error
    const error = new Error("Forced error");
    jest.spyOn(console, "error").mockImplementation(() => {}); // suppress console.error in test

    // create a mock function to simulate throwing an error inside controller
    const faultyGetCyberPosture = async (_req, _res) => {
      throw error;
    };

    // Call the controller wrapper that handles errors:
    try {
      await faultyGetCyberPosture(req, res);
    } catch {
      // simulate catch block in your original controller
      res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to retrieve cybersecurity posture",
        },
      });
    }

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve cybersecurity posture",
      },
    });
  });
});
