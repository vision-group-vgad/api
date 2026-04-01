import VisitorPatternService from "./visitorPatternService.js";

export const getVisitorPatterns = async (req, res) => {
  try {
    const { department, visitorType } = req.query;

    const data = await VisitorPatternService.getVisitorPatterns({
      department,
      visitorType,
    });

    res.json(data);
  } catch (error) {
    console.error("Visitor Pattern Controller Error:", error);

    res.status(500).json({
      error: "Failed to fetch visitor patterns",
    });
  }
};