// controller.js
import express from "express";
import { getSegmentPopularity } from "./service.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/editorial/segment-popularity:
 *   get:
 *     summary: Get most popular segments by user engagement
 *     tags: [Segment Popularity]
 *     description: |
 *       Returns a list of segments (by category) ranked by:
 *       - Average duration
 *       - Scroll percentage
 *       - Bounce rate
 *       
 *       It joins article metadata and session metrics.
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: |
 *           Start date in YYYY-MM-DD format.
 *           Defaults to beginning of current year.
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: |
 *           End date in YYYY-MM-DD format.
 *           Defaults to today.
 *     responses:
 *       200:
 *         description: A JSON array of segments with average metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   section:
 *                     type: string
 *                   articleCount:
 *                     type: integer
 *                   avgDuration:
 *                     type: number
 *                   avgScroll:
 *                     type: number
 *                   avgBounce:
 *                     type: number
 */

router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await getSegmentPopularity({ start, end });
    res.json(data);
  } catch (err) {
    
    res.status(500).json({ error: "Failed to fetch segment popularity" });
  }
});

export default router;
