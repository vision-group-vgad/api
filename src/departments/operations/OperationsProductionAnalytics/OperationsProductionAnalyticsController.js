import OperationsProductionAnalyticsService from './OperationsProductionAnalyticsService.js';

// --- Production Yield Analytics (Paginated) ---
export const getProductionYield = async (req, res) => {
  try {
    const { date, shift, machine, operator, page = 1, pageSize = 10 } = req.query;
    const filters = { date, shift, machine, operator, page: Number(page), pageSize: Number(pageSize) };
    const result = await OperationsProductionAnalyticsService.fetchProductionYield(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { batches, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Production Yield KPIs ---
export const getProductionYieldKPIs = async (req, res) => {
  try {
    const filters = req.query;
    const kpis = await OperationsProductionAnalyticsService.getProductionYieldKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Machine OEE Analytics (Paginated) ---
export const getMachineOEE = async (req, res) => {
  try {
    const { date, machine, line, shift, page = 1, pageSize = 10 } = req.query;
    const filters = { date, machine, line, shift, page: Number(page), pageSize: Number(pageSize) };
    const result = await OperationsProductionAnalyticsService.fetchMachineOEE(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { machines, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Machine OEE KPIs ---
export const getMachineOEEKPIs = async (req, res) => {
  try {
    const filters = req.query;
    const kpis = await OperationsProductionAnalyticsService.getMachineOEEKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Material Waste Analytics (Paginated) ---
export const getMaterialWaste = async (req, res) => {
  try {
    const { date, material, machine, waste_reason, page = 1, pageSize = 10 } = req.query;
    const filters = { date, material, machine, waste_reason, page: Number(page), pageSize: Number(pageSize) };
    const result = await OperationsProductionAnalyticsService.fetchMaterialWaste(filters);
    res.status(200).json({
      success: true,
      filters,
      ...result, // { wastes, totalCount }
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};

// --- Material Waste KPIs ---
export const getMaterialWasteKPIs = async (req, res) => {
  try {
    const filters = req.query;
    const kpis = await OperationsProductionAnalyticsService.getMaterialWasteKPIs(filters);
    res.status(200).json({ success: true, filters, kpis, timestamp: new Date().toISOString() });
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: error.message });
  }
};