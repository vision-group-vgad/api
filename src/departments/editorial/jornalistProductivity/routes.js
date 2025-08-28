import express from "express";
import { getProductivity, getDummyProductivity } from "./controller.js";


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
/**
 * @swagger
 * /api/v1/editorial/journalist-productivity/dummy:
 *   get:
 *     summary: Get dummy journalist productivity metrics
 *     description: |
 *       Returns pre-defined dummy data for journalist productivity. Supports optional filtering by author, category, and date range.
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
 *     responses:
 *       200:
 *         description: A list of dummy journalist productivity metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       articleId:
 *                         type: string
 *                       authorId:
 *                         type: string
 *                       author:
 *                         type: string
 *                       title:
 *                         type: string
 *                       category:
 *                         type: string
 *                       avgDuration:
 *                         type: string
 *                       bounceRate:
 *                         type: number
 *                       publishDate:
 *                         type: string
 *                         format: date
 *                       shares:
 *                         type: integer
 *                       likes:
 *                         type: integer
 *                       views:
 *                         type: integer
 *                       clicks:
 *                         type: integer
 *                       platform:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */
router.get("/dummy", getDummyProductivity);

export default router;