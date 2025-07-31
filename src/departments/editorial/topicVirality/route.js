import express from "express";
import Jwt from "../../../auth/jwt.js";
import { getTopicViralityController } from "./controller.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/editorial/topic-virality:
 *   get:
 *     summary: Get topic virality data
 *     description: Returns topic virality showing number of articles published, engagements, and media mentions. Filter by year and month.
 *     tags: [Editorial Topic Virality]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: Year to filter by (e.g. 2024)
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: false
 *         description: Month to filter by (e.g. 01)
 *     responses:
 *       200:
 *         description: Topic virality data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       category:
 *                         type: string
 *                       published_on:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     pageCount:
 *                       type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.get("/", Jwt.verifyToken, getTopicViralityController);

export default router;
