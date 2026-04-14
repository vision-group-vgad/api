import CyberSecPostController from "./CyberSecPostController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const cyberSecPostController = new CyberSecPostController();
const cyberSecPostRouter = express.Router();

/**
 * @swagger
 * /api/v1/it/cycber-sec-router/in-range:
 *   get:
 *     summary: Get organizational cybersecurity posture for a date range
 *     description: |
 *       Returns cybersecurity posture metrics for the organization's infrastructure,
 *       including vulnerability summary, patch management, endpoint protection,
 *       network security, identity & access, data protection, and compliance.
 *     tags:
 *       - Cybersecurity Posture
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Successful response with cybersecurity posture data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-08-19"
 *                   overallCyberSecurityScore:
 *                     type: number
 *                     example: 87
 *                   vulnerabilitySummary:
 *                     type: object
 *                     properties:
 *                       critical:
 *                         type: integer
 *                         example: 3
 *                       high:
 *                         type: integer
 *                         example: 12
 *                       medium:
 *                         type: integer
 *                         example: 25
 *                       low:
 *                         type: integer
 *                         example: 40
 *                       unpatchedSystems:
 *                         type: integer
 *                         example: 8
 *                   patchManagement:
 *                     type: object
 *                     properties:
 *                       patchCompliancePercent:
 *                         type: number
 *                         example: 92.3
 *                       outdatedSystems:
 *                         type: integer
 *                         example: 5
 *                   endpointProtection:
 *                     type: object
 *                     properties:
 *                       antivirusCoveragePercent:
 *                         type: number
 *                         example: 98
 *                       edrCoveragePercent:
 *                         type: number
 *                         example: 85
 *                       unencryptedDevices:
 *                         type: integer
 *                         example: 4
 *                   networkSecurity:
 *                     type: object
 *                     properties:
 *                       firewallStatus:
 *                         type: string
 *                         example: "Active"
 *                       idsAlertsLast7Days:
 *                         type: integer
 *                         example: 32
 *                       suspiciousConnections:
 *                         type: integer
 *                         example: 7
 *                   identityAndAccess:
 *                     type: object
 *                     properties:
 *                       mfaEnabledPercent:
 *                         type: number
 *                         example: 78
 *                       inactiveAccountsOlderThan90d:
 *                         type: integer
 *                         example: 6
 *                       adminAccounts:
 *                         type: integer
 *                         example: 14
 *                   dataProtection:
 *                     type: object
 *                     properties:
 *                       backupSuccessRatePercent:
 *                         type: number
 *                         example: 96.5
 *                       lastBackupDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-18T23:00:00Z"
 *                       sensitiveDataExposures:
 *                         type: integer
 *                         example: 2
 *                   compliance:
 *                     type: object
 *                     properties:
 *                       policyAdherencePercent:
 *                         type: number
 *                         example: 88
 *                       lastAuditDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-07-30"
 *                   systems:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "SharePoint"
 *                         vulnerabilityScore:
 *                           type: number
 *                           example: 88
 *                         patchCompliancePercent:
 *                           type: number
 *                           example: 90
 *                         lastSecurityScan:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-18T23:00:00Z"
 *       400:
 *         description: Invalid date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date range"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */
cyberSecPostRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await cyberSecPostController.getInRangeData(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default cyberSecPostRouter;
