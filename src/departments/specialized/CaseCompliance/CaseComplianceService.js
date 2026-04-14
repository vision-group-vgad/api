import axios from "axios";
import { faker } from "@faker-js/faker";

// --- Helper: Generate random dates in 2023-2025 ---
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split("T")[0];
}

// --- Case Resolution Dummy Data ---
const caseTypes = ["Customer Support", "IT Incident", "HR Grievance", "Editorial Issue", "Production Delay", "Equipment Malfunction"];
const departments = ["Editorial", "Production", "IT", "Sales", "HR", "Operations", "Finance"];
const priorities = ["Low", "Medium", "High", "Critical"];

// --- English Case Descriptions ---
const caseDescriptions = [
  "System login issues reported by multiple users",
  "Employee complaints about workplace harassment",
  "Customer unable to access online services",
  "Editorial content deadline missed due to technical issues",
  "Production equipment malfunction causing delays",
  "Network connectivity problems in newsroom",
  "Payroll discrepancies need immediate attention",
  "Website performance issues affecting user experience",
  "Database backup failure requires investigation",
  "Security breach in content management system",
  "Printer malfunction in editorial department",
  "Staff scheduling conflicts in production",
  "Customer billing inquiry requires resolution",
  "Server downtime affecting news publication",
  "Employee training request for new software",
  "Content management system access issues",
  "Audio equipment failure during live broadcast",
  "Social media account security compromise",
  "Employee expense reimbursement delays",
  "Video editing software licensing problems"
];

const caseResolutionData = Array.from({ length: 250 }, (_, i) => {
  const openDate = new Date(randomDate(new Date(2023, 0, 1), new Date(2025, 7, 1)));
  const isResolved = faker.datatype.boolean(0.75); // 75% resolved
  const resolutionDays = isResolved ? faker.number.int({ min: 1, max: 30 }) : null;
  const closeDate = isResolved ? new Date(openDate.getTime() + (resolutionDays * 24 * 60 * 60 * 1000)) : null;

  return {
    case_id: `C${String(i + 1).padStart(3, "0")}`,
    case_type: faker.helpers.arrayElement(caseTypes),
    department: faker.helpers.arrayElement(departments),
    priority: faker.helpers.arrayElement(priorities),
    status: isResolved ? faker.helpers.arrayElement(["Resolved", "Closed"]) : faker.helpers.arrayElement(["Open", "In Progress"]),
    open_date: openDate.toISOString().split("T")[0],
    close_date: closeDate ? closeDate.toISOString().split("T")[0] : null,
    resolution_time_days: resolutionDays,
    description: faker.helpers.arrayElement(caseDescriptions),
    assigned_to: faker.person.fullName(),
  };
});

// --- Compliance Breach Dummy Data ---
const breachTypes = ["Data Privacy", "Safety Protocol", "Editorial Standards", "Financial Reporting", "Content Guidelines", "Equipment Safety"];
const severityLevels = ["Low", "Medium", "High", "Critical"];

// --- English Breach Descriptions ---
const breachDescriptions = [
  "Unauthorized access to sensitive editorial content",
  "Failure to follow data protection protocols",
  "Safety equipment not properly maintained",
  "Editorial standards violated in published content",
  "Financial reporting discrepancies identified",
  "Content guidelines not followed for social media posts",
  "Equipment safety protocols ignored during production",
  "Privacy policy violations in customer data handling",
  "Workplace safety incident not reported timely",
  "Editorial bias detected in news coverage",
  "Confidential source information accidentally disclosed",
  "Copyright infringement in published article",
  "Inappropriate content published without review",
  "Data backup procedures not followed properly",
  "Employee access privileges not revoked after termination",
  "Fire safety protocols violated in studio",
  "Personal data shared without proper consent",
  "Editorial fact-checking process bypassed",
  "Financial controls circumvented without approval",
  "Broadcasting equipment operated without safety checks"
];

// --- English Corrective Actions ---
const correctiveActions = [
  "Additional training provided to staff members",
  "Security protocols updated and implemented",
  "Equipment maintenance schedule revised",
  "Editorial guidelines review and update completed",
  "Financial controls strengthened",
  "Social media policy updated and communicated",
  "Safety training conducted for all staff",
  "Data handling procedures revised",
  "Incident reporting system improved",
  "Editorial review process enhanced",
  "Access control system upgraded",
  "Fact-checking procedures reinforced",
  "Content approval workflow implemented",
  "Regular safety audits scheduled",
  "Staff awareness training completed",
  "Monitoring systems enhanced",
  "Policy documentation updated",
  "Compliance review process established",
  "Emergency response procedures revised",
  "Quality assurance checks increased"
];

const complianceBreachData = Array.from({ length: 180 }, (_, i) => {
  const isResolved = faker.datatype.boolean(0.65); // 65% resolved
  const breachDate = new Date(randomDate(new Date(2023, 0, 1), new Date(2025, 7, 1)));
  const resolutionDate = isResolved ? new Date(breachDate.getTime() + (faker.number.int({ min: 1, max: 60 }) * 24 * 60 * 60 * 1000)) : null;

  return {
    breach_id: `B${String(i + 1).padStart(3, "0")}`,
    department: faker.helpers.arrayElement(departments),
    breach_type: faker.helpers.arrayElement(breachTypes),
    severity: faker.helpers.arrayElement(severityLevels),
    breach_date: breachDate.toISOString().split("T")[0],
    resolved: isResolved,
    resolution_date: resolutionDate ? resolutionDate.toISOString().split("T")[0] : null,
    description: faker.helpers.arrayElement(breachDescriptions),
    corrective_action: isResolved ? faker.helpers.arrayElement(correctiveActions) : null,
    reported_by: faker.person.fullName(),
  };
});

