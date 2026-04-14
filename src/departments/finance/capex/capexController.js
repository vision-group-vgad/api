import express from "express";
import dayjs from "dayjs";
import {dummyCapexData} from "./dummy.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/capEx/capex-dummy:
 *   get:
 *     summary: Get Capital Expenditure (CapEx) records
 *     description: Retrieve a list of Capital Expenditure transactions.  
 *     tags:
 *       - Capital Expenditure
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Optional. Filter records by a specific year (e.g., 2021–2025)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional. Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional. End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: 
 *             - "Broadcast Equipment"
 *             - "IT & Technology"
 *             - "Vehicles & Transport"
 *             - "Buildings & Facilities"
 *             - "Furniture & Fixtures"
 *         description: Optional. Filter records by CAPEX category
 *     responses:
 *       200:
 *         description: Successful response with CapEx data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 2040000000
 *                   description: Total CapEx amount for the returned data
 *                 count:
 *                   type: integer
 *                   example: 3
 *                   description: Number of records returned
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Posting_Date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-10"
 *                       G_L_Account_No:
 *                         type: string
 *                         example: "40001"
 *                       G_L_Account_Name:
 *                         type: string
 *                         example: "Studio Cameras"
 *                       Document_No:
 *                         type: string
 *                         example: "DOC-2025-001"
 *                       Document_Type:
 *                         type: string
 *                         example: "Purchase"
 *                       Amount:
 *                         type: number
 *                         example: 1200000000
 *                       capexCategory:
 *                         type: string
 *                         example: "Broadcast Equipment"
 *       404:
 *         description: No records found for the applied filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No record exists for date range 2025-01-01 to 2025-01-31"
 */



router.get("/capex-dummy", async (req, res) => {
  const { start, end, year, category } = req.query;

  let filteredData = [...dummyCapexData];

  // Apply category filter if provided
  if (category) {
    filteredData = filteredData.filter(
      (entry) =>
        entry.capexCategory.toLowerCase() === category.toLowerCase()
    );
  }

  // Apply year filter if provided
  if (year) {
    const yearInt = parseInt(year, 10);
    filteredData = filteredData.filter(
      (entry) => dayjs(entry.Posting_Date).year() === yearInt
    );
  }

  // Apply custom date range filter if both start and end are provided
  if (start && end) {
    filteredData = filteredData.filter((entry) => {
      const date = dayjs(entry.Posting_Date);
      return (
        date.isAfter(dayjs(start).subtract(1, "day")) &&
        date.isBefore(dayjs(end).add(1, "day"))
      );
    });
  }

  // Return 404 only if filtering was applied and no data matches
  if ((start || end || year || category) && filteredData.length === 0) {
    let message = "No records found";
    if (start && end) message = `No record exists for date range ${start} to ${end}`;
    res.status(404).json({ message });
    return;
  }

  // Calculate total amount
  const totalCapex = filteredData.reduce((sum, entry) => sum + entry.Amount, 0);

  // Return all data if no filters, or filtered data
  res.status(200).json({
    total: totalCapex,
    count: filteredData.length,
    data: filteredData,
  });
});


export default router;
