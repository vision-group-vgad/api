import axios from "axios";
import express from "express";
// import dotenv from "dotenv";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

const CMS_API_URL =
  "https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-08-01/2021-10-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

/**
 * @swagger
 * /api/v1/asset-depreciation:
 *   get:
 *     summary: Fetch live asset depreciation entries from CMS API
 *     tags: [Asset Depreciation]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of depreciation entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       gl_no:
 *                         type: string
 *                       gl_name:
 *                         type: string
 *                       debit:
 *                         type: number
 *                       credit:
 *                         type: number
 *                       amount:
 *                         type: number
 *                       document_type:
 *                         type: string
 */

router.get("/", Jwt.verifyToken, async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
      timeout: 50000,
    });

    const allEntries = response.data.data;

    const result = allEntries.map((entry) => ({
      gl_no: entry.attributes.G_L_Account_No,
      gl_name: entry.attributes.G_L_Account_Name,
      debit: parseFloat(entry.attributes.Debit_Amount || "0"),
      credit: parseFloat(entry.attributes.Credit_Amount || "0"),
      amount: parseFloat(entry.attributes.Amount || "0"),
      document_type: entry.attributes.Document_Type,
    }));

    // Filter out rows with no G/L Account Name
    //const filtered = result.filter((e) => e.gl_name);

    res.json({ source: "live", count: result.length, data: result });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to fetch account names" });
  }
});

/**
 * @swagger
 * /api/v1/asset-depreciation/dummy:
 *   get:
 *     summary: Get dummy asset depreciation data
 *     tags: [Asset Depreciation]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sample depreciation data for testing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       asset_id:
 *                         type: string
 *                       asset_name:
 *                         type: string
 *                       acquisition_date:
 *                         type: string
 *                         format: date
 *                       acquisition_cost:
 *                         type: number
 *                       useful_life_years:
 *                         type: number
 *                       residual_value:
 *                         type: number
 *                       depreciation_method:
 *                         type: string
 *                       accumulated_depreciation:
 *                         type: number
 *                       current_value:
 *                         type: number
 *                       schedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             year:
 *                               type: integer
 *                             amount:
 *                               type: number
 */

router.get("/dummy", Jwt.verifyToken, async (req, res) => {
  const dummyDepreciation = [
    {
      asset_id: "VEH-2020-01",
      asset_name: "Toyota Hilux (Company Car)",
      acquisition_date: "2020-01-10",
      acquisition_cost: 120000000,
      useful_life_years: 5, // Expected life of the asset
      residual_value: 20000000, //expected value at end
      depreciation_method: "straight_line",
      accumulated_depreciation: 72000000, // UGX 72M depreciated so far
      current_value: 48000000, // value today
      schedule: [
        { year: 2020, amount: 20000000 },
        { year: 2021, amount: 20000000 },
        { year: 2022, amount: 20000000 },
        { year: 2023, amount: 12000000 }, // Partial year or custom depreciation
      ],
    },
    {
      asset_id: "EQUIP-2019-07",
      asset_name: "Office Printer X500",
      acquisition_date: "2019-07-15",
      acquisition_cost: 8000000,
      useful_life_years: 4,
      residual_value: 500000,
      depreciation_method: "straight_line",
      accumulated_depreciation: 6000000, // UGX 6M depreciated so far
      current_value: 2000000, //  value today
      schedule: [
        { year: 2019, amount: 1875000 },
        { year: 2020, amount: 2000000 },
        { year: 2021, amount: 2125000 },
      ],
    },
    {
      asset_id: "EQUIP-2020-09",
      asset_name: "Office Shredder",
      acquisition_date: "2020-09-15",
      acquisition_cost: 9000000,
      useful_life_years: 4,
      residual_value: 500000,
      depreciation_method: "straight_line",
      accumulated_depreciation: 6000000, // UGX 6M depreciated so far
      current_value: 2000000, //  value today
      schedule: [
        { year: 2020, amount: 2000000 },
        { year: 2021, amount: 2125000 },
      ],
    },
    {
      asset_id: "LAP-2019-05",
      asset_name: "Company laptops",
      acquisition_date: "2019-05-05",
      acquisition_cost: 20000000,
      useful_life_years: 6,
      residual_value: 500000,
      depreciation_method: "straight_line",
      accumulated_depreciation: 6000000, // UGX 6M depreciated so far
      current_value: 2000000, //  value today
      schedule: [
        { year: 2019, amount: 18075000 },
        { year: 2020, amount: 20000000 },
        { year: 2021, amount: 21205000 },
      ],
    },
  ];

  res.json({ source: "dummy", data: dummyDepreciation });
});

export default router;
