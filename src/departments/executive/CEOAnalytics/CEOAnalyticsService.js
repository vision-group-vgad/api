import axios from "axios";
import { faker } from "@faker-js/faker";
import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";

const _execUtils = new ExecutiveUtils();

// --- Helper: Generate random dates in 2023-2025 ---
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split("T")[0];
}

// --- Governance Compliance Dummy Data ---
const complianceAreas = ["Data Privacy", "Financial Reporting", "Audit Trail", "Cybersecurity", "Procurement"];
const complianceStatuses = ["Compliant", "At Risk", "Non-Compliant", "Partial"];
const governanceCompliance = Array.from({ length: 220 }, (_, i) => {
  const area = faker.helpers.arrayElement(complianceAreas);
  return {
    id: i + 1,
    compliance_area: area,
    compliance_score: faker.number.int({ min: 50, max: 100 }),
    last_audit_date: randomDate(new Date(2023, 0, 1), new Date(2025, 7, 1)),
    status: faker.helpers.arrayElement(complianceStatuses),
  };
});

// --- Legal Exposure Dummy Data ---
const caseTypes = ["Labor", "Contract", "Regulatory", "IP", "Tax"];
const riskLevels = ["High", "Medium", "Low"];
const caseStatuses = ["Open", "Closed", "Pending"];
const legalExposure = Array.from({ length: 220 }, (_, i) => ({
  case_id: `LEG${String(i + 1).padStart(3, "0")}`,
  case_type: faker.helpers.arrayElement(caseTypes),
  risk_level: faker.helpers.arrayElement(riskLevels),
  exposure: faker.number.int({ min: 5000, max: 500000 }),
  status: faker.helpers.arrayElement(caseStatuses),
  opened_date: randomDate(new Date(2023, 0, 1), new Date(2025, 7, 1)),
}));

// --- Board Reporting Metrics Dummy Data ---
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];
const boardReportingMetrics = [];
let headcount = 500;
for (let year = 2023; year <= 2025; year++) {
  for (let m = 0; m < 12; m++) {
    headcount += faker.number.int({ min: -10, max: 20 });
    boardReportingMetrics.push({
      year,
      month: months[m],
      revenue_growth: faker.number.int({ min: 4, max: 12 }),
      profit_margin: faker.number.int({ min: 8, max: 18 }),
      market_share: faker.number.int({ min: 10, max: 25 }),
      headcount,
      strategic_projects_completed: faker.number.int({ min: 0, max: 5 }),
    });
  }
}

// --- Workforce Analytics Dummy Data ---
const departments = ["IT", "Sales", "HR", "Finance", "Editorial", "Production", "Legal"];
const workforceAnalytics = Array.from({ length: 220 }, (_, i) => {
  const dept = faker.helpers.arrayElement(departments);
  return {
    id: i + 1,
    department: dept,
    employees: faker.number.int({ min: 10, max: 200 }),
    tenure: (Math.random() * 7 + 1).toFixed(1), // 1.0 - 8.0 years
    turnover: faker.number.int({ min: 2, max: 25 }),
    performance_score: faker.number.int({ min: 60, max: 99 }),
    year: 2023 + Math.floor(i / 100),
  };
});

// --- Retention Rates Dummy Data ---
const retentionRates = [];
let totalEmployees = 600;
for (let year = 2023; year <= 2025; year++) {
  for (let m = 0; m < 12; m++) {
    const retained = totalEmployees - faker.number.int({ min: 0, max: 20 });
    retentionRates.push({
      year,
      month: months[m],
      total_employees: totalEmployees,
      retained,
      retention_rate: ((retained / totalEmployees) * 100).toFixed(1),
    });
    totalEmployees += faker.number.int({ min: -5, max: 15 });
  }
}

// --- Compensation Benchmarks Dummy Data ---
const compensationDepartments = ["Sales", "Operations", "Finance", "Marketing", "IT", "HR", "Editorial", "Administrative"];
const roleLevels = ["Junior", "Mid-Level", "Senior", "Lead", "Manager", "Director", "VP", "C-Level"];
const regions = ["Central Region", "Eastern Region", "Northern Region", "Western Region", "Kampala Metropolitan", "Southwest Region"];

