import axios from 'axios';
import { parseISO } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

// Default budgets for each account
const defaultBudgets = {
  'Mbarara Cash Control': 100000,
  'H/O Cash Receipts Cont': 100000,
  'Soroti Cash Control': 100000,
  'Gulu Cash Control': 100000,
  'Local Debtors Control': 100000,
  'Output Vat': 100000,
  'Discount on Adverts': 100000,
  'Forex Cash Receipts': 100000,
  'Newspaper Discount': 100000,
  'Meeting Expenses': 100000,
  'Arua One Cash Control': 100000,
  'Direct Credits Cash Control': 100000,
  'Mobile Money': 100000,
  'Motor Vehicle Run': 100000,
  'Consumables used': 100000,
  'Office Tea': 100000,
  'Commission Payable': 100000,
  'Input Vat': 100000,
  'Stanbic Kampala': 100000,
  'H/Q P/Cash Rec control': 100000,
  'Out Sourcing Expenses': 100000,
  'Other Provisions': 100000,
  'Discount on Printing': 100000,
  'Radio west Advertising Rev.': 100000,
  'Unknown': 50000
};

export const getExpenseCategories = async (req, res) => {
  try {
    const { startDate, endDate, limit = 25000, category: categoryFilter } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required query parameters.' });
    }

    const url = `${process.env.VGAD_API_BASE_URL}`;
    const headers = {
      Authorization: `Bearer ${process.env.VGAD_API_TOKEN}`,
    };

    const response = await axios.get(url, { headers });
    let records = response.data.data;

    // Filter records within date range
    records = records.filter((record) => {
      const entry = record.attributes;
      const rawDate = entry.Document_Date || entry.Posting_Date;
      if (!rawDate) return false;
      const documentDate = parseISO(rawDate);
      return documentDate >= parseISO(startDate) && documentDate <= parseISO(endDate);
    });

    // Apply limit only if limit > 0
    if (limit > 0) {
      records = records.slice(0, limit);
    }

    const categorized = {};

    records.forEach((record) => {
      const entry = record.attributes;
      const amount = parseFloat(entry.Amount);
      const category = entry.Expense_Category || 'Uncategorized';
      const accountName = entry.G_L_Account_Name || 'Unknown';

      if (isNaN(amount) || amount <= 0) return;
      if (categoryFilter && category !== categoryFilter) return;

      if (!categorized[category]) {
        categorized[category] = { total: 0, accounts: new Set() };
      }

      categorized[category].total += amount;
      categorized[category].accounts.add(accountName);
    });

    const result = Object.entries(categorized).map(([category, data]) => {
      const accounts = Array.from(data.accounts);
      return {
        category,
        total: data.total,
        accounts: accounts.map((accountName) => ({
          name: accountName,
          budget: defaultBudgets[accountName] || defaultBudgets['Unknown'],
        })),
      };
    });

    res.status(200).json({ categories: result });
  } catch (err) {
    console.error('🛑 Error fetching categorized expenses:', err.message);
    res.status(500).json({ error: 'Failed to retrieve categorized expenses' });
  }
};
