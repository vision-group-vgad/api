import axios from "axios";

// In-memory cache for batch fetches
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Dummy Data Generators ---
const accounts = [
  { accountNo: "10010", accountName: "H/O Cash Receipts Cont", region: "Central" },
  { accountNo: "10015", accountName: "Forex Cash Receipts", region: "Central" },
  { accountNo: "10030", accountName: "Soroti Cash Control", region: "Eastern" },
  { accountNo: "10050", accountName: "Mobile Money", region: "Kampala" },
  { accountNo: "10055", accountName: "Direct Credits Cash Control", region: "Central" },
  { accountNo: "10060", accountName: "Mbarara Cash Control", region: "Western" },
  { accountNo: "10070", accountName: "Gulu Cash Control", region: "Northern" },
  { accountNo: "10080", accountName: "Arua One Cash Control", region: "WestNile" },
  { accountNo: "10092", accountName: "Head Office Petty Cash", region: "Kampala" },
  { accountNo: "10260", accountName: "H/Q P/Cash Rec control", region: "Central" },
  { accountNo: "12001", accountName: "Local Debtors Control", region: "Central" },
  { accountNo: "21001", accountName: "Output Vat", region: "Central" },
  { accountNo: "22001", accountName: "Creditors Control-Local", region: "Central" },
  { accountNo: "30005", accountName: "New Vision Sales", region: "Central" },
  { accountNo: "30008", accountName: "Saturday Vision", region: "Central" },
  { accountNo: "30010", accountName: "Bukedde Newspaper Sales", region: "Central" },
  { accountNo: "30020", accountName: "Sunday Vision Sales", region: "Central" },
  { accountNo: "30068", accountName: "Saturday Adv. Sales", region: "Central" },
  { accountNo: "30070", accountName: "New Vision Advertising Revenue", region: "Central" },
  { accountNo: "30102", accountName: "Etop Radio Revenue", region: "Eastern" },
  { accountNo: "30117", accountName: "Radio west Advertising Rev.", region: "Western" },
  { accountNo: "30124", accountName: "Commercial Printing Revenue", region: "Central" },
  { accountNo: "30150", accountName: "Website Advertising Revenue", region: "Central" },
  { accountNo: "44245", accountName: "Meeting Expenses", region: "Central" },
  { accountNo: "44380", accountName: "Internet & Subscription", region: "Central" },
  { accountNo: "44490", accountName: "Discount on Adverts", region: "Central" },
  { accountNo: "44510", accountName: "Newspaper Discount", region: "Central" },
  { accountNo: "44640", accountName: "Consumables used", region: "Central" },
  { accountNo: "60030", accountName: "Office Tea", region: "Central" },
  { accountNo: "60280", accountName: "Meeting Expenses", region: "Central" },
  { accountNo: "61010", accountName: "Motor Vehicle Run", region: "Central" }
];

