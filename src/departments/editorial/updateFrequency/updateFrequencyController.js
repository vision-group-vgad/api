import { generateEditorialDemoData } from "./updateFrequencyData.js";

export const getFreshnessAnalytics = (req, res) => {
  const { author, section } = req.query;

  let data = generateEditorialDemoData(100); 

  // Apply optional filters
  if (author) {
    data = data.filter(a => a.author.toLowerCase() === author.toLowerCase());
  }
  if (section) {
    data = data.filter(a => a.section.toLowerCase() === section.toLowerCase());
  }
  
  
  // Compute counts per filter category for the filtered data
  const counts = {
    authors: {},
    sections: {},
    
  };

  data.forEach(article => {
    counts.authors[article.author] = (counts.authors[article.author] || 0) + 1;
    counts.sections[article.section] = (counts.sections[article.section] || 0) + 1;
  });

  // Format response
  const result = data.map(article => {
    const updateCount = article.updates.length;

    const lastUpdatedDate = updateCount
      ? new Date(Math.max(...article.updates.map(u => new Date(u.timestamp).getTime())))
      : new Date(article.publish_date);

    return {
      article_id: article.article_id,
      title: article.title,
      publish_date: article.publish_date,
      author: article.author,
      section: article.section,
      update_count: updateCount,
      last_updated_date: lastUpdatedDate
    };
  });

  res.json({
    count: data.length,
    countsPerFilter: counts,
    articles: result
  });
};
