import express from "express";
import { getSegmentPopularity } from "./improvedController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/segment-summary:
 *   get:
 *     summary: Retrieve segment popularity by article category
 *     description: >
 *       Returns article categories and their counts.  
 *       - If `startDate` and `endDate` are provided, data is filtered for that range.  
 *       - If not provided, the default range is **2025-03-01 → 2025-06-30**.
 *     tags:
 *       - Segment Popularity
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: >
 *           Start date in YYYY-MM-DD format.  
 *           Defaults to "2025-03-01" if not provided.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: >
 *           End date in YYYY-MM-DD format.  
 *           Defaults to "2025-06-30" if not provided.
 *     responses:
 *       200:
 *         description: Successful response with segment popularity data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 startDate:
 *                   type: string
 *                   example: "2025-03-01"
 *                 endDate:
 *                   type: string
 *                   example: "2025-06-30"
 *                 totalSegments:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                         example: 1
 *                       category_name:
 *                         type: string
 *                         example: "sports"
 *                       count:
 *                         type: integer
 *                         example: 1827
 *       500:
 *         description: Internal server error
 */
router.get("/", getSegmentPopularity);

export default router;