const regions = ["Central", "WestNile", "Western", "Kampala", "Eastern", "Northern"];
const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed-Won", "Closed-Lost"];
const reps = [
  { rep_id: "rep01", rep_name: "Alice", region: "Central" },
  { rep_id: "rep02", rep_name: "Bob", region: "Kampala" },
  { rep_id: "rep03", rep_name: "Carol", region: "Eastern" },
  { rep_id: "rep04", rep_name: "David", region: "WestNile" },
  { rep_id: "rep05", rep_name: "Eve", region: "Western" }
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (month, year) => {
  const day = rand(1, 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const generatePipelineVelocityData = () => {
  const months = [
    { month: 6, year: 2025 },
    { month: 7, year: 2025 },
    { month: 8, year: 2025 }
  ];
  let deals = [];
  for (let i = 0; i < 60; i++) {
    const stageIdx = rand(0, stages.length - 1);
    const stage = stages[stageIdx];
    const account = accounts[rand(0, accounts.length - 1)];
    const owner = reps[rand(0, reps.length - 1)];
    const m = months[rand(0, months.length - 1)];
    const entry_date = randomDate(m.month, m.year);
    const exit_date = randomDate(m.month, m.year);
    deals.push({
      deal_id: `D${1000 + i}`,
      stage,
      entry_date,
      exit_date,
      deal_value: rand(1000000, 10000000),
      owner: owner.rep_name,
      region: owner.region,
      product: account.accountName
    });
  }
  return deals;
};

const generateQuotaAttainmentData = () => {
  const periods = ["2025-06", "2025-07", "2025-08"];
  let repsData = [];
  reps.forEach(rep => {
    periods.forEach(period => {
      repsData.push({
        rep_id: rep.rep_id,
        rep_name: rep.rep_name,
        target_quota: rand(5000000, 20000000),
        achieved_revenue: rand(2000000, 22000000),
        period,
        region: rep.region
      });
    });
  });
  return repsData;
};

const generateAccountPenetrationData = () => {
  let accountsData = [];
  accounts.forEach(acc => {
    accountsData.push({
      account_id: acc.accountNo,
      account_name: acc.accountName,
      total_opportunities: rand(2, 15),
      active_opportunities: rand(0, 10),
      contacts_engaged: rand(1, 12),
      account_revenue: rand(1000000, 20000000),
      account_size: rand(5000000, 30000000),
      industry: ["Media", "Finance", "Retail", "NGO"][rand(0, 3)],
      region: acc.region
    });
  });
  return accountsData;
};

const generateCorporateAccountHealthData = () => {
  let accountsData = [];
  accounts.forEach(acc => {
    const revenue_trend = Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${String(i + 1).padStart(2, "0")}`,
      revenue: rand(500000, 3000000)
    }));
    accountsData.push({
      account_id: acc.accountNo,
      account_name: acc.accountName,
      revenue_trend,
      support_tickets: { open: rand(0, 5), closed: rand(1, 20) },
      NPS_score: rand(1, 10),
      churn_risk: ["Low", "Medium", "High"][rand(0, 2)],
      last_interaction_date: randomDate(rand(6, 8), 2025),
      assigned_manager: reps[rand(0, reps.length - 1)].rep_name,
      region: acc.region,
      account_size: rand(5000000, 30000000)
    });
  });
  return accountsData;
};

class SupervisorSalesAnalyticsService {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    this.baseURL = process.env.CMC_API_BASE_URL || "https://cms-vgad.visiongroup.co.ug/api";
    this.bearerToken = process.env.CMC_API_BEARER_TOKEN;
    this.credentials = {
      username: process.env.CMC_API_USERNAME || "intern-developer@newvision.co.ug",
      password: process.env.CMC_API_PASSWORD || "45!3@Vgad2025",
    };

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    this.setupAuthentication();
    this.initialized = true;
    console.log("🔧 [Sales Service] SupervisorSalesAnalyticsService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 [sales service] Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 [sales service] Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [sales service] IT API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // --- Pipeline Velocity ---
  async fetchPipelineVelocity(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/pipeline-velocity', { params: filters });
    // return response.data;

    // Dummy data fallback
    let deals = generatePipelineVelocityData();
    const { stage, owner, region, product, page = 1, pageSize = 10 } = filters;
    if (stage) deals = deals.filter(d => d.stage === stage);
    if (owner) deals = deals.filter(d => d.owner === owner);
    if (region) deals = deals.filter(d => d.region === region);
    if (product) deals = deals.filter(d => d.product === product);

    const totalCount = deals.length;
    const startIdx = (page - 1) * pageSize;
    const paged = deals.slice(startIdx, startIdx + pageSize);

    return { deals: paged, totalCount };
  }

  async getPipelineVelocityKPIs(_filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/pipeline-velocity/kpis', { params: filters });
    // return response.data;

    let deals = generatePipelineVelocityData();
    const avgDaysPerStage = {};
    stages.forEach(stage => {
      const stageDeals = deals.filter(d => d.stage === stage);
      if (stageDeals.length) {
        avgDaysPerStage[stage] = rand(2, 15);
      }
    });
    const totalPipelineValue = {};
    stages.forEach(stage => {
      totalPipelineValue[stage] = deals.filter(d => d.stage === stage).reduce((sum, d) => sum + d.deal_value, 0);
    });
    const stageConversionRates = {};
    for (let i = 1; i < stages.length; i++) {
      const prev = deals.filter(d => d.stage === stages[i - 1]).length;
      const curr = deals.filter(d => d.stage === stages[i]).length;
      stageConversionRates[`${stages[i - 1]}→${stages[i]}`] = prev ? Math.round((curr / prev) * 100) : 0;
    }
    return { avgDaysPerStage, totalPipelineValue, stageConversionRates };
  }

  // --- Quota Attainment ---
  async fetchQuotaAttainment(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/quota-attainment', { params: filters });
    // return response.data;

    let repsData = generateQuotaAttainmentData();
    const { rep_id, region, period, page = 1, pageSize = 10 } = filters;
    if (rep_id) repsData = repsData.filter(r => r.rep_id === rep_id);
    if (region) repsData = repsData.filter(r => r.region === region);
    if (period) repsData = repsData.filter(r => r.period === period);

    const totalCount = repsData.length;
    const startIdx = (page - 1) * pageSize;
    const paged = repsData.slice(startIdx, startIdx + pageSize);

    return { reps: paged, totalCount };
  }

  async getQuotaAttainmentKPIs(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/quota-attainment/kpis', { params: filters });
    // return response.data;

    let repsData = generateQuotaAttainmentData();
    const quotaAchieved = repsData.map(r => ({
      rep_id: r.rep_id,
      rep_name: r.rep_name,
      percent_achieved: Math.round((r.achieved_revenue / r.target_quota) * 100)
    }));
    const leaderboard = [...quotaAchieved].sort((a, b) => b.percent_achieved - a.percent_achieved);
    const trend = {};
    repsData.forEach(r => {
      if (!trend[r.period]) trend[r.period] = { target: 0, achieved: 0 };
      trend[r.period].target += r.target_quota;
      trend[r.period].achieved += r.achieved_revenue;
    });
    return { quotaAchieved, leaderboard, trend };
  }

  // --- Account Penetration ---
  async fetchAccountPenetration(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/account-penetration', { params: filters });
    // return response.data;

    let accountsData = generateAccountPenetrationData();
    const { industry, region, account_size, page = 1, pageSize = 10 } = filters;
    if (industry) accountsData = accountsData.filter(a => a.industry === industry);
    if (region) accountsData = accountsData.filter(a => a.region === region);
    if (account_size) accountsData = accountsData.filter(a => a.account_size >= Number(account_size));

    const totalCount = accountsData.length;
    const startIdx = (page - 1) * pageSize;
    const paged = accountsData.slice(startIdx, startIdx + pageSize);

    return { accounts: paged, totalCount };
  }

  async getAccountPenetrationKPIs(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/account-penetration/kpis', { params: filters });
    // return response.data;

    let accountsData = generateAccountPenetrationData();
    const percentActive = Math.round((accountsData.filter(a => a.active_opportunities > 0).length / accountsData.length) * 100);
    const sortedByRevenue = [...accountsData].sort((a, b) => b.account_revenue - a.account_revenue);
    const top10Revenue = sortedByRevenue.slice(0, 10).reduce((sum, a) => sum + a.account_revenue, 0);
    const totalRevenue = accountsData.reduce((sum, a) => sum + a.account_revenue, 0);
    const revenueConcentration = totalRevenue ? Math.round((top10Revenue / totalRevenue) * 100) : 0;
    return { percentActive, revenueConcentration };
  }

  // --- Corporate Account Health ---
  async fetchCorporateAccountHealth(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/corporate-account-health', { params: filters });
    // return response.data;

    let accountsData = generateCorporateAccountHealthData();
    const { account_manager, region, account_size, health_status, page = 1, pageSize = 10 } = filters;
    if (account_manager) accountsData = accountsData.filter(a => a.assigned_manager === account_manager);
    if (region) accountsData = accountsData.filter(a => a.region === region);
    if (account_size) accountsData = accountsData.filter(a => a.account_size >= Number(account_size));
    if (health_status) accountsData = accountsData.filter(a => a.churn_risk === health_status);

    const totalCount = accountsData.length;
    const startIdx = (page - 1) * pageSize;
    const paged = accountsData.slice(startIdx, startIdx + pageSize);

    return { accounts: paged, totalCount };
  }

  async getCorporateAccountHealthKPIs(filters = {}) {
    // Uncomment below when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/corporate-account-health/kpis', { params: filters });
    // return response.data;

    let accountsData = generateCorporateAccountHealthData();
    const healthScores = accountsData.map(a => ({
      account_id: a.account_id,
      account_name: a.account_name,
      health_score: Math.round(
        (a.NPS_score * 10 + (a.revenue_trend.reduce((sum, r) => sum + r.revenue, 0) / 12) / 100000 +
          (a.churn_risk === "Low" ? 30 : a.churn_risk === "Medium" ? 15 : 0))
      )
    }));
    const highChurn = accountsData.filter(a => a.churn_risk === "High").length;
    const percentHighChurn = Math.round((highChurn / accountsData.length) * 100);
    return { healthScores, percentHighChurn };
  }
}

export default new SupervisorSalesAnalyticsService();