import axios from "axios";

// This uses the article summary api to fetch categories & the article count 
//its faster and its what we are using for segment popularity

const CMS_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api/api-listings";

export const fetchArticleCategorySummary = async (startDate, endDate) => {
  try {
    // If no dates provided, default to 2025-03-01 → 2025-06-30
    const start = startDate || "2025-03-01";
    const end = endDate || "2025-06-30";

    const url = `${CMS_BASE_URL}/articles-analytics-summary/${start}/${end}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.CMS_API_KEY}`,
      },
    });

    return response.data.article_category;
  } catch (error) {
    
    throw new Error("Failed to fetch article summary");
  }
};