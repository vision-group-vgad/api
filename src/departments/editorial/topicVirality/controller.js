import express from "express";
import { getTopicVitality } from "./service.js";

const router = express.Router();


/**
 * @swagger
 * /api/v1/editorial/topic-virality:
 *   get:
 *     summary: Get topic vitality grouped by tags
 *     description: Returns a list of topic vitality metrics based on engagement and metadata.
 *     tags:
 *       - Topic Vitality
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Topic vitality data
 */


router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const data = await getTopicVitality(startDate, endDate);
    res.json(data);
  } catch (err) {
    console.error("Error fetching topic vitality:", err.message);
    res.status(500).json({ error: "Failed to fetch topic vitality data" });
  }
});

export default router;

