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
  },
  {
    assetId: "img-003",
    assetType: "photo",
    usedInArticles: [
      { title: "Market Prices Surge", url: "/article/market-prices", dateUsed: "2025-08-03", author: "Peter Kim", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-004",
    assetType: "video",
    usedInArticles: [
      { title: "Sports Highlights", url: "/article/sports", dateUsed: "2025-08-04", author: "John Doe", platform: "App" },
      { title: "Match Analysis", url: "/article/match", dateUsed: "2025-08-05", author: "Mary Jane", platform: "Web" }
    ],
    usageCount: 2
  },
  {
    assetId: "img-005",
    assetType: "photo",
    usedInArticles: [
      { title: "City Festival", url: "/article/festival", dateUsed: "2025-07-28", author: "Agnes", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "info-006",
    assetType: "infographic",
    usedInArticles: [
      { title: "COVID-19 Updates", url: "/article/covid-updates", dateUsed: "2025-08-06", author: "Peter Kim", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-007",
    assetType: "photo",
    usedInArticles: [
      { title: "Traffic Jam in Kampala", url: "/article/traffic", dateUsed: "2025-08-07", author: "John Doe", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-008",
    assetType: "video",
    usedInArticles: [
      { title: "Music Concert", url: "/article/concert", dateUsed: "2025-07-29", author: "Mary Jane", platform: "Mobile" },
      { title: "Behind the Scenes", url: "/article/bts", dateUsed: "2025-08-01", author: "Agnes", platform: "App" }
    ],
    usageCount: 2
  },
  {
    assetId: "aud-009",
    assetType: "audio",
    usedInArticles: [
      { title: "Radio Bulletin", url: "/article/bulletin", dateUsed: "2025-08-02", author: "Peter Kim", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-010",
    assetType: "photo",
    usedInArticles: [
      { title: "New Shopping Mall Opens", url: "/article/mall", dateUsed: "2025-08-03", author: "John Doe", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-011",
    assetType: "video",
    usedInArticles: [
      { title: "Political Debate", url: "/article/debate", dateUsed: "2025-08-04", author: "Mary Jane", platform: "Web" },
      { title: "Follow-up Interview", url: "/article/interview", dateUsed: "2025-08-05", author: "Agnes", platform: "App" }
    ],
    usageCount: 2
  },
  {
    assetId: "img-012",
    assetType: "photo",
    usedInArticles: [
      { title: "Cultural Dance", url: "/article/dance", dateUsed: "2025-08-06", author: "Peter Kim", platform: "Mobile" }
    ],
    usageCount: 1
  },
  {
    assetId: "info-013",
    assetType: "infographic",
    usedInArticles: [
      { title: "Budget Breakdown", url: "/article/budget", dateUsed: "2025-08-07", author: "John Doe", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-014",
    assetType: "photo",
    usedInArticles: [
      { title: "School Reopening", url: "/article/school", dateUsed: "2025-08-08", author: "Agnes", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-015",
    assetType: "video",
    usedInArticles: [
      { title: "Technology Fair", url: "/article/tech-fair", dateUsed: "2025-08-09", author: "Mary Jane", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-016",
    assetType: "photo",
    usedInArticles: [
      { title: "Farmers Market", url: "/article/farmers", dateUsed: "2025-08-10", author: "John Doe", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-017",
    assetType: "video",
    usedInArticles: [
      { title: "Wildlife Documentary", url: "/article/wildlife", dateUsed: "2025-08-11", author: "Peter Kim", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "aud-018",
    assetType: "audio",
    usedInArticles: [
      { title: "Morning Podcast", url: "/article/podcast", dateUsed: "2025-08-12", author: "Mary Jane", platform: "Mobile" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-019",
    assetType: "photo",
    usedInArticles: [
      { title: "Lake Victoria Pollution", url: "/article/lake", dateUsed: "2025-08-13", author: "Agnes", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "info-020",
    assetType: "infographic",
    usedInArticles: [
      { title: "Election Timeline", url: "/article/elections", dateUsed: "2025-08-14", author: "Peter Kim", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-021",
    assetType: "photo",
    usedInArticles: [
      { title: "Graduation Ceremony", url: "/article/graduation", dateUsed: "2025-08-15", author: "John Doe", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-022",
    assetType: "video",
    usedInArticles: [
      { title: "Science Expo", url: "/article/science-expo", dateUsed: "2025-08-16", author: "Mary Jane", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-023",
    assetType: "photo",
    usedInArticles: [
      { title: "Parliament Session", url: "/article/parliament", dateUsed: "2025-08-17", author: "Agnes", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-024",
    assetType: "video",
    usedInArticles: [
      { title: "Health Tips", url: "/article/health", dateUsed: "2025-08-18", author: "Peter Kim", platform: "Mobile" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-025",
    assetType: "photo",
    usedInArticles: [
      { title: "Charity Event", url: "/article/charity", dateUsed: "2025-08-19", author: "John Doe", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "info-026",
    assetType: "infographic",
    usedInArticles: [
      { title: "Climate Change Data", url: "/article/climate", dateUsed: "2025-08-20", author: "Mary Jane", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-027",
    assetType: "photo",
    usedInArticles: [
      { title: "Fire Outbreak", url: "/article/fire", dateUsed: "2025-08-21", author: "Agnes", platform: "App" }
    ],
    usageCount: 1
  },
  {
    assetId: "vid-028",
    assetType: "video",
    usedInArticles: [
      { title: "Tourism Promotion", url: "/article/tourism", dateUsed: "2025-08-22", author: "Peter Kim", platform: "Web" }
    ],
    usageCount: 1
  },
  {
    assetId: "aud-029",
    assetType: "audio",
    usedInArticles: [
      { title: "Evening News Recap", url: "/article/evening-news", dateUsed: "2025-08-22", author: "Mary Jane", platform: "Mobile" }
    ],
    usageCount: 1
  },
  {
    assetId: "img-030",
    assetType: "photo",
    usedInArticles: [
      { title: "Road Construction", url: "/article/construction", dateUsed: "2025-08-22", author: "John Doe", platform: "Web" }
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
    
    return dummyData;
  }
};
