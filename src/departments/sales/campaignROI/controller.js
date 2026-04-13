import { getCampaigns } from "./service.js";

export const getCampaignsController = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const data = await getCampaigns(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
