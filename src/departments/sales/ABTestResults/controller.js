import express from "express";
import { calculateABTestResults } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AB Test Results
 *   description: API for viewing A/B test performance results
 */

/**
 * @swagger
 * /api/v1/sales/ab-tests:
 *   get:
 *     summary: Get A/B Test results
 *     tags: [AB Test Results]
 *     responses:
 *       200:
 *         description: List of A/B Test results with CTR and CR uplift
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       testId:
 *                         type: string
 *                         example: T001
 *                       testName:
 *                         type: string
 *                         example: Homepage Banner Test
 *                       startDate:
 *                         type: string
 *                         example: 2025-07-01
 *                       endDate:
 *                         type: string
 *                         example: 2025-07-15
 *                       variantA:
 *                         type: object
 *                       variantB:
 *                         type: object
 *                       results:
 *                         type: object
 */
router.get("/", (req, res) => {
  try {
    const results = calculateABTestResults();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;