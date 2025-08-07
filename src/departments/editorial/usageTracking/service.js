import axios from "axios";
import dayjs from "dayjs";

// Dummy fallback data
const dummyData = [
  {
    assetId: "img-001",
    assetType: "photo",
    usedInArticles: [
      { title: "Floods Hit Kampala", url: "/article/floods", dateUsed: "2025-08-01", author: "John Doe", platform: "Web" },
      { title: "Rescue Operations", url: "/article/rescue", dateUsed: "2025-08-02", author: "Mary Jane", platform: "App" }
    ],
    usageCount: 2
  },
  {
    assetId: "vid-002",
    assetType: "video",
    usedInArticles: [
      { title: "President's Speech", url: "/article/speech", dateUsed: "2025-07-30", author: "Agnes", platform: "Mobile" }
    ],
    usageCount: 1
  }
];

export const fetchVisualUsageData = async ({ startDate, endDate, author, platform }) => {
  try {
    const sessionAPI = `https://cms-vgad.visiongroup.co.ug/api/api-listings/article-session-duration`;
    const metadataAPI = `https://cms-vgad.visiongroup.co.ug/api/api-listings/articles`;

    const from = startDate || dayjs().subtract(30, "day").format("YYYY-MM-DD");
    const to = endDate || dayjs().format("YYYY-MM-DD");

    const [sessionRes, metaRes] = await Promise.allSettled([
      axios.get(`${sessionAPI}/${from}/${to}`),
      axios.get(`${metadataAPI}/${from}/${to}`)
    ]);

    const sessionData = sessionRes.status === "fulfilled" ? sessionRes.value.data?.data || [] : [];
    const metaData = metaRes.status === "fulfilled" ? metaRes.value.data?.data || [] : [];

    if (!sessionData.length || !metaData.length) return dummyData;

    const assetUsage = {};

    for (const article of metaData) {
      const visuals = article?.mediaAssets || []; 
      const articleInfo = {
        title: article?.title || "Untitled",
        url: article?.url || "#",
        dateUsed: article?.publishedAt || "N/A",
        author: article?.author || "Unknown",
        platform: article?.platform || "Web" // fallback
      };

      // Optional filters
      if (
        (author && articleInfo.author !== author) ||
        (platform && articleInfo.platform !== platform)
      ) continue;

      visuals.forEach(asset => {
        const id = asset.assetId || "unknown-id";
        if (!assetUsage[id]) {
          assetUsage[id] = {
            assetId: id,
            assetType: asset.type || "photo",
            usedInArticles: [],
            usageCount: 0
          };
        }

        assetUsage[id].usedInArticles.push(articleInfo);
        assetUsage[id].usageCount += 1;
      });
    }

    return Object.values(assetUsage);
  } catch (err) {
    console.error("Fallback to dummy due to error:", err.message);
    return dummyData;
  }
};
