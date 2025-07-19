import { getJournalistProductivity } from "./service.js";

export async function getProductivity(req, res) {
  try {
    const data = await getJournalistProductivity();
    res.json(data);
  } catch (error) {
    console.error("Error fetching productivity data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
