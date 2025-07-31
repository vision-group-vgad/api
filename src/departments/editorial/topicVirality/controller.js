import TopicVirality from "./service.js";

const topicViralityService = new TopicVirality();

export const getTopicViralityController = async (req, res) => {
  let { year, month } = req.query;
  year = parseInt(year);

  if (!year) {
    return res.status(400).json({ message: "Missing required field: year." });
  }

  if (year < 2020 || year > new Date().getFullYear()) {
    return res.status(400).json({
      message:
        "Invalid year. Please provide a year between 2020 and the current year.",
    });
  }

  try {
    const data = await topicViralityService.getViralityByMonth(year, month);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getTopicViralityController:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
