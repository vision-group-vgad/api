import axios from 'axios';
import { parseISO, differenceInDays, addDays } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

export const getApArAging = async (req, res) => {
  try {
    const url = `${process.env.VGAD_API_BASE_URL}`;
    const headers = {
      Authorization: `Bearer ${process.env.VGAD_API_TOKEN}`,
    };

    const response = await axios.get(url, { headers });
    const records = response.data.data;

    const agingBuckets = {
      '0–30 Days': [],
      '31–60 Days': [],
      '61–90 Days': [],
      '90+ Days': [],
    };

    records.forEach((record) => {
      const entry = record.attributes;
      const docType = entry.Document_Type;

      if (!['Invoice', 'Payment'].includes(docType)) return;

      const rawDate = entry.Document_Date || entry.Posting_Date;
      if (!rawDate) return;

      const documentDate = parseISO(rawDate);
      const dueDate = addDays(documentDate, 30); // simulate due date
      const age = differenceInDays(new Date(), dueDate);

      if (isNaN(age)) return;

      const bucketEntry = {
        Entry_No: entry.Entry_No,
        Document_No: entry.Document_No,
        Document_Date: entry.Document_Date,
        Posting_Date: entry.Posting_Date,
        Due_Date: dueDate.toISOString().split('T')[0], // simulated
        Amount: parseFloat(entry.Amount),
        Document_Type: entry.Document_Type,
        G_L_Account_No: entry.G_L_Account_No,
        G_L_Account_Name: entry.G_L_Account_Name || 'Unknown',
        Vendor_Customer_Name: 'Unknown', // ❌ missing from API
        Payment_Date: null // ❌ missing from API
      };

      if (age <= 30) agingBuckets['0–30 Days'].push(bucketEntry);
      else if (age <= 60) agingBuckets['31–60 Days'].push(bucketEntry);
      else if (age <= 90) agingBuckets['61–90 Days'].push(bucketEntry);
      else agingBuckets['90+ Days'].push(bucketEntry);
    });

    res.status(200).json({ agingBuckets });
  } catch (err) {
    console.error('🛑 Error fetching AP/AR aging data:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('No response received. Request:', err.request);
    } else {
      console.error('Error details:', err);
    }
    console.error('Stack trace:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve AP/AR aging data' });
  }
};
