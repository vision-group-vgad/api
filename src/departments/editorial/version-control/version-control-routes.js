import express from "express";
import Jwt from "../../../auth/jwt.js";
import VersionControlController from "./VersionControlController.js";

const versionController = new VersionControlController();
const versionContRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/version-control/annual:
 *   get:
 *     summary: Get annual version control metrics
 *     description: Retrieve version control metrics for a given year. Currently, only data for the year 2025 is available.
 *     tags:
 *       - Version Control Metrics
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: The year for which to retrieve version control metrics.
 *     responses:
 *       200:
 *         description: Successfully retrieved version control metrics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       dateCreated:
 *                         type: string
 *                         format: date-time
 *                       datePublished:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       authors:
 *                         type: array
 *                         items:
 *                           type: string
 *                       editor:
 *                         type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalArticles:
 *                       type: integer
 *                     articlesPerDay:
 *                       type: number
 *                       format: float
 *                     uniqueEditorCount:
 *                       type: integer
 *                     articleByCategory:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                     uniqueTagsCount:
 *                       type: integer
 *                     avgPulbishDelay:
 *                       type: number
 *                       format: float
 *       400:
 *         description: Missing required field, year.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required field, year.
 *       404:
 *         description: No data found for the provided year.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No data found for that year. Only 2025 data is available.
 */
versionContRouter.get("/annual", Jwt.verifyToken, async (req, res) => {
  let { year } = req.query;
  year = parseInt(year);

  if (!year) {
    return res.status(400).json({
      message: "Missing required field: year.",
    });
  }
  if (year != 2025) {
    return res.status(404).json({
      message: "No data found for that year. Only 2025 data is available.",
    });
  }
  const results = await versionController.getAnnualData();
  res.json(results);
});
export default versionContRouter;
