import express from "express";
import { calculateABTestResults } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/sales/ab-tests:
 *   get:
 *     summary: Get A/B Test results
 *     description: Retrieve A/B test results with optional filters for date range and test name.
 *     tags: [AB Test Results]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tests that started on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tests that ended on or before this date (YYYY-MM-DD)
 *       - in: query
 *         name: testName
 *         schema:
 *           type: string
 *         description: Filter tests by their name (partial matches allowed)
 *     responses:
 *       200:
 *         description: List of A/B Test results with conversion rate and uplift
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
 *                       experimentId:
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
 *                       variationA:
 *                         type: object
 *                       variationB:
 *                         type: object
 *                       results:
 *                         type: object
 */

router.get("/", (req, res) => {
  try {
    const { startDate, endDate, testName } = req.query;
    let results = calculateABTestResults();

    // Filter by startDate
    if (startDate) {
      results = results.filter(test => new Date(test.startDate) >= new Date(startDate));
    }

    // Filter by endDate
    if (endDate) {
      results = results.filter(test => new Date(test.endDate) <= new Date(endDate));
    }

    // Filter by testName
    if (testName) {
      results = results.filter(test =>
        test.testName.toLowerCase().includes(testName.toLowerCase())
      );
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default router;