import express from "express";
import {
  getLeaderboard,
  getJournalistMetrics,
  getArticlesByJournalist,
  getJournalistTimeSeries,
  getOverview,
} from "./service.js";

const router = express.Router();

// Route: GET /api/journalist/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const data = await getLeaderboard();
    res.json(data);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Route: GET /api/journalist/metrics/:author
router.get("/metrics/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const data = await getJournalistMetrics(author);
    res.json(data);
  } catch (err) {
    console.error("Error fetching metrics for author:", err);
    res.status(500).json({ error: "Failed to fetch metrics for author" });
  }
});

// Route: GET /api/journalist/articles/:author
router.get("/articles/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const data = await getArticlesByJournalist(author);
    res.json(data);
  } catch (err) {
    console.error("Error fetching articles for author:", err);
    res.status(500).json({ error: "Failed to fetch articles for author" });
  }
});

// Route: GET /api/journalist/timeseries
router.get("/timeseries", async (req, res) => {
  try {
    const data = await getJournalistTimeSeries();
    res.json(data);
  } catch (err) {
    console.error("Error fetching time series data:", err);
    res.status(500).json({ error: "Failed to fetch time series data" });
  }
});

// Route: GET /api/journalist/overview
router.get("/overview", async (req, res) => {
  try {
    const data = await getOverview();
    res.json(data);
  } catch (err) {
    console.error("Error fetching overview data:", err);
    res.status(500).json({ error: "Failed to fetch overview data" });
  }
});

export default router;
