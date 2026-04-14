import express from "express";
import SectionPerformanceController from "./SectionPerformance.js";
import Jwt from "../../../auth/jwt.js";

const sectPerController = new SectionPerformanceController();
const sectPerRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/section-perfromance:
 *   get:
 *     summary: Get section performance data
 *     description: Returns processed article performance data grouped by category, including authors, editors, publication dates, and demographic stats.
 *     tags:
 *       - Editorial Section Performance
 *     responses:
 *       200:
 *         description: A list of categories with detailed article performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: "Technology"
 *                   noOfArticles:
 *                     type: integer
 *                     example: 5
 *                   noOfReaders:
 *                     type: integer
 *                     example: 130
 *                   totalBounceRate:
 *                     type: number
 *                     format: float
 *                     example: 7.2
 *                   avgBounceRate:
 *                     type: number
 *                     format: float
 *                     example: 1.44
 *                   demograhpics:
 *                     type: object
 *                     properties:
 *                       males:
 *                         type: integer
 *                         example: 60
 *                       females:
 *                         type: integer
 *                         example: 70
 *                   articles:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         articleTitle:
 *                           type: string
 *                           example: "The Rise of AI in Africa"
 *                         publishedOn:
 *                           type: string
 *                           format: date
 *                           example: "2025-07-21"
 *                         authors:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Zac Jim", "Jane Doe"]
 *                         editor:
 *                           type: string
 *                           example: "Editor-in-Chief"
 *                         locations:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Kampala", "Nairobi", "Lagos"]
 *       500:
 *         description: Internal server error
 */
sectPerRouter.get("/", async (req, res) => {
  const results = await sectPerController.getSectionPerformanceData();
  res.status(200).json(results);
});

export default sectPerRouter;
