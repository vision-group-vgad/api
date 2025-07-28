import TopicVirality from './TopicVirality.js';

export async function getTopicVirality(req, res) {
  try {
    const { year, month } = req.query;
    const topicVirality = new TopicVirality();
    let data;

    if (year && month) {
      data = await topicVirality.getViralityByMonth(year, month);
    } else if (year) {
      data = await topicVirality.getViralityByYear(year);
    } else {
      return res.status(400).json({ error: "Year (and optionally month) required" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching productivity data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}