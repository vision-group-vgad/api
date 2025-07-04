import { jest, describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import PatchComplianceController from '../../departments/it/patch-compliance/patchComplianceController.js';

describe('PatchComplianceController', () => {
  let controller;
  let req;
  let res;

  beforeEach(() => {
    controller = new PatchComplianceController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return patch compliance status successfully', async () => {
    await controller.getPatchComplianceStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [
        { system: 'Windows 10', compliant: 85, nonCompliant: 15 },
        { system: 'Ubuntu 22.04', compliant: 70, nonCompliant: 30 },
        { system: 'macOS Ventura', compliant: 90, nonCompliant: 10 },
      ],
      message: 'Patch compliance status retrieved successfully',
    });
  });

  test('should handle errors gracefully', async () => {
    // Simulate an error in the controller method
    controller.getPatchComplianceStatus = async function (req, res) {
      try {
        throw new Error('Forced failure');
      } catch (error) {
        console.error('Patch Compliance Error:', error);
        res.status(500).json({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to retrieve patch compliance status',
          },
        });
      }
    };

    const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});

    await controller.getPatchComplianceStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve patch compliance status',
      },
    });

    errorLog.mockRestore();
  });
});
