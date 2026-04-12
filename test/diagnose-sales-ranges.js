import 'dotenv/config';
import axios from 'axios';

const BASE = `http://localhost:${process.env.PORT || 4000}`;
const EMAIL = (process.env.VITE_HEAD_OF_SALES_EMAIL || 'headofsales@vision.com').trim();
const PASSWORD = (process.env.VITE_HEAD_OF_SALES_PASSWORD || 'hos@vision2025').trim();

const DUMMY_IDS = new Set(['CUST001', 'EXP001', 'C009', 'CAMP001', 'P001', 'L001', 'C001', 'C002']);

const ranges = [
  { label: '2024 full year', start: '2024-01-01', end: '2024-12-31' },
  { label: '2025 Q1', start: '2025-01-01', end: '2025-04-30' },
  { label: '2025 Q3', start: '2025-07-01', end: '2025-09-30' },
  { label: '2025 full year', start: '2025-01-01', end: '2025-12-31' },
];

const endpoints = [
  { key: 'clv', path: (s,e) => `/api/v1/sales/client-lifetime-value/in-range?startDate=${s}&endDate=${e}` },
  { key: 'campaignRoi', path: (s,e) => `/api/v1/sales/campaign-roi?startDate=${s}&endDate=${e}` },
  { key: 'impressionShare', path: (s,e) => `/api/v1/sales/impression-shares?startDate=${s}&endDate=${e}` },
  { key: 'ctr', path: (s,e) => `/api/v1/sales/ctr/in-range?startDate=${s}&endDate=${e}` },
  { key: 'rateCard', path: (s,e) => `/api/v1/sales/rate-card-utilization?startDate=${s}&endDate=${e}` },
  { key: 'abTests', path: (s,e) => `/api/v1/sales/ab-tests?startDate=${s}&endDate=${e}` },
  { key: 'supervisorPipeline', path: (s,e) => `/api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity?startDate=${s}&endDate=${e}&page=1&pageSize=10` },
];

function extractArray(body) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.deals)) return body.deals;
  if (Array.isArray(body?.reps)) return body.reps;
  if (Array.isArray(body?.accounts)) return body.accounts;
  if (Array.isArray(body?.attribution)) return body.attribution;
  if (Array.isArray(body?.cplPerMonth)) return body.cplPerMonth;
  if (Array.isArray(body?.mergedContractValueTrends)) return body.mergedContractValueTrends;
  return null;
}

function classification(rows) {
  if (!rows) return 'object';
  if (rows.length === 0) return 'empty';
  const first = rows[0] || {};
  const ids = [first.customerId, first.experimentId, first.campaignId, first.placementId, first.leadId];
  return ids.some((id) => id && DUMMY_IDS.has(id)) ? 'fallback' : 'live';
}

async function req(url, headers) {
  try {
    const r = await axios.get(url, { headers, timeout: 30000 });
    const rows = extractArray(r.data);
    return { status: r.status, records: rows ? rows.length : null, class: classification(rows) };
  } catch (e) {
    return { status: e?.response?.status || 0, class: 'error', records: null };
  }
}

const login = await axios.post(`${BASE}/api/v1/auth/login`, { email: EMAIL, password: PASSWORD });
const headers = { Authorization: `Bearer ${login.data.token}`, 'X-Role-Code': login.data.role_code };

const out = { generatedAt: new Date().toISOString(), roleCode: login.data.role_code, ranges: [] };

for (const r of ranges) {
  const item = { label: r.label, start: r.start, end: r.end, results: {} };
  for (const ep of endpoints) {
    item.results[ep.key] = await req(`${BASE}${ep.path(r.start, r.end)}`, headers);
  }
  out.ranges.push(item);
}

console.log(JSON.stringify(out, null, 2));
