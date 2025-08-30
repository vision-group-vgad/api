import express from "express";
import dayjs from "dayjs";
import Jwt from "../../../auth/jwt.js";
import {dummyCapexData} from "./dummy.js";

const router = express.Router();
/**
 * @swagger
 * /api/v1/capEx/capex-dummy:
 *   get:
 *     summary: Get Capital Expenditure (CapEx) records
 *     description: 
 *       Retrieve a list of Capital Expenditure transactions.  
 *       Supports optional filtering by year, date range, or category.  
 *       Defaults to latest available year (2025) if no filter is provided.
 *     tags:
 *       - Capital Expenditure
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         description: Filter records by a specific year (e.g., 2021–2025)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-12-31
 *         description: End date for filtering (YYYY-MM-DD)
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
 *           example: "IT & Technology"
 *         description: Filter records by CAPEX category (dropdown selection)
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
 *                   description: Total CapEx amount for the filtered data
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
 *         description: No records found for the filters
 */


router.get("/capex-dummy", async (req, res) => {
  const { start, end, year, category } = req.query;

  let filteredData = [...dummyCapexData];

  // Filter by category
  if (category) {
    filteredData = filteredData.filter(
      (entry) =>
        entry.capexCategory.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by year
  if (year) {
    const yearInt = parseInt(year, 10);
    filteredData = filteredData.filter(
      (entry) => dayjs(entry.Posting_Date).year() === yearInt
    );
  }

  // Filter by custom date range
  if (start && end) {
    filteredData = filteredData.filter((entry) => {
      const date = dayjs(entry.Posting_Date);
      return (
        date.isAfter(dayjs(start).subtract(1, "day")) &&
        date.isBefore(dayjs(end).add(1, "day"))
      );
    });

    if (filteredData.length === 0) {
      return res.status(404).json({
        message: `No record exists for date range ${start} to ${end}`,
      });
    }
  }

  if (filteredData.length === 0) {
    return res.status(404).json({ message: "No records found" });
  }

  const totalCapex = filteredData.reduce((sum, entry) => sum + entry.Amount, 0);

  res.status(200).json({
    total: totalCapex,
    count: filteredData.length,
    data: filteredData,
  });
});

export default router;
