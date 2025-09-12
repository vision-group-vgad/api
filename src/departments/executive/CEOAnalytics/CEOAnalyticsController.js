import CEOAnalyticsService from "./CEOAnalyticsService.js";

// --- Main Analytics Endpoints ---
export const getGovernanceCompliance = async (req, res) => {
  try {
    const { compliance_area, status, page = 1, pageSize = 20 } = req.query;
    const filters = { compliance_area, status, page: Number(page), pageSize: Number(pageSize) };
    const result = await CEOAnalyticsService.fetchGovernanceCompliance(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLegalExposure = async (req, res) => {
  try {
    const { case_type, risk_level, status, page = 1, pageSize = 20 } = req.query;
    const filters = { case_type, risk_level, status, page: Number(page), pageSize: Number(pageSize) };
    const result = await CEOAnalyticsService.fetchLegalExposure(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBoardReportingMetrics = async (req, res) => {
  try {
    const { year, month, page = 1, pageSize = 20 } = req.query;
    const filters = { year, month, page: Number(page), pageSize: Number(pageSize) };
    const result = await CEOAnalyticsService.fetchBoardReportingMetrics(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkforceAnalytics = async (req, res) => {
  try {
    const { department, year, page = 1, pageSize = 20 } = req.query;
    const filters = { department, year, page: Number(page), pageSize: Number(pageSize) };
    const result = await CEOAnalyticsService.fetchWorkforceAnalytics(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRetentionRates = async (req, res) => {
  try {
    const { year, month, page = 1, pageSize = 20 } = req.query;
    const filters = { year, month, page: Number(page), pageSize: Number(pageSize) };
    const result = await CEOAnalyticsService.fetchRetentionRates(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompensationBenchmarks = async (req, res) => {
  try {
    const { 
      department, 
      roleLevel, 
      region, 
      complianceGap, 
      year, 
      month, 
      page = 1, 
      pageSize = 20 
    } = req.query;
    
    const filters = { 
      department, 
      roleLevel, 
      region, 
      complianceGap, 
      year, 
      month, 
      page: Number(page), 
      pageSize: Number(pageSize) 
    };
    
    const result = await CEOAnalyticsService.fetchCompensationBenchmarks(filters);
    res.status(200).json({ success: true, filters, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- KPI Endpoints ---
export const getGovernanceComplianceKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchGovernanceComplianceKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLegalExposureKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchLegalExposureKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBoardReportingKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchBoardReportingKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkforceKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchWorkforceKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRetentionKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchRetentionKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompensationBenchmarksKPIs = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchCompensationBenchmarksKPIs();
    res.status(200).json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Filter Dropdown Endpoints ---
export const getComplianceAreas = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchComplianceAreas();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplianceStatuses = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchComplianceStatuses();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseTypes = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchCaseTypes();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRiskLevels = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchRiskLevels();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLegalStatuses = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchLegalStatuses();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchDepartments();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getYears = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchYears();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonths = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchMonths();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompensationDepartments = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchCompensationDepartments();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoleLevels = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchRoleLevels();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRegions = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchRegions();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplianceGaps = async (req, res) => {
  try {
    const result = await CEOAnalyticsService.fetchComplianceGaps();
    res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};