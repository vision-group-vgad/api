import express from "express";
import { fetchVisualEngagementData } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/visual-engagement:
 *   get:
 *     summary: Get visual asset engagement metrics
 *     description: Returns scroll depth, session duration, bounce rate for articles with image/video assets, filtered by date.
 *     tags:
 *       - Visual Asset Engagement
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Visual engagement data
 *       400:
 *         description: Bad request due to invalid date format
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate.",
    });
  }

  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({
      error: "Date format must be YYYY-MM-DD.",
    });
  }

  try {
    const data = await fetchVisualEngagementData(startDate, endDate);
    res.status(200).json(data);
  } catch (err) {
    console.error("Visual Engagement API fetch failed:", err.message);
    res.status(500).json({
      error: "Failed to fetch visual engagement data.",
      details: err.message,
    });
  }
});

export default router;
