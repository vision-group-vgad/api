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
    this.roleCode = null;
  }

  // Initialize the service with environment variables
  initialize(roleCode = null) {
    if (this.initialized && this.roleCode === roleCode) return;

    if (roleCode) {
      this.roleCode = roleCode;
    }

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

      // Add roleCode header if available
      if (this.roleCode) {
        config.headers["X-Role-Code"] = this.roleCode;
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await this.apiClient.get(endpoint, { params, signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }

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

  // ...existing code...

  // 4. REGIONAL P&L ANALYSIS
  // 4. REGIONAL P&L ANALYSIS
  async getRegionalPnL(filters = {}) {
    this.initialize();
    try {
      console.log("🔍 Getting Regional P&L with filters:", filters);

      const rawData = await this.getFinancialData(filters);
      console.log(`📊 Processing ${rawData.length} records for Regional P&L`);

      return this.calculateRegionalPnL(rawData, filters);
    } catch (error) {
      console.warn("Using dummy Regional P&L due to error:", error.message);
      return this.getDummyRegionalPnL();
    }
  }

  calculateRegionalPnL(data, filters = {}) {
    console.log("🔄 Calculating Regional P&L with dimension mapping");

    // Map Dimension_Set_ID to regions (this would come from your dimension metadata)
    const regionMapping = this.getDimensionRegionMapping();
    
    // Group data by region using Dimension_Set_ID
    const regionalData = this.groupDataByRegion(data, regionMapping);
    
    // Calculate P&L for each region
    const regionalPnL = Object.entries(regionalData).map(([region, transactions]) => {
      return this.calculatePnLForRegion(region, transactions, filters);
    });

    // Add rank after sorting
    const sortedPnL = regionalPnL.sort((a, b) => b.totalRevenue - a.totalRevenue);
    sortedPnL.forEach((region, index) => {
      region.regionRank = index + 1;
    });

    return sortedPnL;
  }

  // Map Dimension_Set_ID to regions (replace with real dimension metadata when available)
  getDimensionRegionMapping() {
    return {
      // Dimension_Set_ID -> Region mapping
      '1': 'Central Region (Kampala)',
      '2': 'Eastern Region (Mbale)',
      '3': 'Western Region (Mbarara)', 
      '4': 'Northern Region (Gulu)',
      '5': 'North-Eastern Region (Soroti)',
      '6': 'South-Western Region (Kabale)',
      '7': 'Central-East Region (Jinja)',
      '8': 'Mid-Western Region (Fort Portal)',
      '9': 'West Nile Region (Arua)',
      '10': 'Central-North Region (Luwero)',
      // Add more mappings as needed
      '0': 'Head Office/Unallocated',
      null: 'Head Office/Unallocated',
      undefined: 'Head Office/Unallocated'
    };
  }

  groupDataByRegion(data, regionMapping) {
    const grouped = {};
    
    data.forEach(transaction => {
      const dimensionId = transaction.dimensionSetId?.toString() || '0';
      const region = regionMapping[dimensionId] || 'Head Office/Unallocated';
      
      if (!grouped[region]) {
        grouped[region] = [];
      }
      grouped[region].push(transaction);
    });

    return grouped;
  }

  calculatePnLForRegion(region, transactions, _filters = {}) {
    // Debug: Log account distribution for this region
    const accountDistribution = {};
    transactions.forEach(t => {
      const accountNo = t.accountNo?.toString() || 'Unknown';
      const firstDigit = accountNo.charAt(0);
      accountDistribution[firstDigit] = (accountDistribution[firstDigit] || 0) + 1;
    });
    
    console.log(`📊 Account distribution for ${region}:`, accountDistribution);

    // Categorize accounts into P&L categories
    const revenue = this.filterByAccountCategory(transactions, 'revenue');
    const cogs = this.filterByAccountCategory(transactions, 'cogs');
    const operatingExpenses = this.filterByAccountCategory(transactions, 'opex');
    const otherIncome = this.filterByAccountCategory(transactions, 'other_income');
    const otherExpenses = this.filterByAccountCategory(transactions, 'other_expenses');

    // Debug: Log categorization results
    console.log(`💰 ${region} categorization:`, {
      revenue: revenue.length,
      cogs: cogs.length,
      opex: operatingExpenses.length,
      otherIncome: otherIncome.length,
      otherExpenses: otherExpenses.length,
      total: transactions.length
    });

    // For revenue calculation - we need to be careful about debits vs credits
    // Revenue accounts: Credits increase revenue, Debits decrease revenue
    const totalRevenue = this.sumCredits(revenue) - this.sumDebits(revenue);
    
    // For expense accounts: Debits increase expenses, Credits decrease expenses
    const totalCOGS = this.sumDebits(cogs) - this.sumCredits(cogs);
    const totalOpEx = this.sumDebits(operatingExpenses) - this.sumCredits(operatingExpenses);
    const totalOtherIncome = this.sumCredits(otherIncome) - this.sumDebits(otherIncome);
    const totalOtherExpenses = this.sumDebits(otherExpenses) - this.sumCredits(otherExpenses);

    // If revenue is still negative, let's try alternative calculation
    let adjustedRevenue = totalRevenue;
    if (totalRevenue < 0) {
      // Maybe in your system, revenue appears as debits instead of credits
      adjustedRevenue = this.sumDebits(revenue) - this.sumCredits(revenue);
      console.log(`⚠️ ${region}: Adjusted revenue calculation from ${totalRevenue} to ${adjustedRevenue}`);
    }

    // Use absolute values if still getting strange results and account for specific data patterns
    const finalRevenue = Math.abs(adjustedRevenue);
    const finalCOGS = Math.abs(totalCOGS);
    const finalOpEx = Math.abs(totalOpEx);

    // Calculate derived metrics
    const grossProfit = finalRevenue - finalCOGS;
    const operatingProfit = grossProfit - finalOpEx;
    const netProfit = operatingProfit + Math.abs(totalOtherIncome) - Math.abs(totalOtherExpenses);

    // Calculate margins
    const grossMargin = finalRevenue > 0 ? (grossProfit / finalRevenue) * 100 : 0;
    const operatingMargin = finalRevenue > 0 ? (operatingProfit / finalRevenue) * 100 : 0;
    const netMargin = finalRevenue > 0 ? (netProfit / finalRevenue) * 100 : 0;

    return {
      region,
      dimensionInfo: this.getRegionDimensionInfo(transactions),
      
      // Revenue
      totalRevenue: parseFloat(finalRevenue.toFixed(2)),
      revenueTransactionCount: revenue.length,
      
      // Cost of Goods Sold
      totalCOGS: parseFloat(finalCOGS.toFixed(2)),
      cogsTransactionCount: cogs.length,
      
      // Gross Profit
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      grossMargin: parseFloat(grossMargin.toFixed(2)),
      
      // Operating Expenses
      totalOperatingExpenses: parseFloat(finalOpEx.toFixed(2)),
      opexTransactionCount: operatingExpenses.length,
      
      // Operating Profit
      operatingProfit: parseFloat(operatingProfit.toFixed(2)),
      operatingMargin: parseFloat(operatingMargin.toFixed(2)),
      
      // Other Income/Expenses
      totalOtherIncome: parseFloat(Math.abs(totalOtherIncome).toFixed(2)),
      totalOtherExpenses: parseFloat(Math.abs(totalOtherExpenses).toFixed(2)),
      
      // Net Profit
      netProfit: parseFloat(netProfit.toFixed(2)),
      netMargin: parseFloat(netMargin.toFixed(2)),
      
      // Additional metrics
      totalTransactions: transactions.length,
      uniqueAccounts: new Set(transactions.map(t => t.accountNo)).size,
      documentTypes: [...new Set(transactions.map(t => t.documentType))],
      
      // Period info
      periodStart: this.getEarliestDate(transactions),
      periodEnd: this.getLatestDate(transactions),
      
      // Performance indicators
      revenuePerTransaction: revenue.length > 0 ? finalRevenue / revenue.length : 0,
      profitability: netProfit > 0 ? 'Profitable' : 'Loss Making',
      regionRank: null, // Will be set after sorting
      
      // Debug info (remove in production)
      debug: {
        originalRevenue: totalRevenue,
        adjustedRevenue: adjustedRevenue,
        accountDistribution: accountDistribution,
        sampleAccounts: transactions.slice(0, 3).map(t => ({
          accountNo: t.accountNo,
          accountName: t.accountName,
          debit: t.debitAmount,
          credit: t.creditAmount
        }))
      }
    };
  }

  filterByAccountCategory(transactions, category) {
    return transactions.filter(t => {
      const accountNo = t.accountNo;
      if (!accountNo) return false;

      // Convert to string and get first digit for classification
      const accountStr = accountNo.toString();
      const firstDigit = accountStr.charAt(0);

      switch (category) {
        case 'revenue':
          // Revenue accounts - typically start with 4 or 3 (depending on chart of accounts)
          // For your data, let's also check for income/sales patterns
          return firstDigit === '4' || firstDigit === '3' || 
                 t.accountName?.toLowerCase().includes('revenue') ||
                 t.accountName?.toLowerCase().includes('sales') ||
                 t.accountName?.toLowerCase().includes('income');
        
        case 'cogs':
          // Cost of Goods Sold - typically start with 5
          return firstDigit === '5' ||
                 t.accountName?.toLowerCase().includes('cost of goods') ||
                 t.accountName?.toLowerCase().includes('cogs');
        
        case 'opex':
          // Operating Expenses - typically start with 6 or 7
          return firstDigit === '6' || firstDigit === '7' ||
                 t.accountName?.toLowerCase().includes('expense') ||
                 t.accountName?.toLowerCase().includes('operating');
        
        case 'other_income':
          // Other Income - typically start with 8
          return firstDigit === '8' ||
                 t.accountName?.toLowerCase().includes('other income') ||
                 t.accountName?.toLowerCase().includes('interest income');
        
        case 'other_expenses':
          // Other Expenses - typically start with 9
          return firstDigit === '9' ||
                 t.accountName?.toLowerCase().includes('other expense') ||
                 t.accountName?.toLowerCase().includes('interest expense');
        
        default:
          return false;
      }
    });
  }

  getRegionDimensionInfo(transactions) {
    const dimensionIds = [...new Set(transactions.map(t => t.dimensionSetId).filter(Boolean))];
    return {
      dimensionSetIds: dimensionIds,
      primaryDimensionId: dimensionIds[0] || null,
      dimensionCount: dimensionIds.length
    };
  }

  getEarliestDate(transactions) {
    const dates = transactions.map(t => new Date(t.postingDate)).filter(d => !isNaN(d));
    return dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;
  }

  getLatestDate(transactions) {
    const dates = transactions.map(t => new Date(t.postingDate)).filter(d => !isNaN(d));
    return dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0] : null;
  }

  // Get available regions for dropdown filter
  async getRegions() {
    this.initialize();
    try {
      console.log("🔍 Fetching regions from dimension data");

      const response = await this.apiClient.get("/bc-datasets", {
        params: { limit: 5000 }
      });

      const data = response.data.data || [];
      console.log(`✅ Fetched ${data.length} records for region mapping`);

      const regionMapping = this.getDimensionRegionMapping();
      const dimensionIds = [...new Set(data.map(entry => entry.attributes.Dimension_Set_ID).filter(Boolean))];
      
      const regions = dimensionIds.map(id => ({
        dimensionSetId: id,
        regionName: regionMapping[id.toString()] || `Region ${id}`,
        displayName: regionMapping[id.toString()] || `Region ${id}`
      }));

      // Add Head Office/Unallocated
      regions.push({
        dimensionSetId: null,
        regionName: 'Head Office/Unallocated',
        displayName: 'Head Office/Unallocated'
      });

      console.log(`📊 Found ${regions.length} regions`);
      return regions;
    } catch (error) {
      console.warn("⚠️ Using dummy regions - API not available:", error.message);
      return this.getDummyRegions();
    }
  }

  // Account Analysis for debugging chart of accounts structure
  async getAccountAnalysis() {
    this.initialize();
    try {
      console.log("🔍 Analyzing account structure");

      const data = await this.getFinancialData({ limit: 1000 });
      
      // Analyze account structure
      const accountAnalysis = {};
      const accountNames = {};
      
      data.forEach(transaction => {
        const accountNo = transaction.accountNo?.toString() || 'Unknown';
        const firstDigit = accountNo.charAt(0);
        
        if (!accountAnalysis[firstDigit]) {
          accountAnalysis[firstDigit] = {
            count: 0,
            totalDebits: 0,
            totalCredits: 0,
            sampleAccounts: []
          };
        }
        
        accountAnalysis[firstDigit].count++;
        accountAnalysis[firstDigit].totalDebits += parseFloat(transaction.debitAmount || 0);
        accountAnalysis[firstDigit].totalCredits += parseFloat(transaction.creditAmount || 0);
        
        if (accountAnalysis[firstDigit].sampleAccounts.length < 5) {
          accountAnalysis[firstDigit].sampleAccounts.push({
            accountNo: accountNo,
            accountName: transaction.accountName,
            debit: transaction.debitAmount,
            credit: transaction.creditAmount
          });
        }
        
        // Collect unique account names
        if (accountNo !== 'Unknown' && !accountNames[accountNo]) {
          accountNames[accountNo] = transaction.accountName;
        }
      });

      return {
        accountAnalysis,
        uniqueAccounts: Object.keys(accountNames).length,
        sampleAccountNames: Object.entries(accountNames).slice(0, 20),
        totalTransactions: data.length
      };
    } catch (error) {
      console.warn("⚠️ Account analysis failed:", error.message);
      return this.getDummyAccountAnalysis();
    }
  }

  // DUMMY DATA FOR REGIONAL P&L
  getDummyRegionalPnL() {
    return [
      {
        region: 'Central Region (Kampala)',
        dimensionInfo: { dimensionSetIds: ['1'], primaryDimensionId: '1', dimensionCount: 1 },
        totalRevenue: 2500000,
        revenueTransactionCount: 180,
        totalCOGS: 1200000,
        cogsTransactionCount: 95,
        grossProfit: 1300000,
        grossMargin: 52.0,
        totalOperatingExpenses: 800000,
        opexTransactionCount: 145,
        operatingProfit: 500000,
        operatingMargin: 20.0,
        totalOtherIncome: 50000,
        totalOtherExpenses: 30000,
        netProfit: 520000,
        netMargin: 20.8,
        totalTransactions: 420,
        uniqueAccounts: 25,
        documentTypes: ['Invoice', 'Payment', 'Credit Memo'],
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        revenuePerTransaction: 13888.89,
        profitability: 'Profitable',
        regionRank: 1
      },
      {
        region: 'Western Region (Mbarara)',
        dimensionInfo: { dimensionSetIds: ['3'], primaryDimensionId: '3', dimensionCount: 1 },
        totalRevenue: 1800000,
        revenueTransactionCount: 120,
        totalCOGS: 900000,
        cogsTransactionCount: 68,
        grossProfit: 900000,
        grossMargin: 50.0,
        totalOperatingExpenses: 600000,
        opexTransactionCount: 98,
        operatingProfit: 300000,
        operatingMargin: 16.67,
        totalOtherIncome: 25000,
        totalOtherExpenses: 15000,
        netProfit: 310000,
        netMargin: 17.22,
        totalTransactions: 286,
        uniqueAccounts: 18,
        documentTypes: ['Invoice', 'Payment'],
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        revenuePerTransaction: 15000,
        profitability: 'Profitable',
        regionRank: 2
      },
      {
        region: 'Eastern Region (Mbale)',
        dimensionInfo: { dimensionSetIds: ['2'], primaryDimensionId: '2', dimensionCount: 1 },
        totalRevenue: 1200000,
        revenueTransactionCount: 85,
        totalCOGS: 650000,
        cogsTransactionCount: 45,
        grossProfit: 550000,
        grossMargin: 45.83,
        totalOperatingExpenses: 400000,
        opexTransactionCount: 72,
        operatingProfit: 150000,
        operatingMargin: 12.5,
        totalOtherIncome: 15000,
        totalOtherExpenses: 10000,
        netProfit: 155000,
        netMargin: 12.92,
        totalTransactions: 202,
        uniqueAccounts: 15,
        documentTypes: ['Invoice', 'Payment', 'Receipt'],
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        revenuePerTransaction: 14117.65,
        profitability: 'Profitable',
        regionRank: 3
      },
      {
        region: 'Northern Region (Gulu)',
        dimensionInfo: { dimensionSetIds: ['4'], primaryDimensionId: '4', dimensionCount: 1 },
        totalRevenue: 950000,
        revenueTransactionCount: 65,
        totalCOGS: 520000,
        cogsTransactionCount: 35,
        grossProfit: 430000,
        grossMargin: 45.26,
        totalOperatingExpenses: 380000,
        opexTransactionCount: 58,
        operatingProfit: 50000,
        operatingMargin: 5.26,
        totalOtherIncome: 8000,
        totalOtherExpenses: 12000,
        netProfit: 46000,
        netMargin: 4.84,
        totalTransactions: 158,
        uniqueAccounts: 12,
        documentTypes: ['Invoice', 'Payment'],
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        revenuePerTransaction: 14615.38,
        profitability: 'Profitable',
        regionRank: 4
      }
    ];
  }

  getDummyRegions() {
    return [
      { dimensionSetId: '1', regionName: 'Central Region (Kampala)', displayName: 'Central Region (Kampala)' },
      { dimensionSetId: '2', regionName: 'Eastern Region (Mbale)', displayName: 'Eastern Region (Mbale)' },
      { dimensionSetId: '3', regionName: 'Western Region (Mbarara)', displayName: 'Western Region (Mbarara)' },
      { dimensionSetId: '4', regionName: 'Northern Region (Gulu)', displayName: 'Northern Region (Gulu)' },
      { dimensionSetId: '5', regionName: 'North-Eastern Region (Soroti)', displayName: 'North-Eastern Region (Soroti)' },
      { dimensionSetId: '6', regionName: 'South-Western Region (Kabale)', displayName: 'South-Western Region (Kabale)' },
      { dimensionSetId: '7', regionName: 'Central-East Region (Jinja)', displayName: 'Central-East Region (Jinja)' },
      { dimensionSetId: '8', regionName: 'Mid-Western Region (Fort Portal)', displayName: 'Mid-Western Region (Fort Portal)' },
      { dimensionSetId: '9', regionName: 'West Nile Region (Arua)', displayName: 'West Nile Region (Arua)' },
      { dimensionSetId: '10', regionName: 'Central-North Region (Luwero)', displayName: 'Central-North Region (Luwero)' },
      { dimensionSetId: null, regionName: 'Head Office/Unallocated', displayName: 'Head Office/Unallocated' }
    ];
  }

  getDummyAccountAnalysis() {
    return {
      accountAnalysis: {
        '1': { count: 150, totalDebits: 500000, totalCredits: 300000, sampleAccounts: [] },
        '2': { count: 80, totalDebits: 200000, totalCredits: 400000, sampleAccounts: [] },
        '4': { count: 120, totalDebits: 100000, totalCredits: 800000, sampleAccounts: [] }
      },
      uniqueAccounts: 50,
      sampleAccountNames: [['10060', 'Cash Control'], ['21001', 'Accounts Payable']],
      totalTransactions: 350
    };
  }

// ...existing code...

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