const compensationBenchmarks = [];
for (let year = 2023; year <= 2025; year++) {
  for (let m = 0; m < 12; m++) {
    compensationDepartments.forEach(dept => {
      roleLevels.forEach(level => {
        regions.forEach(region => {
          const baseSalary = {
            "Junior": { min: 800000, max: 1500000 },      // UGX 800K - 1.5M
            "Mid-Level": { min: 1400000, max: 2500000 },   // UGX 1.4M - 2.5M
            "Senior": { min: 2300000, max: 4000000 },      // UGX 2.3M - 4M
            "Lead": { min: 3500000, max: 5500000 },        // UGX 3.5M - 5.5M
            "Manager": { min: 5000000, max: 8000000 },     // UGX 5M - 8M
            "Director": { min: 7500000, max: 12000000 },   // UGX 7.5M - 12M
            "VP": { min: 11000000, max: 18000000 },        // UGX 11M - 18M
            "C-Level": { min: 15000000, max: 35000000 }    // UGX 15M - 35M
          };
          
          const deptMultiplier = {
            "Sales": 1.1, "Operations": 0.95, "Finance": 1.05, "Marketing": 1.0,
            "IT": 1.15, "HR": 0.9, "Editorial": 0.85, "Administrative": 0.8
          };
          
          const regionMultiplier = {
            "Central Region": 1.0,           // Baseline (includes Kampala surroundings)
            "Kampala Metropolitan": 1.25,    // Highest salaries (capital city)
            "Eastern Region": 0.85,          // Mbale, Jinja, Soroti areas
            "Western Region": 0.90,          // Mbarara, Fort Portal, Kasese areas  
            "Northern Region": 0.80,         // Gulu, Lira, Arua areas
            "Southwest Region": 0.88         // Kabale, Rukungiri areas
          };
          
          const avgSalary = Math.round(
            faker.number.int(baseSalary[level]) * 
            deptMultiplier[dept] * 
            regionMultiplier[region]
          );
          
          const marketBenchmark = Math.round(avgSalary * faker.number.float({ min: 0.8, max: 1.3 }));
          const percentDifference = (((avgSalary - marketBenchmark) / marketBenchmark) * 100).toFixed(1);
          
          compensationBenchmarks.push({
            id: compensationBenchmarks.length + 1,
            year,
            month: months[m],
            department: dept,
            role_level: level,
            region: region,
            avg_salary: avgSalary,
            market_benchmark: marketBenchmark,
            percent_difference: parseFloat(percentDifference),
            currency: "UGX",
            sample_size: faker.number.int({ min: 25, max: 200 }),
            last_updated: randomDate(new Date(year, m, 1), new Date(year, m + 1, 0)),
            compliance_gap: Math.abs(parseFloat(percentDifference)) > 15 ? "High" : 
                           Math.abs(parseFloat(percentDifference)) > 5 ? "Medium" : "Low"
          });
        });
      });
    });
  }
}

// --- KPI Methods ---
function getGovernanceComplianceKPIs() {
  const total = governanceCompliance.length;
  const compliant = governanceCompliance.filter(d => d.status === "Compliant").length;
  const atRisk = governanceCompliance.filter(d => d.status === "At Risk").length;
  const nonCompliant = governanceCompliance.filter(d => d.status === "Non-Compliant").length;
  return {
    total,
    compliant,
    atRisk,
    nonCompliant,
    compliantPercent: ((compliant / total) * 100).toFixed(1),
    atRiskPercent: ((atRisk / total) * 100).toFixed(1),
    nonCompliantPercent: ((nonCompliant / total) * 100).toFixed(1),
  };
}

function getLegalExposureKPIs() {
  const totalExposure = legalExposure.reduce((sum, d) => sum + d.exposure, 0);
  const openCases = legalExposure.filter(d => d.status === "Open").length;
  const closedCases = legalExposure.filter(d => d.status === "Closed").length;
  return {
    totalCases: legalExposure.length,
    totalExposure,
    openCases,
    closedCases,
  };
}

function getBoardReportingKPIs() {
  const latest = boardReportingMetrics[boardReportingMetrics.length - 1];
  return {
    revenue_growth: latest.revenue_growth,
    profit_margin: latest.profit_margin,
    market_share: latest.market_share,
    headcount: latest.headcount,
    strategic_projects_completed: latest.strategic_projects_completed,
  };
}

function getWorkforceKPIs() {
  const totalEmployees = workforceAnalytics.reduce((sum, d) => sum + d.employees, 0);
  const avgTenure = (
    workforceAnalytics.reduce((sum, d) => sum + parseFloat(d.tenure), 0) / workforceAnalytics.length
  ).toFixed(1);
  const avgPerformance = (
    workforceAnalytics.reduce((sum, d) => sum + d.performance_score, 0) / workforceAnalytics.length
  ).toFixed(1);
  return {
    totalEmployees,
    avgTenure,
    avgPerformance,
  };
}

function getRetentionKPIs() {
  const latest = retentionRates[retentionRates.length - 1];
  return {
    latestRetentionRate: latest.retention_rate,
    totalEmployees: latest.total_employees,
    retained: latest.retained,
  };
}

