import express from "express";
import Jwt from "../../../auth/jwt.js";
import VersionControlController from "./VersionControlController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const versionController = new VersionControlController();
const versionContRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/version-control/in-range:
 *   get:
 *     summary: Get version control metrics in a date range
 *     description: Retrieve version control metrics for a specified date range. Dates must be valid and within the supported dataset (currently 2025).
 *     tags:
 *       - Version Control Metrics
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *         description: The start date of the range in YYYY-MM-DD format.
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-31
 *         description: The end date of the range in YYYY-MM-DD format.
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
 *         description: Missing or invalid required query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields; startDate and endDate.
 *       404:
 *         description: No data found for the given range.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No data found for that range. Only 2025 data is available.
 */
versionContRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  let { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await versionController.getInRangeArticles(
      startDate,
      endDate
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});
export default versionContRouter;
