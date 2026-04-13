import { getAssetInventory } from "./service.js";

export const fetchAssetInventory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filters = {};
    if (startDate && endDate) { filters.startDate = startDate; filters.endDate = endDate; }
    const assets = await getAssetInventory(filters);
    res.json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch asset inventory",
      error: error.message,
    });
  }
};
