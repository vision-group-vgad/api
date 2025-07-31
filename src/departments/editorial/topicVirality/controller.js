import { getTopicVirality } from "./service.js";

// const topicViralityService = new TopicVirality();

export const getTopicViralityController = async (req, res) => {
  let { year, month, category, author } = req.query;
  year = parseInt(year);
  month = month ? parseInt(month) : null;

  console.log("Received query:", { year, month, category, author });

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
    const data = await getTopicVirality({
      year,
      month,
      category,
      author,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getTopicViralityController:", error);
    const statusCode = error.message?.includes("400") ? 400 : 500;
    return res
      .status(statusCode)
      .json({ message: error.message || "Internal server error." });
  }
};
