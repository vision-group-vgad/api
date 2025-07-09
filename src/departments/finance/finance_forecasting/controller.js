import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';

const router = express.Router();

const CMS_API_URL = process.env.VGAD_API_BASE_URL || "https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-01-01/2021-12-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

// Utility function to format date to YYYY-MM
const formatMonth = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM');
};

// Forecast Preview Route
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        Accept: 'application/json'
      },
      timeout: 30000
    });

    const allEntries = response.data.data;
    console.log(`Total entries fetched: ${allEntries.length}`);

    // Filter for revenue-related entries 
    const revenueEntries = allEntries.filter(entry => {
      const name = entry.attributes.G_L_Account_Name?.toLowerCase() || '';
      return name.includes('sales') || name.includes('revenue');
    });

    // Aggregate by month
    const monthlyRevenue = {};

    revenueEntries.forEach(entry => {
      const date = entry.attributes.Posting_Date;
      const month = formatMonth(date);
      const amount = parseFloat(entry.attributes.Amount || '0');

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }

      monthlyRevenue[month] += amount;
    });

    const formattedResults = Object.entries(monthlyRevenue).map(([month, totalAmount]) => ({
      month,
      totalAmount: parseFloat((totalAmount).toFixed(2))
    })).sort((a, b) => a.month.localeCompare(b.month));

    res.json({ source: 'live', data: formattedResults });
  } catch (error) {
    console.error('Forecast Error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

export default router;
