import CaseComplianceService from "./CaseComplianceService.js";

// --- Case Resolution Analytics ---
export const getCaseResolution = async (req, res) => {
  try {
    console.log("➡️ [Controller] case-resolution HIT", req.query);
    const { case_type, department, priority, status, year, page = 1, pageSize = 20 } = req.query;
    const filters = { case_type, department, priority, status, year, page: Number(page), pageSize: Number(pageSize) };
    const result = await CaseComplianceService.fetchCaseResolution(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Case Resolution Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Compliance Breach Analytics ---
export const getComplianceBreach = async (req, res) => {
  try {
    console.log("➡️ [Controller] compliance-breach HIT", req.query);
    const { breach_type, department, severity, resolved, year, page = 1, pageSize = 20 } = req.query;
    const filters = { breach_type, department, severity, resolved, year, page: Number(page), pageSize: Number(pageSize) };
    const result = await CaseComplianceService.fetchComplianceBreach(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Compliance Breach Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- KPI Endpoints ---
export const getCaseResolutionKPIs = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchCaseResolutionKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplianceBreachKPIs = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchComplianceBreachKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Filter Endpoints ---
export const getCaseTypes = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchCaseTypes();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseDepartments = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchCaseDepartments();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCasePriorities = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchCasePriorities();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseStatuses = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchCaseStatuses();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBreachTypes = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchBreachTypes();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBreachDepartments = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchBreachDepartments();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSeverityLevels = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchSeverityLevels();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getYears = async (req, res) => {
  try {
    const result = await CaseComplianceService.fetchYears();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};