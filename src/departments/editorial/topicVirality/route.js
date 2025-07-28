import express from "express";
import Jwt from "../../../auth/jwt.js";
import getTopicVirality from "./getTopicVirality.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/topic-virality:
 *   get:
 *     summary: Get topic virality data
 *     description: Returns topic virality showing number of articles published, engagements, and media mentions. Filter by year and month.
 *     tags: [Editorial Topic Virality]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: string }
 *         required: true
 *         description: Year to filter by (e.g. 2024)
 *       - in: query
 *         name: month
 *         schema: { type: string }
 *         required: false
 *         description: Month to filter by (e.g. 01)
 * responses:
 *       200:
 *        description: Topic virality data
 * 
 */

router.get("/", Jwt.verifyToken, getTopicVirality, async (req, res) => {
  let { year, month } = req.query;
  year = parseInt(year);

  if (!year) {
    return res.status(400).json({
      message: "Missing required field: year.",
    });
  }

  if (year < 2020 || year > new Date().getFullYear()) {
    return res.status(400).json({
      message: "Invalid year. Please provide a year between 2020 and the current year.",
    });
  }

 try { 
  const data = await getTopicVirality(year, month);
  return res.status(200).json(data);
} catch (error) {
  console.error("Error in getTopicVirality:", error); // use the error
  return res.status(500).json({
    message: "Internal server error.",
  });
}

});

export default router;