import { fetchVisualUsageData } from "./service.js";

export const getVisualUsage = async (req, res) => {
  try {
    const { startDate, endDate, author, platform } = req.query;
    const data = await fetchVisualUsageData({ startDate, endDate, author, platform });
    res.json(data);
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
};
