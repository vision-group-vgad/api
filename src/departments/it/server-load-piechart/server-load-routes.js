import express from "express";
import ServerController from "./ServerController.js";
import Jwt from "../../../auth/jwt.js";

const serverLoadRouter = express.Router();
const serverController = new ServerController();

/**
 * @swagger
 * tags:
 *   name: Server Load
 *   description: Server storage capacity monitoring
 */

/**
 * @swagger
 * /api/v1/server-load:
 *   get:
 *     summary: Get computed server storage usage information
 *     tags: [Server Load]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of server storage usage metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   serverName:
 *                     type: string
 *                     example: "Server A"
 *                   totalCapacity:
 *                     type: number
 *                     example: 1000
 *                   freeSpace:
 *                     type: number
 *                     example: 300
 *                   usedStorPercentage:
 *                     type: number
 *                     example: 70
 *                   usedStorDegrees:
 *                     type: number
 *                     example: 252
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
serverLoadRouter.get("/", Jwt.verifyToken, async (req, res) => {
  res.json(await serverController.getComputedStorages());
});

export default serverLoadRouter;
