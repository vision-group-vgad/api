import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// 🔸 Hardcoded budget allocations (example values)
const hardcodedBudgets = {
  "10010": 60000000, // H/O Cash Receipts Cont (was missing)
  "10030": 40000000, // Soroti Cash Control (was missing)
  "10060": 50000000, // Mbarara Cash Control
  "10070": 30000000, // Gulu Cash Control (was missing)
  "12001": 70000000, // Local Debtors Control (was missing)
  "21001": 10000000, // Output Vat (was missing)
  "30010": 12000000, // Bukedde Newspaper Sales (was missing)
  "30102": 5000000,  // Etop Radio Revenue (was missing)
  "30124": 30000000, // Commercial Printing Revenue (was missing)
  "44490": 15000000, // Discount on Adverts (previously under 40030; updated key)
  "10061": 60000000, // Already included
  "10062": 40000000,
  "10063": 30000000,
  "20010": 70000000,
  "30020": 10000000,
  "40030": 15000000,
  "50040": 5000000,
  "60050": 8000000,
  "70060": 2000000,
  "80070": 3000000,
  "90080": 1000000,
  "90090": 750000,
  "90100": 400000,
  "90110": 10000000,
  "90120": 12000000,
  "90130": 6000000,
  "90140": 3500000,
  "90150": 8000000,
  "90160": 300000
};

export const getBudgetVariance = async (req, res) => {

  try {
    
  const { startDate, endDate, accountName } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required query parameters." });
    }

    const url = `${process.env.CMC_API_BASE_URL}/bc-datasets/${startDate}/${endDate}`;
    const headers = {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    };


    const response = await axios.get(url, { headers });
    let records = response.data.data;

    // Optional filter by accountName (case insensitive partial match)
    if (accountName) {
      const lowerName = accountName.toLowerCase();
      records = records.filter(r => {
        const name = r.attributes.G_L_Account_Name || '';
        return name.toLowerCase().includes(lowerName);
      });
    }

    const accountMap = {};

    records.forEach((record) => {
      const entry = record.attributes;
      const accNo = entry.G_L_Account_No;
      const accName = entry.G_L_Account_Name || 'Unknown';
      const amount = parseFloat(entry.Amount);

      if (!accNo || isNaN(amount)) return;

      if (!accountMap[accNo]) {
        accountMap[accNo] = {
          G_L_Account_No: accNo,
          G_L_Account_Name: accName,
          actual: 0,
          budget: hardcodedBudgets[accNo] || 0
        };
      }

      accountMap[accNo].actual += amount;
    });

    const result = Object.values(accountMap).map(acc => ({
      ...acc,
      variance: acc.budget - acc.actual
    }));

    res.status(200).json({ variance: result });
  } catch (err) {
    console.error('🛑 Error fetching budget variance:', err.message);

    // Fallback: keep dashboard alive with deterministic dummy data
    const fallback = Object.entries(hardcodedBudgets).map(([accNo, budget]) => {
      const actual = Math.round(budget * 0.92);
      return {
        G_L_Account_No: accNo,
        G_L_Account_Name: `Account ${accNo}`,
        actual,
        budget,
        variance: budget - actual,
      };
    });

    res.status(200).json({ variance: fallback, source: 'dummy' });
  }
};
