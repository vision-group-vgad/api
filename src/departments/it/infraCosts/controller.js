import { getInfrastructureCosts } from "./service.js";

export const fetchInfrastructureCosts = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const costs = await getInfrastructureCosts({ category, startDate, endDate });

    res.status(200).json({
      success: true,
      count: costs.length,
      data: costs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
