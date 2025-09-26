import { fetchRightsData } from "./service.js";

export const getRightsData = async (req, res) => {
  try {
    const { status, type } = req.query;
    const data = await fetchRightsData({ status, type });
    res.json(data);
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
};
