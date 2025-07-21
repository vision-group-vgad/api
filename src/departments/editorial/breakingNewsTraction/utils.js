function matchArticles(article, sessionDataArray) {
  for (const sessionData of sessionDataArray) {
    if (
      normalizeTitle(sessionData.pageTitle) === normalizeTitle(article.title)
    ) {
      return sessionData;
    }

    if (
      article.externalId &&
      sessionData.pagePath.includes(article.externalId)
    ) {
      return sessionData;
    }

    if (calculateSimilarity(sessionData.pageTitle, article.title) > 0.8) {
      return sessionData;
    }
  }

  return null;
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

function parseAverageDuration(durationString) {
  const parts = durationString.split(":");
  if (parts.length !== 3) return 0;

  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

function calculateEngagementScore(article) {
  let score = 0;

  const durationMinutes = article.averageDurationSeconds / 60;
  if (durationMinutes > 30) score += 4;
  else if (durationMinutes > 15) score += 3;
  else if (durationMinutes > 5) score += 2;
  else if (durationMinutes > 1) score += 1;

  const bounceRate = article.bounceRate;
  if (bounceRate < 0.2) score += 3;
  else if (bounceRate < 0.4) score += 2;
  else if (bounceRate < 0.6) score += 1;

  if (article.sessionMedium === "organic") score += 2;
  else if (article.sessionMedium === "referral") score += 1.5;
  else if (article.sessionMedium === "direct") score += 1;

  if (article.isBreakingNews) score += 1;

  return Math.min(score, 10);
}

function categorizeTraffic(sessionMedium) {
  const categories = {
    organic: "search",
    direct: "direct",
    referral: "referral",
    social: "social",
    email: "email",
    cpc: "paid",
    display: "paid",
  };

  return categories[sessionMedium] || "other";
}

export default {
  matchArticles,
  normalizeTitle,
  calculateSimilarity,
  parseAverageDuration,
  calculateEngagementScore,
  categorizeTraffic,
};
