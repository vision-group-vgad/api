import axios from "axios";

// This uses the article summary api to fetch categories & the article count 
//its faster and its what we are using for segment popularity

const CMS_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api/api-listings";

const dummyCategorySummary = [
  { category_id: 1, category_name: "Politics", count: 1827 },
  { category_id: 2, category_name: "Business", count: 1438 },
  { category_id: 3, category_name: "Sports", count: 1299 },
  { category_id: 4, category_name: "Entertainment", count: 947 },
  { category_id: 5, category_name: "Lifestyle", count: 701 },
];

export const fetchArticleCategorySummary = async (startDate, endDate) => {
  try {
    // If no dates provided, default to 2025-03-01 → 2025-06-30
    const start = startDate || "2025-03-01";
    const end = endDate || "2025-06-30";

    const url = `${CMS_BASE_URL}/articles-analytics-summary/${start}/${end}`;

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${process.env.CMS_API_KEY}`,
      },
    });

    return response.data.article_category || dummyCategorySummary;
  } catch {
    return dummyCategorySummary;
  }
};