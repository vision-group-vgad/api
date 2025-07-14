import express from "express";

const router = express.Router();

// Dummy system integration health data
const systemHealth = [
  {
    system: "ERP",
    status: "online",
    lastSynced: "2025-07-14T08:30:00Z",
    uptime: 99.9,
    failedSyncs: 1,
    latency: 250, // in ms
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
    system: "Bank API",
    status: "offline",
    lastSynced: "2025-07-13T22:00:00Z",
    uptime: 89.2,
    failedSyncs: 7,
    latency: null,
  },
];

// Swagger documentation
/**
 * @swagger
 * /api/v1/integration-health:
 *   get:
 *     summary: Get system integration health status
 *     tags: [System Integration Health]
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
router.get("/", (req, res) => {
  res.status(200).json(systemHealth);
});

export default router;
