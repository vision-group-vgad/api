import WaitTimeService from "./waitTimeService.js";

export const getWaitTimeAnalytics = async (req, res) => {
  try {
    const { department, visitorType } = req.query;

    const data = await WaitTimeService.getWaitTimeAnalytics({
      department,
      visitorType,
    });

    res.json(data);
  } catch (error) {
    console.error("Wait Time Controller Error:", error);

    res.status(500).json({
      error: "Failed to fetch wait time analytics",
    });
  }
};