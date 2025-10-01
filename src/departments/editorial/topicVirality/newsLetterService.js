import axios from "axios";

const CMS_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api/api-listings/newsletter-analytics";
const TOKEN = process.env.CMS_API_KEY;

if (!TOKEN) throw new Error("Missing CMS_API_TOKEN in environment variables.");

const axiosInstance = axios.create({
  baseURL: CMS_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

/**
 * Compute a simple virality score
 * Score = (unique_opens * 0.5) + (unique_clickers * 1.0)
 */
const computeViralityScore = (nl) => {
  const uniqueOpens = Number(nl.unique_opens || 0);
  const uniqueClickers = Number(nl.unique_clickers || 0);
  return (uniqueOpens * 0.5) + (uniqueClickers * 1.0);
};

export const fetchNewsletterVirality = async (startDate, endDate) => {
  try {
    const url = `/top_newsletters/${startDate}/${endDate}`;
    const response = await axiosInstance.get(url);

    // API response has the array under response.data.data
    const newslettersArray = response.data.data || [];

    return newslettersArray.map((nl) => ({
      newsletterId: nl.newsletter_id,
      subject: nl.subject,
      scheduledDate: nl.scheduled_date,
      totalOpens: Number(nl.total_opens),
      uniqueOpens: Number(nl.unique_opens),
      totalClicks: Number(nl.total_clicks),
      uniqueClickers: Number(nl.unique_clickers),
      clickRate: parseFloat(nl.click_rate),
      estimatedOpenRate: parseFloat(nl.estimated_open_rate),
      viralityScore: computeViralityScore(nl),
    }));
  } catch (err) {
    
    throw err;
  }
};

