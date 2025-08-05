import express from "express";
import { getProductivity } from "./controller.js";


const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/journalist-productivity:
 *   get:
 *     summary: Get journalist productivity metrics
 *     description: |
 *       Retrieves productivity data per journalist, combining article metadata and session analytics. 
 *       Supports filters for date range, author, category, and pagination.
 *     tags:
 *       - Journalist Productivity
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by journalist/author name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by article category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: A list of journalist productivity metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of results
 *                 page:
 *                   type: integer
 *                   description: Current page
 *                 pageSize:
 *                   type: integer
 *                   description: Number of results per page
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author:
 *                         type: string
 *                       articleCount:
 *                         type: integer
 *                       avgDuration:
 *                         type: number
 *                       avgBounceRate:
 *                         type: number
 *                       avgScrollDepth:
 *                         type: number
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */


router.get("/", getProductivity);



export default router;
