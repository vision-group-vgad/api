import express from "express";
import axios from "axios";
import { groupByMonth, groupCashFlow, mergeNetIncome } from "./util.js";
import generateDummyEntries from "./dummyEntries.js";

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

const filterByTime = (entries, year, quarter, month) => {
  return entries.filter((entry) => {
    if (!entry.Posting_Date) return false;
    const date = new Date(entry.Posting_Date);
    const entryYear = date.getFullYear();
    const entryMonth = date.getMonth() + 1;
    const entryQuarter = Math.floor((entryMonth - 1) / 3) + 1;

    if (year && parseInt(year) !== entryYear) return false;
    if (quarter && parseInt(quarter) !== entryQuarter) return false;
    if (month && parseInt(month) !== entryMonth) return false;

    return true;
  });
};

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
 *     summary: Get monthly actual revenue totals (includes dummy data)
 *     tags: [Finance Forecasting]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2022)
 *       - in: query
 *         name: quarter
 *         schema:
 *           type: integer
 *         description: Filter by quarter (1-4)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *     responses:
 *       200:
 *         description: Monthly revenue data
 */
router.get("/revenue", async (req, res) => {
  const { year, quarter, month } = req.query;
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const realData = allEntries.map((e) => e.attributes);
    const dummy = generateDummyEntries("revenue");
    const combined = [...realData, ...dummy];
    const filtered = combined.filter((e) => isRevenue(e.G_L_Account_Name));
    const timeFiltered = filterByTime(filtered, year, quarter, month);
    const monthly = groupByMonth(timeFiltered, "Credit_Amount");

    res.json({ type: "revenue", data: monthly });
  } catch (err) {
   
    res.status(500).json({ error: "Failed to compute revenue actuals" });
  }
});

/**
 * @swagger
 * /api/v1/finance-forecasting/expense:
 *   get:
 *     summary: Get monthly actual expense totals (includes dummy data)
 *     tags: [Finance Forecasting]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2022)
 *       - in: query
 *         name: quarter
 *         schema:
 *           type: integer
 *         description: Filter by quarter (1-4)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *     responses:
 *       200:
 *         description: Monthly expense data
 */
router.get("/expense", async (req, res) => {
  const { year, quarter, month } = req.query;
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const realData = allEntries.map((e) => e.attributes);
    const dummy = generateDummyEntries("expense");
    const combined = [...realData, ...dummy];
    const filtered = combined.filter((e) => isExpense(e.G_L_Account_Name));
    const timeFiltered = filterByTime(filtered, year, quarter, month);
    const monthly = groupByMonth(timeFiltered, "Debit_Amount");

    res.json({ type: "expense", data: monthly });
  } catch (err) {
    
    res.status(500).json({ error: "Failed to compute expense actuals" });
  }
});

/**
 * @swagger
 * /api/v1/finance-forecasting/net-income:
 *   get:
 *     summary: Get net income (revenue - expense) per month (includes dummy data)
 *     tags: [Finance Forecasting]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2022)
 *       - in: query
 *         name: quarter
 *         schema:
 *           type: integer
 *         description: Filter by quarter (1-4)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *     responses:
 *       200:
 *         description: Monthly net income data
 */
router.get("/net-income", async (req, res) => {
  const { year, quarter, month } = req.query;
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const realData = allEntries.map((e) => e.attributes);
    const dummyRevenue = generateDummyEntries("revenue");
    const dummyExpense = generateDummyEntries("expense");

    const allRevenues = [...realData, ...dummyRevenue].filter((e) =>
      isRevenue(e.G_L_Account_Name)
    );
    const allExpenses = [...realData, ...dummyExpense].filter((e) =>
      isExpense(e.G_L_Account_Name)
    );

    const filteredRev = filterByTime(allRevenues, year, quarter, month);
    const filteredExp = filterByTime(allExpenses, year, quarter, month);

    const revenues = groupByMonth(filteredRev, "Credit_Amount");
    const expenses = groupByMonth(filteredExp, "Debit_Amount");

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
 *     summary: Get cashflow (debit - credit) per month (includes dummy data)
 *     tags: [Finance Forecasting]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year (e.g. 2022)
 *       - in: query
 *         name: quarter
 *         schema:
 *           type: integer
 *         description: Filter by quarter (1-4)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *     responses:
 *       200:
 *         description: Monthly cashflow data
 */
router.get("/cashflow", async (req, res) => {
  const { year, quarter, month } = req.query;
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: "application/json",
      },
    });

    const allEntries = response.data.data || [];
    const realData = allEntries.map((e) => e.attributes);
    const dummy = generateDummyEntries("all");
    const combined = [...realData, ...dummy];
    const timeFiltered = filterByTime(combined, year, quarter, month);
    const monthly = groupCashFlow(timeFiltered);

    res.json({ type: "cashflow", data: monthly });
  } catch (err) {
    
    res.status(500).json({ error: "Failed to compute cashflow actuals" });
  }
});

export default router;
