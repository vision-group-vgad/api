// finance/FinanceService.js
// Service layer for Financial data analysis

import axios from "axios";
import pkg from "lodash";
const { groupBy } = pkg;

class FinanceService {
  constructor() {
    // Defer API client creation until first use
    this.apiClient = null;
    this.initialized = false;
  }

  // Initialize the service with environment variables
  initialize() {
    if (this.initialized) return;

    // CMC API configuration from environment variables
    this.baseURL =
      process.env.CMC_API_BASE_URL || "https://cms-vgad.visiongroup.co.ug/api";
    this.bearerToken = process.env.CMC_API_BEARER_TOKEN;
    this.credentials = {
      username:
        process.env.CMC_API_USERNAME || "intern-developer@newvision.co.ug",
      password: process.env.CMC_API_PASSWORD || "45!3@Vgad2025",
    };

    console.log("🔧 FinanceService initialized with:");
    console.log("📍 Base URL:", this.baseURL);
    console.log("🔑 Bearer Token:", this.bearerToken ? "Present" : "Missing");
    console.log("👤 Username:", this.credentials.username);

    // Create axios instance
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 15000, // 15 second timeout for financial data
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupAuthentication();
    this.initialized = true;
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      // Use Bearer token if available, otherwise fall back to Basic auth
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
        console.log("🔐 Using Bearer token authentication");
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
        console.log("🔐 Using Basic authentication");
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "Finance API Error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );
  }

