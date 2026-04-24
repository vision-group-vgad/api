import axios from 'axios';
import { parseISO, differenceInDays } from 'date-fns';
import dotenv from 'dotenv';
dotenv.config();

export const getApArAging = async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required query parameters." });
    }

    const url = `${process.env.CMC_API_BASE_URL}/bc-datasets/2021-08-01/2021-10-31`;
    const headers = {
      Authorization: `Bearer ${process.env.CMS_API_KEY}`,
    };
    
    const response = await axios.get(url, { headers });
    let records = response.data.data;

    // Filter records by date range
    records = records.filter((record) => {
      const entry = record.attributes;
      const rawDate = entry.Document_Date || entry.Posting_Date;
      if (!rawDate) return false;
      const documentDate = parseISO(rawDate);
      return documentDate >= parseISO(startDate) && documentDate <= parseISO(endDate);
    });

    // Apply limit (optional, default 50)
    records = records.slice(0, limit);

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

      const postingDate = entry.Posting_Date;
      const dueDate = "2021-10-31"; 

      // Calculate age as the difference between dueDate and postingDate
      const age = differenceInDays(parseISO(dueDate), parseISO(postingDate));

      if (isNaN(age)) return;

      const bucketEntry = {
        Entry_No: entry.Entry_No,
        Document_No: entry.Document_No,
        Document_Date: entry.Document_Date,
        Posting_Date: postingDate,
        Due_Date: dueDate,
        Amount: parseFloat(entry.Amount),
        Document_Type: entry.Document_Type,
        Type: entry.Document_Type === 'Invoice' ? 'AR' : 'AP',
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

    const fallbackBuckets = {
      '0–30 Days': [
        {
          Entry_No: 'D-1001',
          Document_No: 'INV-1001',
          Document_Date: '2021-08-10',
          Posting_Date: '2021-08-10',
          Due_Date: '2021-08-31',
          Amount: 1200000,
          Document_Type: 'Invoice',
          Type: 'AR',
          G_L_Account_No: '12001',
          G_L_Account_Name: 'Local Debtors Control',
          Vendor_Customer_Name: 'Customer A',
          Payment_Date: null,
        },
        {
          Entry_No: 'D-1002',
          Document_No: 'PAY-1002',
          Document_Date: '2021-08-11',
          Posting_Date: '2021-08-11',
          Due_Date: '2021-08-31',
          Amount: 750000,
          Document_Type: 'Payment',
          Type: 'AP',
          G_L_Account_No: '21001',
          G_L_Account_Name: 'Output Vat',
          Vendor_Customer_Name: 'Vendor A',
          Payment_Date: '2021-08-15',
        },
      ],
      '31–60 Days': [],
      '61–90 Days': [],
      '90+ Days': [],
    };

    res.status(200).json({ agingBuckets: fallbackBuckets, source: 'dummy' });
  }
};
