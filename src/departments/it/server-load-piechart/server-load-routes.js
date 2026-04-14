import express from "express";
import ServerController from "./ServerController.js";
import Jwt from "../../../auth/jwt.js";

const serverLoadRouter = express.Router();
const serverController = new ServerController();

/**
 * @swagger
 * tags:
 *   name: Server Load
 *   description: Server storage capacity monitoring and metrics
 */

/**
 * @swagger
 * /api/v1/server-load/{year}:
 *   get:
 *     summary: Get computed server usage information filtered by duration (year, optional month and date)
 *     tags: [Server Load]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year for filtering metrics
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Optional month for filtering metrics
 *       - in: query
 *         name: date
 *         schema:
 *           type: integer
 *         description: Optional date for filtering metrics
 *     responses:
 *       200:
 *         description: Server usage metrics filtered by duration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 duration:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                       example: 2025
 *                     month:
 *                       type: integer
 *                       nullable: true
 *                       example: 7
 *                     date:
 *                       type: integer
 *                       nullable: true
 *                       example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       totalStorage:
 *                         type: number
 *                       freeStorage:
 *                         type: number
 *                       usedStorage:
 *                         type: number
 *                       storagePercentage:
 *                         type: number
 *                       storageDegrees:
 *                         type: number
 *                       cpuLoadPercentage:
 *                         type: number
 *                       cpuLoadDegrees:
 *                         type: number
 *                       memoryPercentage:
 *                         type: number
 *                       memoryDegrees:
 *                         type: number
 *                       networkIn:
 *                         type: number
 *                       networkOut:
 *                         type: number
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
serverLoadRouter.get("/:year", async (req, res) => {
  const { year } = req.params;
  const { month = null, date = null } = req.query;

  const duration = {
    year: parseInt(year),
    month: month ? parseInt(month) : null,
    date: date ? parseInt(date) : null,
  };

  try {
    const data = await serverController.getComputedServerStats(duration);
    res.json({
      duration,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch server load metrics" });
  }
});

export default serverLoadRouter;