  // Transform CMC API data structure for processing
  transformCMCData(apiData) {
    if (!Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((entry) => ({
      // Primary identifiers
      id: entry.id,
      entryNo: entry.attributes.Entry_No,
      transactionNo: entry.attributes.Transaction_No,

      // Account information
      accountNo: entry.attributes.G_L_Account_No,
      accountName: entry.attributes.G_L_Account_Name,

      // Dates
      postingDate: entry.attributes.Posting_Date,
      documentDate: entry.attributes.Document_Date,

      // Document details
      documentType: entry.attributes.Document_Type,
      documentNo: entry.attributes.Document_No,
      sourceCode: entry.attributes.Source_Code,

      // Financial amounts
      amount: entry.attributes.Amount,
      debitAmount: entry.attributes.Debit_Amount,
      creditAmount: entry.attributes.Credit_Amount,
      vatAmount: entry.attributes.VAT_Amount,
      additionalCurrencyAmount: entry.attributes.Additional_Currency_Amount,
      addCurrencyDebitAmount: entry.attributes.Add_Currency_Debit_Amount,
      addCurrencyCreditAmount: entry.attributes.Add_Currency_Credit_Amount,

      // Business and posting groups
      genPostingType: entry.attributes.Gen_Posting_Type,
      genBusPostingGroup: entry.attributes.Gen_Bus_Posting_Group,
      genProdPostingGroup: entry.attributes.Gen_Prod_Posting_Group,
      vatBusPostingGroup: entry.attributes.VAT_Bus_Posting_Group,
      vatProdPostingGroup: entry.attributes.VAT_Prod_Posting_Group,

      // Tax information
      taxAreaCode: entry.attributes.Tax_Area_Code,
      taxLiable: entry.attributes.Tax_Liable,
      taxGroupCode: entry.attributes.Tax_Group_Code,
      useTax: entry.attributes.Use_Tax,

      // Additional fields
      jobNo: entry.attributes.Job_No,
      businessUnitCode: entry.attributes.Business_Unit_Code,
      reasonCode: entry.attributes.Reason_Code,
      icPartnerCode: entry.attributes.IC_Partner_Code,
      dimensionSetId: entry.attributes.Dimension_Set_ID,
      locale: entry.attributes.locale,

      // Keep the original raw data for reference
      raw: entry.attributes,
    }));
  }

  // Fetch raw financial data from CMC
  async getFinancialData(filters = {}) {
    this.initialize(); // Ensure service is initialized with env vars

    try {
      console.log("🔍 getFinancialData called with filters:", filters);

      let endpoint = "/bc-datasets";

      // Use date range in URL if both dates provided
      if (filters.startDate && filters.endDate) {
        endpoint = `/bc-datasets/${filters.startDate}/${filters.endDate}`;
      }

      // Build query parameters for filtering
      const params = this.buildFilterParams(filters);
      console.log("🌐 API endpoint:", endpoint);
      console.log("🌐 API params:", params);

      const response = await this.apiClient.get(endpoint, { params });

      // Extract data from the response structure
      const data = response.data.data || [];

      console.log(`✅ Fetched ${data.length} financial records from CMC API`);

      // Transform the data to match your filter requirements
      const transformedData = this.transformCMCData(data);
      console.log(`🔄 Transformed ${transformedData.length} records`);
      console.log(
        "📊 Sample transformed data:",
        JSON.stringify(transformedData[0], null, 2)
      );

      return transformedData;
    } catch (error) {
      console.warn(
        "⚠️ Using dummy financial data - API not available:",
        error.message
      );
      return this.getDummyFinancialData();
    }
  }

  // Build query parameters for API filtering
  buildFilterParams(filters) {
    const params = {};

    // Don't add date params if using date range in URL
    if (filters.startDate && filters.endDate) {
      // Dates are in the URL path, not query params
    } else {
      // Use query params for date filtering
      if (filters.startDate) {
        params.posting_date_start = filters.startDate;
      }
      if (filters.endDate) {
        params.posting_date_end = filters.endDate;
      }
    }

    if (filters.accountNo) {
      params.gl_account_no = filters.accountNo;
    }
    if (filters.documentType) {
      params.document_type = filters.documentType;
    }
    if (filters.limit) {
      params.limit = filters.limit;
    }

    return params;
  }

  // Get unique G/L Account names for dropdown filters
  async getGLAccountNames() {
    this.initialize(); // Ensure service is initialized with env vars

    try {
      console.log("🔍 Fetching G/L Account names for dropdown");

      // Fetch recent data to get account names (limit to avoid large response)
      const response = await this.apiClient.get("/bc-datasets", {
        params: { limit: 10000 }, // Get enough records to capture most accounts
      });

      const data = response.data.data || [];
      console.log(`✅ Fetched ${data.length} records for account names`);

      // Extract unique account combinations
      const accountsMap = new Map();

      data.forEach((entry) => {
        const accountNo = entry.attributes.G_L_Account_No;
        const accountName = entry.attributes.G_L_Account_Name;

        if (accountNo && accountName && !accountsMap.has(accountNo)) {
          accountsMap.set(accountNo, {
            accountNo: accountNo,
            accountName: accountName,
            displayName: `${accountNo} - ${accountName}`,
          });
        }
      });

      // Convert to array and sort by account number
      const accounts = Array.from(accountsMap.values()).sort((a, b) =>
        a.accountNo.localeCompare(b.accountNo)
      );

      console.log(`📊 Found ${accounts.length} unique G/L accounts`);
      return accounts;
    } catch (error) {
      console.warn(
        "⚠️ Using dummy account names - API not available:",
        error.message
      );
      return this.getDummyAccountNames();
    }
  }

  // Get unique document types for dropdown filters
  async getDocumentTypes() {
    this.initialize(); // Ensure service is initialized with env vars

    try {
      console.log("🔍 Fetching document types for dropdown");

      const response = await this.apiClient.get("/bc-datasets", {
        params: { limit: 5000 },
      });

      const data = response.data.data || [];
      console.log(`✅ Fetched ${data.length} records for document types`);

      // Extract unique document types
      const typesSet = new Set();

      data.forEach((entry) => {
        const docType = entry.attributes.Document_Type;
        if (docType) {
          typesSet.add(docType);
        }
      });

      const documentTypes = Array.from(typesSet)
        .sort()
        .map((type) => ({
          value: type,
          label: type,
          displayName: type,
        }));

      console.log(`📊 Found ${documentTypes.length} unique document types`);
      return documentTypes;
    } catch (error) {
      console.warn(
        "⚠️ Using dummy document types - API not available:",
        error.message
      );
      return this.getDummyDocumentTypes();
    }
  }

  // 1. FINANCIAL CLOSE METRICS
  async getFinancialCloseMetrics(filters = {}) {
    this.initialize(); // Ensure service is initialized with env vars
    try {
      console.log("🔍 Getting Financial Close Metrics with filters:", filters);

      const rawData = await this.getFinancialData(filters);
      console.log(`📊 Processing ${rawData.length} records for close metrics`);

      return this.calculateCloseMetrics(rawData, filters);
    } catch (error) {
      console.warn("Using dummy close metrics due to error:", error.message);
      return this.getDummyCloseMetrics();
    }
  }

  calculateCloseMetrics(data, filters = {}) {
    console.log("🔄 Calculating close metrics with enhanced granularity");

    const granularity = filters.granularity || "monthly";
    console.log(`📈 Using ${granularity} granularity`);

    // Group transactions by period using lodash groupBy
    const grouped = groupBy(data, (entry) => {
      const dateStr = entry.postingDate;
      if (!dateStr) return "Unknown";

      const date = new Date(dateStr);

      switch (granularity) {
        case "daily":
          return date.toISOString().slice(0, 10); // e.g., 2021-08-10
        case "weekly": {
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          return startOfWeek.toISOString().slice(0, 10);
        }
        case "quarterly": {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          return `${date.getFullYear()}-Q${quarter}`;
        }
        case "yearly":
          return `${date.getFullYear()}`;
        case "monthly":
        default:
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`; // e.g., 2021-08
      }
    });

    console.log(`📊 Grouped data into ${Object.keys(grouped).length} periods`);

    // Process enhanced metrics per period
    const metrics = Object.entries(grouped).map(([period, entries]) => {
      const amounts = entries.map((e) => parseFloat(e.amount || 0));
      const debits = entries.map((e) => parseFloat(e.debitAmount || 0));
      const credits = entries.map((e) => parseFloat(e.creditAmount || 0));

      const totalAmount = amounts.reduce((sum, a) => sum + a, 0);
      const totalDebits = debits.reduce((sum, d) => sum + d, 0);
      const totalCredits = credits.reduce((sum, c) => sum + c, 0);

      const averageAmount =
        amounts.length > 0 ? totalAmount / amounts.length : 0;
      const balanceAccuracy = this.calculateBalanceAccuracy(entries);
      const closeStatus = this.determineCloseStatus(entries);

      // Additional metrics
      const maxAmount = Math.max(...amounts, 0);
      const minAmount = Math.min(...amounts.filter((a) => a > 0), 0);
      const uniqueAccounts = new Set(entries.map((e) => e.accountNo)).size;
      const documentTypes = new Set(entries.map((e) => e.documentType));

      return {
        period,
        granularity,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalDebits: parseFloat(totalDebits.toFixed(2)),
        totalCredits: parseFloat(totalCredits.toFixed(2)),
        transactionCount: entries.length,
        averageAmount: parseFloat(averageAmount.toFixed(2)),
        maxAmount: parseFloat(maxAmount.toFixed(2)),
        minAmount: parseFloat(minAmount.toFixed(2)),
        balanceAccuracy: parseFloat(balanceAccuracy.toFixed(2)),
        closeStatus,
        uniqueAccounts,
        documentTypesCount: documentTypes.size,
        documentTypes: Array.from(documentTypes),
        // Calculate some derived metrics
        debitCreditRatio:
          totalCredits > 0
            ? parseFloat((totalDebits / totalCredits).toFixed(2))
            : null,
        averageTransactionSize: parseFloat(averageAmount.toFixed(2)),
        transactionFrequency: entries.length,
        periodStart: this.getPeriodStart(period, granularity),
        periodEnd: this.getPeriodEnd(period, granularity),
      };
    });

    // Sort by period ascending
    const sortedMetrics = metrics.sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    console.log(`✅ Generated metrics for ${sortedMetrics.length} periods`);
    return sortedMetrics;
  }

  // Helper methods for period calculations
  getPeriodStart(period, granularity) {
    switch (granularity) {
      case "daily":
        return period; // Already in YYYY-MM-DD format
      case "weekly":
        return period; // Already the start of week
      case "monthly": {
        const [year, month] = period.split("-");
        return `${year}-${month}-01`;
      }
      case "quarterly": {
        const [year, quarter] = period.split("-Q");
        const startMonth = (parseInt(quarter) - 1) * 3 + 1;
        return `${year}-${String(startMonth).padStart(2, "0")}-01`;
      }
      case "yearly":
        return `${period}-01-01`;
      default:
        return period;
    }
  }

  getPeriodEnd(period, granularity) {
    switch (granularity) {
      case "daily":
        return period; // Same as start for daily
      case "weekly": {
        const weekStart = new Date(period);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return weekEnd.toISOString().slice(0, 10);
      }
      case "monthly": {
        const [year, month] = period.split("-");
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        return `${year}-${month}-${String(lastDay).padStart(2, "0")}`;
      }
      case "quarterly": {
        const [year, quarter] = period.split("-Q");
        const endMonth = parseInt(quarter) * 3;
        const lastDay = new Date(parseInt(year), endMonth, 0).getDate();
        return `${year}-${String(endMonth).padStart(2, "0")}-${String(
          lastDay
        ).padStart(2, "0")}`;
      }
      case "yearly":
        return `${period}-12-31`;
      default:
        return period;
    }
  }

  // 2. AUDIT TRAIL ANALYSIS
  async getAuditTrailAnalysis(filters = {}) {
    this.initialize(); // Ensure service is initialized with env vars
    try {
      const rawData = await this.getFinancialData(filters);
      const transformedData = this.transformCMCData(rawData);
      return this.analyzeAuditTrail(transformedData);
    } catch {
      console.warn("Using dummy audit trail data");
      return this.getDummyAuditTrail();
    }
  }

  analyzeAuditTrail(data) {
    // Analyze for anomalies and patterns
    const analysis = {
      transactionFrequency: this.analyzeTransactionFrequency(data),
      documentTypeDistribution: this.analyzeDocumentTypes(data),
      amountAnomalies: this.detectAmountAnomalies(data),
      duplicateTransactions: this.detectDuplicates(data),
      postingPatterns: this.analyzePostingPatterns(data),
    };

    return analysis;
  }

  // 3. REPORTING ACCURACY METRICS
  async getReportingAccuracy(filters = {}) {
    this.initialize(); // Ensure service is initialized with env vars
    try {
      const rawData = await this.getFinancialData(filters);
      const transformedData = this.transformCMCData(rawData);
      return this.calculateReportingAccuracy(transformedData);
    } catch {
      console.warn("Using dummy reporting accuracy data");
      return this.getDummyReportingAccuracy();
    }
  }

  calculateReportingAccuracy(data) {
    return {
      totalEntries: data.length,
      balancedEntries: this.countBalancedEntries(data),
      unbalancedEntries: this.countUnbalancedEntries(data),
      accuracyPercentage: this.calculateAccuracyPercentage(data),
      errorsByType: this.categorizeErrors(data),
      reconciliationStatus: this.checkReconciliation(data),
    };
  }

  // UTILITY METHODS FOR DATA PROCESSING
  groupByMonth(data) {
    return data.reduce((acc, transaction) => {
      const date = new Date(transaction.postingDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(transaction);
      return acc;
    }, {});
  }

  sumAmounts(transactions) {
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  }

  sumDebits(transactions) {
    return transactions.reduce(
      (sum, t) => sum + parseFloat(t.debitAmount || 0),
      0
    );
  }

  sumCredits(transactions) {
    return transactions.reduce(
      (sum, t) => sum + parseFloat(t.creditAmount || 0),
      0
    );
  }

  calculateBalanceAccuracy(transactions) {
    const totalDebits = this.sumDebits(transactions);
    const totalCredits = this.sumCredits(transactions);
    const difference = Math.abs(totalDebits - totalCredits);
    const total = totalDebits + totalCredits;

    return total > 0 ? ((total - difference) / total) * 100 : 100;
  }

  calculateAverage(transactions) {
    const total = this.sumAmounts(transactions);
    return transactions.length > 0 ? total / transactions.length : 0;
  }

  determineCloseStatus(transactions) {
    const accuracy = this.calculateBalanceAccuracy(transactions);
    if (accuracy >= 99.5) return "Closed";
    if (accuracy >= 95) return "Pending Review";
    return "Requires Attention";
  }

  analyzeTransactionFrequency(data) {
    const daily = {};
    data.forEach((t) => {
      const date = t.attributes.Posting_Date;
      daily[date] = (daily[date] || 0) + 1;
    });

    return Object.keys(daily).map((date) => ({
      date,
      transactionCount: daily[date],
    }));
  }

  analyzeDocumentTypes(data) {
    const types = {};
    data.forEach((t) => {
      const type = t.attributes.Document_Type;
      types[type] = (types[type] || 0) + 1;
    });

    return Object.keys(types).map((type) => ({
      documentType: type,
      count: types[type],
      percentage: (types[type] / data.length) * 100,
    }));
  }

  detectAmountAnomalies(data) {
    const amounts = data.map((t) => parseFloat(t.attributes.Amount || 0));
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(
      amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length
    );

    const anomalies = data.filter((t) => {
      const amount = parseFloat(t.attributes.Amount || 0);
      return Math.abs(amount - mean) > 2 * stdDev; // 2 standard deviations
    });

    return anomalies.map((t) => ({
      transactionNo: t.attributes.Transaction_No,
      amount: t.attributes.Amount,
      deviation: Math.abs(parseFloat(t.attributes.Amount) - mean),
      documentType: t.attributes.Document_Type,
    }));
  }

  // DUMMY DATA FOR DEVELOPMENT
  getDummyFinancialData() {
    return [
      {
        id: 39027,
        attributes: {
          Entry_No: "19511",
          Transaction_No: "2223",
          G_L_Account_No: "10060",
          Posting_Date: "2021-08-10",
          Document_Type: "Payment",
          Amount: "19000",
          Debit_Amount: "19000",
          Credit_Amount: "0",
          G_L_Account_Name: "Mbarara Cash Control",
        },
      },
      // Add more dummy entries...
    ];
  }

  getDummyCloseMetrics() {
    return [
      {
        month: "2021-08",
        totalTransactions: 1250,
        totalAmount: 4500000,
        totalDebits: 2300000,
        totalCredits: 2200000,
        balanceAccuracy: 98.5,
        averageTransactionValue: 3600,
        closeStatus: "Closed",
      },
      {
        month: "2021-09",
        totalTransactions: 1180,
        totalAmount: 4200000,
        totalDebits: 2100000,
        totalCredits: 2100000,
        balanceAccuracy: 100,
        averageTransactionValue: 3559,
        closeStatus: "Closed",
      },
    ];
  }

  getDummyAuditTrail() {
    return {
      transactionFrequency: [
        { date: "2021-08-01", transactionCount: 45 },
        { date: "2021-08-02", transactionCount: 52 },
        { date: "2021-08-03", transactionCount: 38 },
      ],
      documentTypeDistribution: [
        { documentType: "Payment", count: 450, percentage: 36 },
        { documentType: "Invoice", count: 380, percentage: 30.4 },
        { documentType: "Credit Memo", count: 420, percentage: 33.6 },
      ],
    };
  }

  getDummyReportingAccuracy() {
    return {
      totalEntries: 1250,
      balancedEntries: 1235,
      unbalancedEntries: 15,
      accuracyPercentage: 98.8,
      errorsByType: [
        { errorType: "Unbalanced Entry", count: 10 },
        { errorType: "Missing Account", count: 3 },
        { errorType: "Invalid Amount", count: 2 },
      ],
    };
  }

  getDummyAccountNames() {
    return [
      {
        accountNo: "10060",
        accountName: "Mbarara Cash Control",
        displayName: "10060 - Mbarara Cash Control",
      },
      {
        accountNo: "21001",
        accountName: "Accounts Payable",
        displayName: "21001 - Accounts Payable",
      },
      {
        accountNo: "40000",
        accountName: "Sales Revenue",
        displayName: "40000 - Sales Revenue",
      },
      {
        accountNo: "50000",
        accountName: "Cost of Goods Sold",
        displayName: "50000 - Cost of Goods Sold",
      },
      {
        accountNo: "60000",
        accountName: "Operating Expenses",
        displayName: "60000 - Operating Expenses",
      },
    ];
  }

  getDummyDocumentTypes() {
    return [
      { value: "Invoice", label: "Invoice", displayName: "Invoice" },
      { value: "Payment", label: "Payment", displayName: "Payment" },
      {
        value: "Credit Memo",
        label: "Credit Memo",
        displayName: "Credit Memo",
      },
      { value: "Receipt", label: "Receipt", displayName: "Receipt" },
      { value: "Journal", label: "Journal", displayName: "Journal" },
    ];
  }
}

export default new FinanceService();
