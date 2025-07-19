import axios from "axios";

const CMS_API_URL = "https://cms-vgad.visiongroup.co.ug/api/bc-datasets";
const CMS_TOKEN = process.env.CMS_TOKEN;

export async function fetchCMSData(startDate, endDate) {
  const url = `${CMS_API_URL}/${startDate}/${endDate}`;
  const headers = { Authorization: `Bearer ${CMS_TOKEN}` };
  const { data } = await axios.get(url, { headers });
  return data.data || [];
}

export function enhanceArticles(data) {
  const authors = [
    "Mukisa Brian",
    "Sarah Akena",
    "Daniel Lutaaya",
    "Mary Nabunya",
  ];
  return data.map((item, i) => {
    const author = authors[i % authors.length];
    const views = Math.floor(Math.random() * 1000) + 100;
    const likes = Math.floor(Math.random() * 200);
    const comments = Math.floor(Math.random() * 50);
    const publishedAt = new Date(
      Date.now() - Math.random() * 1e10
    ).toISOString();
    return {
      ...item,
      author,
      views,
      likes,
      comments,
      publishedAt,
    };
  });
}

export function computeJournalistMetrics(articles) {
  const grouped = {};

  articles.forEach((a) => {
    if (!grouped[a.author]) grouped[a.author] = [];
    grouped[a.author].push(a);
  });

  const leaderboard = Object.entries(grouped).map(([author, arts]) => {
    const totalArticles = arts.length;
    const totalViews = arts.reduce((sum, a) => sum + a.views, 0);
    const avgViews = +(totalViews / totalArticles).toFixed(1);
    return { author, totalArticles, totalViews, avgViews };
  });

  const timeseries = articles.map((a) => ({
    author: a.author,
    date: new Date(a.publishedAt).toISOString().split("T")[0],
    views: a.views,
  }));

  return { leaderboard, timeseries, allArticles: articles, grouped };
}

export function getOverviewStats(articles) {
  const totalArticles = articles.length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const avgViews = +(totalViews / totalArticles).toFixed(1);
  const bounceRate = +(
    articles.reduce((sum, a) => sum + parseFloat(a.bounceRate || 0), 0) /
    totalArticles
  ).toFixed(1);
  const averageDuration =
    articles.reduce((sum, a) => sum + parseDuration(a.averageDuration), 0) /
    totalArticles;

  return {
    totalArticles,
    totalViews,
    avgViews,
    averageDuration: formatSeconds(averageDuration),
    bounceRate: bounceRate + "%",
  };
}

function parseDuration(str = "00:00:00") {
  //const parts = str.split(":".repeat(3));
  const [h, m, s] = str.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function formatSeconds(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}
