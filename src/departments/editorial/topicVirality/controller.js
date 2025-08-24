import express from "express";
import { getTopicVitality } from "./service.js";
import dayjs from "dayjs";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/topic-virality:
 *   get:
 *     summary: Get topic vitality grouped by tags
 *     description: Returns a list of topic vitality metrics based on engagement and metadata.
 *     tags:
 *       - Topic Virality
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD (defaults to first day of current month)
 *       - in: query
 *         name: endDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD (defaults to today)
 *     responses:
 *       200:
 *         description: Topic vitality data
 */
router.get("/", async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Default to current month if not provided
    if (!startDate) startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    if (!endDate) endDate = dayjs().format("YYYY-MM-DD");

    const data = await getTopicVitality(startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error("Error fetching topic vitality:", err.message);
    res.status(500).json({ error: "Failed to fetch topic vitality data" });
  }
});

export default router;
