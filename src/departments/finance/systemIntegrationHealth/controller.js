import express from "express";
import Jwt from "../../../auth/jwt.js";
const router = express.Router();

// Dummy system integration health data
const systemHealth = [
  
  {
    system: "Business Central",
    status: "online",
    lastSynced: "2025-07-14T08:30:00Z",
    uptime: 99.9,
    failedSyncs: 1,
    latency: 250,
  },
  {
    system: "CMS",
    status: "degraded",
    lastSynced: "2025-07-14T08:00:00Z",
    uptime: 94.5,
    failedSyncs: 4,
    latency: 900,
  },
  {
    system: "Sharepoint",
    status: "offline",
    lastSynced: "2025-07-13T22:00:00Z",
    uptime: 89.2,
    failedSyncs: 7,
    latency: null,
  },
  
  {
    system: "ERP Finance",
    status: "online",
    lastSynced: "2025-07-14T08:45:00Z",
    uptime: 98.7,
    failedSyncs: 0,
    latency: 180,
  },
  {
    system: "Payroll System",
    status: "degraded",
    lastSynced: "2025-07-14T07:50:00Z",
    uptime: 92.3,
    failedSyncs: 3,
    latency: 700,
  },
  {
    system: "Accounts Receivable",
    status: "online",
    lastSynced: "2025-07-14T08:40:00Z",
    uptime: 99.2,
    failedSyncs: 1,
    latency: 200,
  },
  {
    system: "Accounts Payable",
    status: "degraded",
    lastSynced: "2025-07-14T08:15:00Z",
    uptime: 94.8,
    failedSyncs: 2,
    latency: 500,
  },
  {
    system: "Tax Management System",
    status: "online",
    lastSynced: "2025-07-14T08:50:00Z",
    uptime: 98.9,
    failedSyncs: 0,
    latency: 220,
  },
  {
    system: "Audit & Compliance",
    status: "offline",
    lastSynced: "2025-07-13T21:30:00Z",
    uptime: 87.5,
    failedSyncs: 8,
    latency: null,
  },
  {
    system: "Expense Management",
    status: "degraded",
    lastSynced: "2025-07-14T08:05:00Z",
    uptime: 93.0,
    failedSyncs: 3,
    latency: 450,
  },
  {
    system: "Budget Planning",
    status: "online",
    lastSynced: "2025-07-14T08:55:00Z",
    uptime: 99.0,
    failedSyncs: 0,
    latency: 210,
  },
];


// Swagger documentation
/**
 * @swagger
 * /api/v1/integration-health:
 *   get:
 *     summary: Get system integration health status
 *     tags: [System Integration Health]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start of date-time range filter (ISO string)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End of date-time range filter (ISO string)
 *     responses:
 *       200:
 *         description: List of system health statuses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   system:
 *                     type: string
 *                   status:
 *                     type: string
 *                   lastSynced:
 *                     type: string
 *                     format: date-time
 *                   uptime:
 *                     type: number
 *                     format: float
 *                   failedSyncs:
 *                     type: integer
 *                   latency:
 *                     type: number
 */
router.get("/", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  let filteredData = systemHealth;

  // Apply date filtering if provided
  if (startDate || endDate) {
    filteredData = systemHealth.filter((item) => {
      const lastSynced = new Date(item.lastSynced).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      return lastSynced >= start && lastSynced <= end;
    });
  }

   if (filteredData.length === 0) {
    return res.status(404).json({
      message: "No system health records found for the given date range.",
      startDate: startDate || null,
      endDate: endDate || null,
    });
  }

  res.status(200).json(filteredData);
});

export default router;
