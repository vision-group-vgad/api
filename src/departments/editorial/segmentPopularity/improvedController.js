import { fetchArticleCategorySummary } from "./improvedService.js";

/**
 * Controller to get segment popularity data from the improvedService.js
 */
export const getSegmentPopularity = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const categories = await fetchArticleCategorySummary(startDate, endDate);

    const sorted = categories.sort((a, b) => b.count - a.count);

    res.json({
      startDate: startDate || "ALL",
      endDate: endDate || "ALL",
      totalSegments: sorted.length,
      data: sorted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
