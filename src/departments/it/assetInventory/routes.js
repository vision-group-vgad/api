import express from "express";
import { fetchAssetInventory } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Asset Inventory
 *     description: Fetches all asset inventory records for IT
 */

/**
 * @swagger
 * /api/v1/it/assets-inventory:
 *   get:
 *     summary: Get asset inventory
 *     description: Fetches all asset inventory records, with optional date filters.
 *     tags:
 *       - Asset Inventory
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD) for filtering by purchaseDate
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD) for filtering by purchaseDate
 *     responses:
 *       200:
 *         description: A list of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "asset-001"
 *                       name:
 *                         type: string
 *                         example: "Server Rack"
 *                       department:
 *                         type: string
 *                         example: "IT"
 *                       category:
 *                         type: string
 *                         example: "Hardware"
 *                       purchaseDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-03-01"
 *                       cost:
 *                         type: number
 *                         example: 15000
 *       500:
 *         description: Failed to fetch asset inventory
 */

router.get("/", fetchAssetInventory);

export default router;
