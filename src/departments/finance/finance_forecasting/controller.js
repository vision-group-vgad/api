import express from "express";
import axios from "axios";

const router = express.Router();

const CMS_API_URL =
  process.env.VGAD_API_BASE_URL ||
  "https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-01-01/2021-12-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

// Classification Lists
const REVENUE_ACCOUNTS = [
  "Bukedde Avertising Revenue",
  "Bukedde FM Advertising Rev.",
  "Bukedde Newspaper Sales",
  "Commercial Printing Revenue",
  "Etop Radio Revenue",
  "New Vision Advertising Revenue",
  "New Vision Sales",
  "Publishing Revenue",
  "Radio Rupiny Revenue",
  "Radio west Advertising Rev.",
  "Saturday Adv. Sales",
  "Saturday Vision",
  "Scrap Sales Revenue",
  "Sunday Vision Sales",
  "Website Advertising Revenue",
  "West Television Revenue",
];

const EXPENSE_ACCOUNTS = [
  "Commission Payable",
  "Consumables used",
  "Meeting Expenses",
  "Motor Vehicle Run",
  "Office Tea",
  "Out Sourcing Expenses",
  "Travel and Transport",
  "Internet & Subscription",
];

const CONTROL_ACCOUNTS = [
  "Arua One Cash Control",
  "Direct Credits Cash Control",
  "Forex Cash Receipts",
  "Gulu Cash Control",
  "H/O Cash Receipts Cont",
  "H/Q P/Cash Rec control",
  "Head Office Petty Cash",
  "Input Vat",
  "Local Debtors Control",
  "Mbarara Cash Control",
  "Mobile Money",
  "Output Vat",
  "Soroti Cash Control",
  "Staff Ledger Control",
  "Stanbic Kampala",
  "Creditors Control-Local",
  "Foreign Debtors Control",
  "Other Provisions",
];

// Helper functions
const isRevenue = (name) => REVENUE_ACCOUNTS.includes(name);
const isExpense = (name) => EXPENSE_ACCOUNTS.includes(name);
const isControl = (name) => CONTROL_ACCOUNTS.includes(name);



/**
 * @swagger
 * /api/v1/finance-forecasting:
 *   get:
 *     summary: Fetch GL entries (revenue, expense, control, or all)
 *     tags: [Finance Forecasting]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [revenue, expense, control]
 *         description: Type of entries to filter
 *     responses:
 *       200:
 *         description: Successfully fetched GL entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source:
 *                   type: string
 *                 type:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       G_L_Account_Name:
 *                         type: string
 *                       G_L_Account_No:
 *                         type: string
 *                       Amount:
 *                         type: number
 *                       Debit_Amount:
 *                         type: number
 *                       Credit_Amount:
 *                         type: number
 *                       Document_Type:
 *                         type: string
 *                       Posting_Date:
 *                         type: string
 *                         format: date
 *       500:
 *         description: Server error while fetching data
 */


router.get("/", async (req, res) => {
  const { type } = req.query;

  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
      timeout: 30000,
    });

    const allEntries = response.data.data || [];
   

    const simplified = allEntries.map((entry) => {
      const attr = entry.attributes;

      return {
        G_L_Account_Name: attr.G_L_Account_Name || null,
        G_L_Account_No: attr.G_L_Account_No || null,
        Amount: parseFloat(attr.Amount || "0"),
        Debit_Amount: parseFloat(attr.Debit_Amount || "0"),
        Credit_Amount: parseFloat(attr.Credit_Amount || "0"),
        Document_Type: attr.Document_Type || null,
        Posting_Date: attr.Posting_Date || null,
      };
    });

    // Filter based on type
    let filtered;
    if (type === "revenue") {
      filtered = simplified.filter((entry) =>
        isRevenue(entry.G_L_Account_Name)
      );
    } else if (type === "expense") {
      filtered = simplified.filter((entry) =>
        isExpense(entry.G_L_Account_Name)
      );
    } else if (type === "control") {
      filtered = simplified.filter((entry) =>
        isControl(entry.G_L_Account_Name)
      );
    } else {
      filtered = simplified;
    }

    res.json({
      source: "live",
      type: type || "all",
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    
    res.status(500).json({ error: "Failed to fetch GL data" });
  }
});

export default router;

// router.get("/", async (req, res) => {
//   try {
//     const response = await axios.get(CMS_API_URL, {
//       headers: {
//         Authorization: `Bearer ${BEARER_TOKEN}`,
//         Accept: "application/json",
//       },
//       timeout: 30000,
//     });

//     const entries = response.data.data || [];

//     const glNamesSet = new Set();

//     entries.forEach((entry) => {
//       const name = entry.attributes?.G_L_Account_Name;
//       if (name) {
//         glNamesSet.add(name.trim());
//       }
//     });

//     const uniqueNames = Array.from(glNamesSet).sort();

//     res.json({
//       total: uniqueNames.length,
//       uniqueG_L_Account_Names: uniqueNames,
//     });
//   } catch (error) {
//     console.error("Error fetching unique GL account names:", error.message);
//     res.status(500).json({ error: "Failed to fetch GL account names" });
//   }
// });

// export default router;