function getCompensationBenchmarksKPIs() {
  const totalPositions = compensationBenchmarks.length;
  const aboveBenchmark = compensationBenchmarks.filter(d => d.percent_difference > 0).length;
  const belowBenchmark = compensationBenchmarks.filter(d => d.percent_difference < 0).length;
  const highRiskGaps = compensationBenchmarks.filter(d => d.compliance_gap === "High").length;
  const avgDifference = (compensationBenchmarks.reduce((sum, d) => sum + d.percent_difference, 0) / totalPositions).toFixed(1);
  
  return {
    totalPositions,
    aboveBenchmark,
    belowBenchmark,
    highRiskGaps,
    avgDifference: parseFloat(avgDifference),
    complianceRate: (((totalPositions - highRiskGaps) / totalPositions) * 100).toFixed(1)
  };
}

// --- Filter Dropdown Methods ---
function getComplianceAreas() {
  return [...new Set(governanceCompliance.map(d => d.compliance_area))];
}
function getComplianceStatuses() {
  return [...new Set(governanceCompliance.map(d => d.status))];
}
function getCaseTypes() {
  return [...new Set(legalExposure.map(d => d.case_type))];
}
function getRiskLevels() {
  return [...new Set(legalExposure.map(d => d.risk_level))];
}
function getLegalStatuses() {
  return [...new Set(legalExposure.map(d => d.status))];
}
function getDepartments() {
  return [...new Set(workforceAnalytics.map(d => d.department))];
}
function getYears() {
  const years = [
    ...new Set([
      ...boardReportingMetrics.map(d => d.year),
      ...workforceAnalytics.map(d => d.year),
      ...retentionRates.map(d => d.year),
    ]),
  ];
  return years.sort();
}
function getMonths() {
  return [
    ...new Set([
      ...boardReportingMetrics.map(d => d.month),
      ...retentionRates.map(d => d.month),
    ]),
  ];
}

function getCompensationDepartments() {
  return [...new Set(compensationBenchmarks.map(d => d.department))];
}
function getRoleLevels() {
  return [...new Set(compensationBenchmarks.map(d => d.role_level))];
}
function getRegions() {
  return [...new Set(compensationBenchmarks.map(d => d.region))];
}
function getComplianceGaps() {
  return [...new Set(compensationBenchmarks.map(d => d.compliance_gap))];
}

