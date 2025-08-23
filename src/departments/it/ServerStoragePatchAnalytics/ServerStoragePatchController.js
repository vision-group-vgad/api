import ServerStoragePatchService from './ServerStoragePatchService.js';

// ---- Unified Endpoints ----

// Server Load Analytics (Paginated)
export const getServerLoadAnalytics = async (req, res) => {
  try {
    console.log("➡️ [Controller] server-load HIT", req.query);
    const { hostname, page = 1, pageSize = 10 } = req.query;
    const filters = { hostname, page: Number(page), pageSize: Number(pageSize) };
    const result = await ServerStoragePatchService.fetchAllServers(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { servers, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Server Load KPIs
export const getServerLoadKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] server-load KPIs HIT", req.query);
    const { hostname } = req.query;
    const filters = { hostname };
    const kpis = await ServerStoragePatchService.getServerLoadKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Storage Utilization Analytics (Paginated)
export const getStorageAnalytics = async (req, res) => {
  try {
    console.log("➡️ [Controller] storage HIT", req.query);
    const { diskName, page = 1, pageSize = 10 } = req.query;
    const filters = { diskName, page: Number(page), pageSize: Number(pageSize) };
    const result = await ServerStoragePatchService.fetchAllStorages(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { storages, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Storage KPIs
export const getStorageKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] storage KPIs HIT", req.query);
    const { diskName } = req.query;
    const filters = { diskName };
    const kpis = await ServerStoragePatchService.getStorageKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Patch Compliance Analytics (Paginated)
export const getPatchComplianceAnalytics = async (req, res) => {
  try {
    console.log("➡️ [Controller] patch-compliance HIT", req.query);
    const { osVersion, page = 1, pageSize = 10 } = req.query;
    const filters = { osVersion, page: Number(page), pageSize: Number(pageSize) };
    const result = await ServerStoragePatchService.fetchAllPatchCompliance(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { patchCompliance, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Patch Compliance KPIs
export const getPatchComplianceKPIs = async (req, res) => {
  try {
    console.log("➡️ [Controller] patch-compliance KPIs HIT", req.query);
    const { osVersion } = req.query;
    const filters = { osVersion };
    const kpis = await ServerStoragePatchService.getPatchComplianceKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ [Controller] Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};