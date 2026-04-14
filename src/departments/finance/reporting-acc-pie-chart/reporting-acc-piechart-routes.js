import ReportingAccController from "./ReportingAccController.js";
import express from "express";

const repoAccRouter = express.Router();
const repoAccController = new ReportingAccController();

/**
 * @swagger
 * /api/v1/reporting-accu-piechart/{year}:
 *   get:
 *     summary: Get financial report modification stats for a given year
 *     tags: [Reports Accuracy]
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year to retrieve reports for
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional month filter
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: integer
 *         description: Optional specific date filter
 *     responses:
 *       200:
 *         description: Successfully fetched report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 duration:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: integer
 *                     month:
 *                       type: integer
 *                     date:
 *                       type: integer
 *                 total_reports:
 *                   type: integer
 *                 total_modified_reports:
 *                   type: integer
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       report_category:
 *                         type: string
 *                       no_of_reports:
 *                         type: integer
 *                       no_of_modified_reports:
 *                         type: integer
 *                       degree_of_modification:
 *                         type: number
 */
repoAccRouter.get("/:year", async (req, res) => {
  const { year } = req.params;
  const { month = null, date = null } = req.query;

  const duration = {
    year: parseInt(year),
    month: month ? parseInt(month) : null,
    date: date ? parseInt(date) : null,
  };

  const reports = await repoAccController.getReports(duration);

  res.json({
    duration,
    total_reports: repoAccController.totalReports,
    total_modified_reports: repoAccController.totalModifiedReports,
    reports,
  });
});

export default repoAccRouter;
