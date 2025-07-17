import express from "express";
import dayjs from "dayjs";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/capEx/capex-dummy:
 *   get:
 *     summary: Get Capital Expenditure (CapEx) records
 *     description: >
 *       Retrieve a list of Capital Expenditure transactions.  
 *       Supports optional filtering by year or date range.  
 *       Defaults to latest available year if no filter is provided.
 *     tags:
 *       - Capital Expenditure
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2021
 *         description: Filter records by a specific year (e.g., 2021, 2025)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *           example: 2021-08-01
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *           example: 2021-08-31
 *         description: End date for filtering (YYYY-MM-DD)
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
 *                   example: 204000
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
 *                         example: "2021-08-10"
 *                       G_L_Account_No:
 *                         type: string
 *                         example: "10060"
 *                       G_L_Account_Name:
 *                         type: string
 *                         example: "Mbarara Cash Control"
 *                       Document_No:
 *                         type: string
 *                         example: "B-SK000020RN"
 *                       Document_Type:
 *                         type: string
 *                         example: "Payment"
 *                       Amount:
 *                         type: number
 *                         example: 19000
 *                       capexCategory:
 *                         type: string
 *                         example: "CapEx - Buildings"
 *       500:
 *         description: Server error
 */


router.get("/capex-dummy", Jwt.verifyToken, async(req, res) => {
  const dummyCapexData = [
    {
      Posting_Date: "2021-08-10",
      G_L_Account_No: "10060",
      G_L_Account_Name: "Mbarara Cash Control",
      Document_No: "B-SK000020RN",
      Document_Type: "Payment",
      Amount: 19000,
      capexCategory: "CapEx - Buildings",
    },
    {
      Posting_Date: "2021-08-15",
      G_L_Account_No: "10061",
      G_L_Account_Name: "Kampala Equipment Control",
      Document_No: "B-KA000121EQ",
      Document_Type: "Payment",
      Amount: 65000,
      capexCategory: "CapEx - Equipment",
    },
    {
      Posting_Date: "2025-01-20",
      G_L_Account_No: "10062",
      G_L_Account_Name: "Vehicle Acquisitions",
      Document_No: "B-VEH0045RN",
      Document_Type: "Payment",
      Amount: 120000,
      capexCategory: "CapEx - Vehicles",
    },
  ];

  const { start, end, year } = req.query;

  let filteredData = [];

  if (start && end) {
    // Filter by custom range
    filteredData = dummyCapexData.filter((entry) => {
      const date = dayjs(entry.Posting_Date);
      return (
        date.isAfter(dayjs(start).subtract(1, "day")) &&
        date.isBefore(dayjs(end).add(1, "day"))
      );
    });
  } else if (year) {
    // Filter by year param
    const yearInt = parseInt(year, 10);
    filteredData = dummyCapexData.filter(
      (entry) => dayjs(entry.Posting_Date).year() === yearInt
    );
  } else {
    // Default: auto-detect the most recent year in the data
    const years = dummyCapexData.map((entry) =>
      dayjs(entry.Posting_Date).year()
    );
    const latestYear = Math.max(...years);

    filteredData = dummyCapexData.filter(
      (entry) => dayjs(entry.Posting_Date).year() === latestYear
    );
  }

  const totalCapex = filteredData.reduce((sum, entry) => sum + entry.Amount, 0);

  res.status(200).json({
    total: totalCapex,
    count: filteredData.length,
    data: filteredData,
  });
});

export default router;