// --- KPI Methods ---
function getCaseResolutionKPIs() {
  const totalCases = caseResolutionData.length;
  const resolvedCases = caseResolutionData.filter(c => c.status === "Resolved" || c.status === "Closed").length;
  const openCases = caseResolutionData.filter(c => c.status === "Open" || c.status === "In Progress").length;
  const avgResolutionTime = caseResolutionData
    .filter(c => c.resolution_time_days)
    .reduce((sum, c) => sum + c.resolution_time_days, 0) / caseResolutionData.filter(c => c.resolution_time_days).length;

  return {
    totalCases,
    resolvedCases,
    openCases,
    avgResolutionTime: avgResolutionTime.toFixed(1),
    resolutionRate: ((resolvedCases / totalCases) * 100).toFixed(1),
  };
}

function getComplianceBreachKPIs() {
  const totalBreaches = complianceBreachData.length;
  const resolvedBreaches = complianceBreachData.filter(b => b.resolved).length;
  const openBreaches = complianceBreachData.filter(b => !b.resolved).length;
  const criticalBreaches = complianceBreachData.filter(b => b.severity === "Critical").length;
  const highSeverityBreaches = complianceBreachData.filter(b => b.severity === "High").length;

  return {
    totalBreaches,
    resolvedBreaches,
    openBreaches,
    criticalBreaches,
    highSeverityBreaches,
    resolutionRate: ((resolvedBreaches / totalBreaches) * 100).toFixed(1),
    criticalBreachRate: ((criticalBreaches / totalBreaches) * 100).toFixed(1),
  };
}

// --- Filter Methods ---
function getCaseTypes() {
  return [...new Set(caseResolutionData.map(c => c.case_type))];
}

function getCaseDepartments() {
  return [...new Set(caseResolutionData.map(c => c.department))];
}

function getCasePriorities() {
  return [...new Set(caseResolutionData.map(c => c.priority))];
}

function getCaseStatuses() {
  return [...new Set(caseResolutionData.map(c => c.status))];
}

function getBreachTypes() {
  return [...new Set(complianceBreachData.map(b => b.breach_type))];
}

function getBreachDepartments() {
  return [...new Set(complianceBreachData.map(b => b.department))];
}

function getSeverityLevels() {
  return [...new Set(complianceBreachData.map(b => b.severity))];
}

function getYears() {
  const years = [
    ...new Set([
      ...caseResolutionData.map(c => new Date(c.open_date).getFullYear()),
      ...complianceBreachData.map(b => new Date(b.breach_date).getFullYear()),
    ]),
  ];
  return years.sort();
}

// --- Specialized Analytics Service Class ---
class CaseComplianceService {
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
    console.log("🔧 [CaseCompliance Service] CaseComplianceService initialized");
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
        console.error("❌ [CaseCompliance Service] API Error:", error.response?.data || error.message);
        throw error;
      }
    );
  }

  // --- Case Resolution Methods ---
  async fetchCaseResolution({ case_type, department, priority, status, year, page = 1, pageSize = 20 } = {}) {
    // Uncomment when real API is ready
    // this.initialize();
    // const response = await this.apiClient.get('/case-resolution', { params: filters });
    // return response.data;

    let data = caseResolutionData;
    if (case_type) data = data.filter(c => c.case_type === case_type);
    if (department) data = data.filter(c => c.department === department);
    if (priority) data = data.filter(c => c.priority === priority);
    if (status) data = data.filter(c => c.status === status);
    if (year) data = data.filter(c => new Date(c.open_date).getFullYear() === Number(year));
    
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- Compliance Breach Methods ---
  async fetchComplianceBreach({ breach_type, department, severity, resolved, year, page = 1, pageSize = 20 } = {}) {
    // this.initialize();
    // const response = await this.apiClient.get('/compliance-breach', { params: filters });
    // return response.data;

    let data = complianceBreachData;
    if (breach_type) data = data.filter(b => b.breach_type === breach_type);
    if (department) data = data.filter(b => b.department === department);
    if (severity) data = data.filter(b => b.severity === severity);
    if (resolved !== undefined) data = data.filter(b => b.resolved === (resolved === 'true'));
    if (year) data = data.filter(b => new Date(b.breach_date).getFullYear() === Number(year));
    
    const total = data.length;
    const paged = data.slice((page - 1) * pageSize, page * pageSize);
    return { total, data: paged };
  }

  // --- KPI Methods ---
  async fetchCaseResolutionKPIs() {
    return getCaseResolutionKPIs();
  }

  async fetchComplianceBreachKPIs() {
    return getComplianceBreachKPIs();
  }

  // --- Filter Methods ---
  async fetchCaseTypes() {
    return getCaseTypes();
  }

  async fetchCaseDepartments() {
    return getCaseDepartments();
  }

  async fetchCasePriorities() {
    return getCasePriorities();
  }

  async fetchCaseStatuses() {
    return getCaseStatuses();
  }

  async fetchBreachTypes() {
    return getBreachTypes();
  }

  async fetchBreachDepartments() {
    return getBreachDepartments();
  }

  async fetchSeverityLevels() {
    return getSeverityLevels();
  }

  async fetchYears() {
    return getYears();
  }
}

export default new CaseComplianceService();