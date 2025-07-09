import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getBudgetVariance = async (req, res) => {
  try {
    const url = `${process.env.VGAD_API_BASE_URL}`;
    const headers = {
      Authorization: `Bearer ${process.env.VGAD_API_TOKEN}`,
    };

    const response = await axios.get(url, { headers });
    const records = response.data.data;

    const accountMap = {};

    records.forEach((record) => {
      const entry = record.attributes;
      const accNo = entry.G_L_Account_No;
      const accName = entry.G_L_Account_Name || 'Unknown';
      const amount = parseFloat(entry.Amount);
      const budget = parseFloat(entry.Budget_Allocation || 0);

      if (!accNo || isNaN(amount)) return;

      if (!accountMap[accNo]) {
        accountMap[accNo] = {
          G_L_Account_No: accNo,
          G_L_Account_Name: accName,
          actual: 0,
          budget: 0,
        };
      }

      accountMap[accNo].actual += amount;
      accountMap[accNo].budget = budget; // assumed same across all records for this account
    });

    const result = Object.values(accountMap).map(acc => ({
      ...acc,
      variance: acc.actual - acc.budget
    }));

    res.status(200).json({ variance: result });
  } catch (err) {
    console.error('🛑 Error fetching budget variance:', err.message);
    res.status(500).json({ error: 'Failed to retrieve budget variance data' });
  }
};
