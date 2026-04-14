import axios from 'axios';
import dotenv from 'dotenv';
import { parseISO } from 'date-fns';
dotenv.config();

const Expense_Category_Map = {
  "Mbarara Cash Control": "Cash Control",
  "H/O Cash Receipts Cont": "Cash Control",
  "Soroti Cash Control": "Cash Control",
  "Gulu Cash Control": "Cash Control",
  "Local Debtors Control": "Receivables",
  "Output Vat": "Tax",
  "Discount on Adverts": "Marketing & Advertising",
  "Forex Cash Receipts": "Foreign Exchange",
  "Newspaper Discount": "Revenue Adjustments",
  "Meeting Expenses": "Meetings & Events",
  "Arua One Cash Control": "Cash Control",
  "Direct Credits Cash Control": "Cash Control",
  "Mobile Money": "Cash Control",
  "Motor Vehicle Run": "Transport & Fuel",
  "Consumables used": "Office Supplies",
  "Office Tea": "Staff Welfare",
  "Commission Payable": "Commissions",
  "Input Vat": "Tax",
  "Stanbic Kampala": "Bank Accounts",
  "H/Q P/Cash Rec control": "Cash Control",
  "Out Sourcing Expenses": "Consultancy & Outsourcing",
  "Other Provisions": "Provisions & Accruals",
  "Discount on Printing": "Revenue Adjustments",
  "Radio west Advertising Rev.": "Marketing Revenue"
};

export const getExpenseCategories = async (req, res) => {
  try {
    const { startDate, endDate, limit = 25000, category: categoryFilter } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required query parameters." });
    }

    const url = `${process.env.CMC_API_BASE_URL}/bc-datasets/${startDate}/${endDate}`;
    const headers = {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    };

    const response = await axios.get(url, { headers });
    let records = response.data.data;

    // Filter by date
    records = records
      .filter((record) => {
        const entry = record.attributes;
        const rawDate = entry.Document_Date || entry.Posting_Date;
        if (!rawDate) return false;
        const documentDate = parseISO(rawDate);
        return documentDate >= parseISO(startDate) && documentDate <= parseISO(endDate);
      })
      .slice(0, limit);

    // Total sum of all valid amounts (regardless of category)
    let totalAmount = 0;
    const categorized = {};
    const transactions = [];

    records.forEach((record) => {
      const entry = record.attributes;
      const amount = parseFloat(entry.Amount);
      if (isNaN(amount) || amount <= 0) return;

      const accountName = entry.G_L_Account_Name || 'Unknown';
      const accountNo = entry.G_L_Account_No || 'Unknown';
      const category = Expense_Category_Map[accountName] || 'Uncategorized';

      totalAmount += amount;

      if (!categoryFilter || category === categoryFilter) {
        // Add to category breakdown
        if (!categorized[category]) {
          categorized[category] = { total: 0, accounts: new Set() };
        }
        categorized[category].total += amount;
        categorized[category].accounts.add(accountName);

        // Add to transactions table
        transactions.push({
          entryNo: entry.Entry_No,
          transactionNo: entry.Transaction_No,
          postingDate: entry.Posting_Date,
          documentDate: entry.Document_Date,
          documentType: entry.Document_Type,
          documentNo: entry.Document_No,
          sourceCode: entry.Source_Code,
          amount: amount,
          accountName: accountName,
          accountNo: accountNo,
          category: category
        });
      }
    });

    const result = Object.entries(categorized).map(([category, data]) => ({
      category,
      total: Math.round(data.total),
      accounts: Array.from(data.accounts),
    }));

    res.status(200).json({
      totalAmount: Math.round(totalAmount),
      categories: result,
      transactions
    });

  } catch (err) {
    console.error('🛑 Error fetching categorized expenses:', err.message);
    res.status(500).json({ error: 'Failed to retrieve categorized expenses' });
  }
};
