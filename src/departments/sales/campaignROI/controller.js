import { getCampaigns } from "./service.js";


export const getCampaignsController = (req, res) => {
  const { startDate, endDate } = req.query;
  const data = getCampaigns(startDate, endDate);
  res.json({ success: true, data });
};
