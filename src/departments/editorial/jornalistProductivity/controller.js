import { getJournalistProductivity } from "./service.js";

export async function getProductivity(req, res) {
  try {
    const {
      startDate = "2025-01-01",
      endDate = "2025-04-30",
      author,
      category,
      page = 1,
      limit = 10
    } = req.query;

    const data = await getJournalistProductivity({
      startDate,
      endDate,
      author,
      category,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    res.json(data);
  } catch (error) {
    console.error("Error fetching productivity data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
