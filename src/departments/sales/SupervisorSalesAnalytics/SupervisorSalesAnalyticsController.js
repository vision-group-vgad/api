import SupervisorSalesAnalyticsService from './SupervisorSalesAnalyticsService.js';

// --- Supervisor Analytics Overview ---
export const getSupervisorAnalyticsOverview = async (req, res) => {
  try {
    console.log("➡️ [Controller] supervisor-analytics overview HIT", req.query);
    const filters = {
      startDate: req.query.startDate || req.query.start_date,
      endDate: req.query.endDate || req.query.end_date,
      roleCode: req.user?.role_code,
    };

    const data = await SupervisorSalesAnalyticsService.getSupervisorAnalyticsOverview(
      filters
    );

    res.status(200).json({
      success: true,
      filters,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Supervisor Analytics Overview Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// --- Pipeline Velocity Analytics (Paginated) ---
export const getPipelineVelocity = async (req, res) => {
  try {
    console.log("➡️ [Controller] pipeline-velocity HIT", req.query);
    const { stage, owner, region, product, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    const filters = { stage, owner, region, product, startDate, endDate, page: Number(page), pageSize: Number(pageSize), roleCode: req.user?.role_code };
    const result = await SupervisorSalesAnalyticsService.fetchPipelineVelocity(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { deals, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Pipeline Velocity Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Pipeline Velocity KPIs ---
export const getPipelineVelocityKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] pipeline-velocity KPIs HIT", req.query);
    const filters = { ...req.query, roleCode: req.user?.role_code };
    const kpis = await SupervisorSalesAnalyticsService.getPipelineVelocityKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Pipeline Velocity KPIs Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Quota Attainment Analytics (Paginated) ---
export const getQuotaAttainment = async (req, res) => {
  try {
    console.log("➡️ [Controller] quota-attainment HIT", req.query);
    const { rep_id, region, period, page = 1, pageSize = 10 } = req.query;
    const filters = { rep_id, region, period, page: Number(page), pageSize: Number(pageSize), roleCode: req.user?.role_code };
    const result = await SupervisorSalesAnalyticsService.fetchQuotaAttainment(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { reps, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Quota Attainment Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Quota Attainment KPIs ---
export const getQuotaAttainmentKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] quota-attainment KPIs HIT", req.query);
    const filters = { ...req.query, roleCode: req.user?.role_code };
    const kpis = await SupervisorSalesAnalyticsService.getQuotaAttainmentKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Quota Attainment KPIs Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Account Penetration Analytics (Paginated) ---
export const getAccountPenetration = async (req, res) => {
  try {
    console.log("➡️ [Controller] account-penetration HIT", req.query);
    const { industry, region, account_size, page = 1, pageSize = 10 } = req.query;
    const filters = { industry, region, account_size, page: Number(page), pageSize: Number(pageSize), roleCode: req.user?.role_code };
    const result = await SupervisorSalesAnalyticsService.fetchAccountPenetration(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { accounts, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Account Penetration Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Account Penetration KPIs ---
export const getAccountPenetrationKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] account-penetration KPIs HIT", req.query);
    const filters = { ...req.query, roleCode: req.user?.role_code };
    const kpis = await SupervisorSalesAnalyticsService.getAccountPenetrationKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Account Penetration KPIs Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Corporate Account Health Analytics (Paginated) ---
export const getCorporateAccountHealth = async (req, res) => {
  try {
    console.log("➡️ [Controller] corporate-account-health HIT", req.query);
    const { account_manager, region, account_size, health_status, page = 1, pageSize = 10 } = req.query;
    const filters = { account_manager, region, account_size, health_status, page: Number(page), pageSize: Number(pageSize), roleCode: req.user?.role_code };
    const result = await SupervisorSalesAnalyticsService.fetchCorporateAccountHealth(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { accounts, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Corporate Account Health Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Corporate Account Health KPIs ---
export const getCorporateAccountHealthKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] corporate-account-health KPIs HIT", req.query);
    const filters = { ...req.query, roleCode: req.user?.role_code };
    const kpis = await SupervisorSalesAnalyticsService.getCorporateAccountHealthKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Corporate Account Health KPIs Error:", error);
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};