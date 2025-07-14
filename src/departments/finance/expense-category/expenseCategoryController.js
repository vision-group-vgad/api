import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getExpenseCategories = async (req, res) => {
  try {
    const url = `${process.env.VGAD_API_BASE_URL}`;
    const headers = {
      Authorization: `Bearer ${process.env.VGAD_API_TOKEN}`,
    };

    const response = await axios.get(url, { headers });
    const records = response.data.data;
    // const categoryFilter = req.query.category;

    const categorized = {};

    records.forEach((record) => {
      const entry = record.attributes;
      const amount = parseFloat(entry.Amount);

      // Assume Expense_Category is coming directly from API
      const category = entry.Expense_Category || 'Uncategorized';
      const accountName = entry.G_L_Account_Name || 'Unknown';

      if (isNaN(amount) || amount <= 0) return;

      // Apply category filter if present
      if (categoryFilter && category !== categoryFilter) return;

      if (!categorized[category]) {
        categorized[category] = { total: 0, accounts: new Set() };
      }

      categorized[category].total += amount;
      categorized[category].accounts.add(accountName);
    });

    const result = Object.entries(categorized).map(([category, data]) => ({
      category,
      total: data.total,
      accounts: Array.from(data.accounts),
    }));

    res.status(200).json({ categories: result });
  } catch (err) {
    console.error('🛑 Error fetching categorized expenses:', err.message);
    res.status(500).json({ error: 'Failed to retrieve categorized expenses' });
  }
};
