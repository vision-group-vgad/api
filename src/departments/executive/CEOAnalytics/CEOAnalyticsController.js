import { fetchAnalytics, fetchKPIs, fetchFilters } from "./CEOAnalyticsService.js";

// Generic handler
const handleRequest = (serviceFn) => async (req, res) => {
  try {
    const data = await serviceFn(req.query);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Exported controllers
export const getAnalytics = handleRequest(fetchAnalytics);
export const getKPIs = handleRequest(fetchKPIs);
export const getFilters = handleRequest(fetchFilters);