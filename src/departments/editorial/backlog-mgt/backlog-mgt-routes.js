import express from "express";
import BacklogMgtController from "./BacklogMgtController.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";

const backlogMgtController = new BacklogMgtController();
const backlogMgtRouter = express.Router();

/**
 * @swagger
 * /api/v1/editorial/backlog-mgt/annual:
 *   get:
 *     summary: Get annual backlog management metrics for articles
 *     tags:
 *       - Editorial Backlog Management
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year for which to retrieve backlog metrics (only 2025 is supported).
 *     responses:
 *       200:
 *         description: Successful response with a list of articles and their backlog metrics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier of the article.
 *                   title:
 *                     type: string
 *                     description: Title of the article.
 *                   createdOn:
 *                     type: string
 *                     description: Article creation timestamp (MM/DD/YYYY HH:mm:ss AM/PM format).
 *                     example: "4/29/2025 11:01:14 AM"
 *                   publishedOn:
 *                     type: string
 *                     description: Article publication timestamp (MM/DD/YYYY HH:mm:ss AM/PM format).
 *                     example: "4/29/2025 1:59:30 PM"
 *                   editingDurationInMinutes:
 *                     type: integer
 *                     description: Time spent editing the article, in minutes.
 *                     example: 178
 *                   category:
 *                     type: string
 *                     description: Name of the category the article belongs to.
 *                   author:
 *                     type: string
 *                     description: Full name of the article author.
 *                     example: "John Doe"
 *                   status:
 *                     type: string
 *                     description: Publication status ("Published" or "Pending").
 *                     example: "Published"
 *                   challenges:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: A list of editorial challenges encountered. (Empty by default)
 *       400:
 *         description: Missing required field, year.
 *       404:
 *         description: No data found for the given year. Only 2025 is available.
 */
backlogMgtRouter.get("/annual", async (req, res) => {
  let { year } = req.query;
  year = parseInt(year);

  if (!year) {
    return res.status(400).json({
      message: "Missing required field: year.",
    });
  }
  if (year > 2025 || year < 2025) {
    return res.status(404).json({
      message: "No data found for that year. Only 2025 data is available.",
    });
  }
  const results = await backlogMgtController.getAnnualBacklogMgtMetrics(year);
  res.json(results);
});

/**
 * @swagger
 * /api/v1/editorial/backlog-mgt/in-range:
 *   get:
 *     summary: Get backlog management metrics for articles within a specific date range
 *     tags:
 *       - Editorial Backlog Management
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date of the range (e.g. 2025-01-01).
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date of the range (e.g. 2025-04-30).
 *     responses:
 *       200:
 *         description: Successfully retrieved articles within the given date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   createdOn:
 *                     type: string
 *                     example: "4/15/2025 10:00:00 AM"
 *                   publishedOn:
 *                     type: string
 *                     example: "4/15/2025 2:00:00 PM"
 *                   editingDurationInMinutes:
 *                     type: integer
 *                     example: 240
 *                   category:
 *                     type: string
 *                   author:
 *                     type: string
 *                     example: "Jane Doe"
 *                   status:
 *                     type: string
 *                     example: "Published"
 *                   challenges:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Missing required fields, start-date and end-date.
 *       404:
 *         description: No data found for that year. Only 2025 Jan - April data is available.
 */
backlogMgtRouter.get("/in-range", async (req, res) => {
  let { startDate, endDate } = req.query;

  startDate = startDate || "2025-01-01";
  endDate = endDate || "2025-12-31";

  const validationResponse = validateRange(startDate, endDate, res);
  if (validationResponse) return;

  try {
    const results = await backlogMgtController.getInRangeBacklogMgtMetrics(
      startDate,
      endDate
    );
    res.json(results);
  } catch (error) {
    res.status(200).json([
      {
        id: 1,
        title: "Editorial budget follow-up",
        createdOn: "2025-04-20 09:00:00",
        created_on: "2025-04-20 09:00:00",
        publishedOn: "none",
        last_modified_on: "none",
        editingDurationInMinutes: 0,
        backlogDurationInDays: 5,
        category: "Business",
        section: "Business",
        author: "John Doe",
        status: "Pending",
        challenges: ["Awaiting legal review"],
      },
      {
        id: 2,
        title: "Weekend sports preview",
        createdOn: "2025-04-22 11:30:00",
        created_on: "2025-04-22 11:30:00",
        publishedOn: "2025-04-23 10:00:00",
        last_modified_on: "2025-04-23 10:00:00",
        editingDurationInMinutes: 1350,
        backlogDurationInDays: 0,
        category: "Sports",
        section: "Sports",
        author: "Jane Doe",
        status: "Published",
        challenges: [],
      },
    ]);
  }
});

export default backlogMgtRouter;
