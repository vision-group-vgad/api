import express from "express";
import axios from "axios";
import { groupByMonth, groupCashFlow, mergeNetIncome } from "./util.js";

const router = express.Router();

const CMS_API_URL =
  "https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-08-01/2021-10-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

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

const isRevenue = (name) => REVENUE_ACCOUNTS.includes(name);
const isExpense = (name) => EXPENSE_ACCOUNTS.includes(name);

/**
 * @swagger
 * tags:
 *   name: Finance Forecasting
 *   description: Monthly financial forecasting data
 */

/**
 * @swagger
 * /api/v1/finance-forecasting/revenue:
 *   get:
 *     summary: Get monthly actual revenue totals
 *     tags: [Finance Forecasting]
 *     responses:
 *       200:
 *         description: Monthly revenue data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: revenue
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2021-08
 *                       total:
 *                         type: number
 *                         example: 105000000
 */

// Revenue route
router.get("/revenue", async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const filtered = allEntries
      .map((e) => e.attributes)
      .filter((e) => isRevenue(e.G_L_Account_Name));
    const monthly = groupByMonth(filtered, "Credit_Amount");

    res.json({ type: "revenue", data: monthly });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute revenue actuals" });
  }
});

/**
 * @swagger
 * /api/v1/finance-forecasting/expense:
 *   get:
 *     summary: Get monthly actual expense totals
 *     tags: [Finance Forecasting]
 *     responses:
 *       200:
 *         description: Monthly expense data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: expense
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2021-08
 *                       total:
 *                         type: number
 *                         example: 42000000
 */

// Expense route
router.get("/expense", async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const filtered = allEntries
      .map((e) => e.attributes)
      .filter((e) => isExpense(e.G_L_Account_Name));
    const monthly = groupByMonth(filtered, "Debit_Amount");

    res.json({ type: "expense", data: monthly });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute expense actuals" });
  }
});

/**
 * @swagger
 * /api/v1/finance-forecasting/net-income:
 *   get:
 *     summary: Get net income (revenue - expense) per month
 *     tags: [Finance Forecasting]
 *     responses:
 *       200:
 *         description: Monthly net income
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: net-income
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2021-08
 *                       total:
 *                         type: number
 *                         example: 63000000
 */

// Net Income route
router.get("/net-income", async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const allAttrs = allEntries.map((e) => e.attributes);

    const revenues = groupByMonth(
      allAttrs.filter((e) => isRevenue(e.G_L_Account_Name)),
      "Credit_Amount"
    );
    const expenses = groupByMonth(
      allAttrs.filter((e) => isExpense(e.G_L_Account_Name)),
      "Debit_Amount"
    );

    const net = mergeNetIncome(revenues, expenses);

    res.json({ type: "net-income", data: net });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute net income actuals" });
  }
});

/**
 * @swagger
 * /api/v1/finance-forecasting/cashflow:
 *   get:
 *     summary: Get cashflow (debit - credit) per month
 *     tags: [Finance Forecasting]
 *     responses:
 *       200:
 *         description: Monthly cashflow data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: cashflow
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: 2021-08
 *                       total:
 *                         type: number
 *                         example: 32000000
 */

// Cash Flow route
router.get("/cashflow", async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const allAttrs = allEntries.map((e) => e.attributes);
    const monthly = groupCashFlow(allAttrs);

    res.json({ type: "cashflow", data: monthly });
  } catch (err) {
    res.status(500).json({ error: "Failed to compute cashflow actuals" });
  }
});

export default router;