// --- CEO Analytics Service Class ---
class CEOAnalyticsService {
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
    console.log("🔧 [CEO Service] CEOAnalyticsService initialized");
  }

  setupAuthentication() {
    this.apiClient.interceptors.request.use((config) => {
      if (this.bearerToken) {
        config.headers.Authorization = `Bearer ${this.bearerToken}`;
      } else {
        const token = Buffer.from(
          `${this.credentials.username}:${this.credentials.password}`
        ).toString("base64");
        config.headers.Authorization = `Basic ${token}`;
      }
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ [CEO Service] API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // --- Governance Compliance ---
  async fetchGovernanceCompliance({ compliance_area, status, page = 1, pageSize = 20 } = {}) {
    let data = governanceCompliance;
    if (compliance_area) data = data.filter(d => d.compliance_area === compliance_area);
    if (status) data = data.filter(d => d.status === status);
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Legal Exposure ---
  async fetchLegalExposure({ case_type, risk_level, status, page = 1, pageSize = 20 } = {}) {
    let data = legalExposure;
    if (case_type) data = data.filter(d => d.case_type === case_type);
    if (risk_level) data = data.filter(d => d.risk_level === risk_level);
    if (status) data = data.filter(d => d.status === status);
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Board Reporting Metrics ---
  async fetchBoardReportingMetrics({ year, month, page = 1, pageSize = 20 } = {}) {
    let data = boardReportingMetrics;
    if (year) data = data.filter(d => d.year === Number(year));
    if (month) data = data.filter(d => d.month === month);
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Workforce Analytics ---
  async fetchWorkforceAnalytics({ department, year, page = 1, pageSize = 20 } = {}) {
    let data = workforceAnalytics;
    if (department) data = data.filter(d => d.department === department);
    if (year) data = data.filter(d => d.year === Number(year));
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Retention Rates ---
  async fetchRetentionRates({ year, month, page = 1, pageSize = 20 } = {}) {
    let data = retentionRates;
    if (year) data = data.filter(d => d.year === Number(year));
    if (month) data = data.filter(d => d.month === month);
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Compensation Benchmarks ---
  async fetchCompensationBenchmarks({ 
    department, 
    roleLevel, 
    region, 
    complianceGap, 
    year, 
    month, 
    page = 1, 
    pageSize = 20 
  } = {}) {
    let data = compensationBenchmarks;
    if (department) data = data.filter(d => d.department === department);
    if (roleLevel) data = data.filter(d => d.role_level === roleLevel);
    if (region) data = data.filter(d => d.region === region);
    if (complianceGap) data = data.filter(d => d.compliance_gap === complianceGap);
    if (year) data = data.filter(d => d.year === Number(year));
    if (month) data = data.filter(d => d.month === month);
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- KPI Methods (live CMC with dummy fallback) ---
  async fetchGovernanceComplianceKPIs() {
    try {
      const d = await _execUtils.getCeoAnalytics();
      const kpis = d.kpis;
      return {
        total: kpis.total_controls,
        compliant: kpis.status_breakdown.compliant,
        atRisk: kpis.status_breakdown.at_risk,
        nonCompliant: kpis.status_breakdown.non_compliant,
        compliantPercent: kpis.status_percentages.compliant_percent,
        atRiskPercent: kpis.status_percentages.at_risk_percent,
        nonCompliantPercent: kpis.status_percentages.non_compliant_percent,
      };
    } catch (err) {
      console.error("❌ [CEO] fetchGovernanceComplianceKPIs CMC failed:", err.message);
      return getGovernanceComplianceKPIs();
    }
  }
  async fetchLegalExposureKPIs() {
    try {
      const d = await _execUtils.getRiskCases();
      const kpis = d.kpis;
      return {
        totalCases: kpis.total_cases,
        totalExposure: kpis.total_exposure,
        openCases: kpis.open_cases,
        closedCases: kpis.closed_cases,
        pendingCases: kpis.pending_cases,
        highRiskCases: kpis.high_risk_cases,
        highRiskRatioPercent: kpis.high_risk_ratio_percent,
        currency: d.currency,
      };
    } catch (err) {
      console.error("❌ [CEO] fetchLegalExposureKPIs CMC failed:", err.message);
      return getLegalExposureKPIs();
    }
  }
  async fetchBoardReportingKPIs() {
    try {
      const d = await _execUtils.getCeoAnalytics();
      const kpis = d.kpis;
      return {
        revenue_growth: kpis.revenue_growth_percent,
        profit_margin: kpis.profit_margin_percent,
        market_share: kpis.market_share_percent,
        headcount: kpis.headcount,
        strategic_projects_completed: kpis.strategic_projects_completed,
      };
    } catch (err) {
      console.error("❌ [CEO] fetchBoardReportingKPIs CMC failed:", err.message);
      return getBoardReportingKPIs();
    }
  }
  async fetchWorkforceKPIs() {
    return getWorkforceKPIs();
  }
  async fetchRetentionKPIs() {
    try {
      const d = await _execUtils.getRetention();
      const kpis = d.kpis;
      return {
        latestRetentionRate: kpis.latest_retention_rate_percent,
        totalEmployees: kpis.total_employees,
        retained: kpis.retained_employees,
        attritionCount: kpis.attrition_count,
        period: d.period,
      };
    } catch (err) {
      console.error("❌ [CEO] fetchRetentionKPIs CMC failed:", err.message);
      return getRetentionKPIs();
    }
  }
  async fetchCompensationBenchmarksKPIs() {
    try {
      const d = await _execUtils.getCompensation();
      const kpis = d.kpis;
      return {
        totalPositions: kpis.total_positions,
        aboveBenchmark: kpis.above_market_benchmark,
        belowBenchmark: kpis.below_market_benchmark,
        highRiskGaps: kpis.high_risk_salary_gaps,
        avgDifference: kpis.average_percent_difference,
        complianceRate: kpis.compensation_compliance_rate_percent,
        currency: d.currency,
      };
    } catch (err) {
      console.error("❌ [CEO] fetchCompensationBenchmarksKPIs CMC failed:", err.message);
      return getCompensationBenchmarksKPIs();
    }
  }

  // --- Filter Dropdown Methods ---
  async fetchComplianceAreas() {
    return getComplianceAreas();
  }
  async fetchComplianceStatuses() {
    return getComplianceStatuses();
  }
  async fetchCaseTypes() {
    return getCaseTypes();
  }
  async fetchRiskLevels() {
    return getRiskLevels();
  }
  async fetchLegalStatuses() {
    return getLegalStatuses();
  }
  async fetchDepartments() {
    return getDepartments();
  }
  async fetchYears() {
    return getYears();
  }
  async fetchMonths() {
    return getMonths();
  }
  async fetchCompensationDepartments() {
    return getCompensationDepartments();
  }
  async fetchRoleLevels() {
    return getRoleLevels();
  }
  async fetchRegions() {
    return getRegions();
  }
  async fetchComplianceGaps() {
    return getComplianceGaps();
  }
}

export default new CEOAnalyticsService();