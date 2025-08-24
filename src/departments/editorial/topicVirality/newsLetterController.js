import express from "express";
import { fetchNewsletterVirality } from "./newsLetterService.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Topic Virality
 *   description: "API for fetching newsletter engagement and virality scores"
 */

/**
 * @swagger
 * /api/v1/editorial/newsletter-virality:
 *   get:
 *     summary: "Fetch newsletter virality metrics"
 *     description: "Returns newsletter engagement metrics and computed virality scores for a given date range."
 *     tags: [Topic Virality]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: "Start date filter (default: 2025-03-01 if not provided)"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: "End date filter (default: 2025-06-30 if not provided)"
 *     responses:
 *       200:
 *         description: "Array of newsletters with engagement and virality scores"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   newsletterId:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   scheduledDate:
 *                     type: string
 *                   totalOpens:
 *                     type: integer
 *                   uniqueOpens:
 *                     type: integer
 *                   totalClicks:
 *                     type: integer
 *                   uniqueClickers:
 *                     type: integer
 *                   clickRate:
 *                     type: number
 *                   estimatedOpenRate:
 *                     type: number
 *                   viralityScore:
 *                     type: number
 *       400:
 *         description: "Missing required query parameters"
 *       500:
 *         description: "Failed to fetch newsletter virality"
 */
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Use default dates if not provided
    const fromDate = startDate || "2025-03-01";
    const toDate = endDate || "2025-06-30";

    const newsletters = await fetchNewsletterVirality(fromDate, toDate);

    res.json(newsletters);
  } catch (err) {
    console.error("Error fetching newsletter virality:", err.message);
    res.status(500).json({ error: "Failed to fetch newsletter virality" });
  }
});

export default router;
