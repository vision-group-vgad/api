import express from "express";
import { getTotalAssetValue } from "./controller.js";

const router = express.Router();


/**
 * @swagger
 * /api/v1/total-assets-value:
 *   get:
 *     summary: Get the total asset value
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Total value of all assets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalAssetValue:
 *                   type: number
 *                 totalRecords:
 *                   type: integer
 *       500:
 *         description: Server error
 */


router.get("/", getTotalAssetValue);

export default router;
