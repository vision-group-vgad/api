import { getJournalistProductivity } from "./service.js";


export const getProductivity = async (req, res) => {
  try {
    const { startDate, endDate, author, category, page = 1, limit = 20 } = req.query;

    // Ensure numeric values and enforce max limit of 20
    const safeLimit = Math.min(parseInt(limit, 10) || 20, 20);
    const safePage = parseInt(page, 10) || 1;

    const result = await getJournalistProductivity({
      startDate,
      endDate,
      author,
      category,
      page: safePage,
      limit: safeLimit,
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching productivity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch journalist productivity",
      error: error.message,
    });
  }
};

