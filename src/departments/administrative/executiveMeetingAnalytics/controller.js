import { getMeetingAnalytics } from "./service.js";

export const getExecutiveMeetingAnalytics = async  (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await getMeetingAnalytics(startDate, endDate);
        res.json(data);
    }catch (error){
        console.error("Error fetching meeting analytics", error);
        res.status(500).json({error: "Failed to fetch meeting Analytics data"});
    }
};