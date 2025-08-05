import axios from "axios";

const SESSION_API = "https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration";
const ARTICLES_API = "https://cms-vgad.visiongroup.co.ug/api/api-listings/articles";

function extractExternalId(pagePath) {
  const parts = pagePath.split("/");
  const last = parts[parts.length - 1];
  return last.startsWith("NV_") || last.startsWith("BUK_") ? last : null;
}

function convertToSeconds(duration) {
  if (!duration) return 0;
  const [h, m, s] = duration.split(":").map(Number);
  return (h * 3600) + (m * 60) + s;
}

function computeVitality(duration, scroll, bounce) {
  const durationScore = Math.min(duration / 300, 1); // max 5 min
  const scrollScore = scroll / 100;
  const bounceScore = 1 - bounce;
  return (durationScore * 0.5) + (scrollScore * 0.3) + (bounceScore * 0.2);
}

async function fetchSessions(start, end) {
  const url = `${SESSION_API}/${start}/${end}`;
  const { data } = await axios.get(url);
  return data.data;
}

async function fetchArticlesPaginated(offset, start, end) {
  const url = `${ARTICLES_API}/${start}/${end}/${offset}`;
  const { data } = await axios.get(url);
  return data.data || [];
}

async function fetchArticlesByExternalIds(externalIds, start, end) {
  const map = {};
  let offset = 0;
  const limit = 10;
  let totalFetched = 0;

  while (true) {
    const articles = await fetchArticlesPaginated(offset, start, end);
    if (articles.length === 0) break;

    for (const article of articles) {
      if (externalIds.includes(article.externalId)) {
        map[article.externalId] = article;
      }
    }

    totalFetched += articles.length;
    if (totalFetched >= 1000) break;
    offset += limit;
  }

  return map;
}

export async function getTopicVitality(startDate, endDate) {
  const sessions = await fetchSessions(startDate, endDate);
  const externalIds = sessions
    .map(s => extractExternalId(s.pagePath))
    .filter(id => id !== null);

  const articlesMap = await fetchArticlesByExternalIds(externalIds, startDate, endDate);

  const topicMap = {};

  for (const session of sessions) {
    const externalId = extractExternalId(session.pagePath);
    if (!externalId || !articlesMap[externalId]) continue;

    const article = articlesMap[externalId];
    const duration = convertToSeconds(session.averageDuration);
    const scroll = parseInt(session.percentScrolled || "0", 10);
    const bounce = parseFloat(session.bounceRate || "0");
    const vitality = computeVitality(duration, scroll, bounce);
    const date = article.published_on?.split(" ")[0];

    (article.tags || []).forEach(tag => {
      if (!topicMap[tag]) {
        topicMap[tag] = {
          tag,
          totalArticles: 0,
          totalDuration: 0,
          totalScroll: 0,
          totalBounceRate: 0,
          vitalityScores: [],
          dates: {}
        };
      }

      const t = topicMap[tag];
      t.totalArticles++;
      t.totalDuration += duration;
      t.totalScroll += scroll;
      t.totalBounceRate += bounce;
      t.vitalityScores.push(vitality);

      if (!t.dates[date]) t.dates[date] = [];
      t.dates[date].push(vitality);
    });
  }

  const results = Object.values(topicMap).map(topic => {
    const avgVitality = topic.vitalityScores.reduce((a, b) => a + b, 0) / topic.vitalityScores.length;
    const avgDuration = topic.totalDuration / topic.totalArticles;
    const avgScroll = topic.totalScroll / topic.totalArticles;
    const avgBounce = topic.totalBounceRate / topic.totalArticles;

    const trend = Object.entries(topic.dates).map(([date, values]) => ({
      date,
      vitalityScore: values.reduce((a, b) => a + b, 0) / values.length
    }));

    return {
      tag: topic.tag,
      totalArticles: topic.totalArticles,
      averageDuration: Math.round(avgDuration),
      averageScroll: Math.round(avgScroll),
      bounceRate: parseFloat(avgBounce.toFixed(2)),
      vitalityScore: parseFloat(avgVitality.toFixed(2)),
      trend
    };
  });

  return results.sort((a, b) => b.vitalityScore - a.vitalityScore);
}
