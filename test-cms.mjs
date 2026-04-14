import 'dotenv/config';
import axios from 'axios';

const key = process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY;
const base = process.env.CMC_API_BASE_URL || 'https://cms-vgad.visiongroup.co.ug/api';

console.log('Base URL:', base);
console.log('Key set:', !!key, '| First 20 chars:', key?.substring(0, 20));

const SALES_PREFIXES = ['3'];
const SALES_KEYWORDS = ['sales','advert','revenue','subscription','printing','radio','tv','digital','website','bukedde','vision'];

function isSalesEntry(entry) {
  const accNo = `${entry.attributes?.G_L_Account_No || ''}`.trim();
  const fingerprint = [
    entry.attributes?.G_L_Account_Name,
    entry.attributes?.G_L_Account_No,
    entry.attributes?.Source_Code,
    entry.attributes?.Document_Type,
    entry.attributes?.Document_No,
    entry.attributes?.Business_Unit_Code,
  ].filter(Boolean).join(' ').toLowerCase();

  return SALES_PREFIXES.some(p => accNo.startsWith(p)) ||
         SALES_KEYWORDS.some(k => fingerprint.includes(k));
}

try {
  // fetch 500 records to get a realistic sample
  const r = await axios.get(`${base}/bc-datasets?pagination[pageSize]=500`, {
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  const data = r.data?.data || [];
  const total = r.data?.meta?.pagination?.total;
  console.log('HTTP STATUS:', r.status);
  console.log('Total records in CMS:', total);
  console.log('Records fetched:', data.length);

  const salesEntries = data.filter(isSalesEntry);
  console.log('Entries passing isSalesEntry filter:', salesEntries.length);

  if (salesEntries.length > 0) {
    console.log('\n--- Sample sales entries ---');
    salesEntries.slice(0, 3).forEach((e, i) => {
      console.log(`[${i+1}] AccNo=${e.attributes.G_L_Account_No} | Name=${e.attributes.G_L_Account_Name} | Amount=${e.attributes.Amount} | Date=${e.attributes.Posting_Date}`);
    });
  } else {
    console.log('\n⚠️  ZERO entries pass the sales filter — fallback to dummy WILL trigger');
    console.log('Sample account numbers:', [...new Set(data.slice(0,20).map(e => e.attributes?.G_L_Account_No))].join(', '));
    console.log('Sample account names:', [...new Set(data.slice(0,10).map(e => e.attributes?.G_L_Account_Name))].join(' | '));
  }
} catch (e) {
  console.log('ERROR status:', e.response?.status);
  console.log('ERROR body:', JSON.stringify(e.response?.data)?.substring(0, 300) || e.message);
}
