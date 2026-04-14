export const vcData = {
  articles: [
    {
      title:
        "UCDA, three other agencies officially hand over to agriculture ministry",
      dateCreated: "1/2/2025 8:35:51 PM",
      datePublished: "1/2/2025 10:59:26 PM",
      category: "News",
      tags: ["UCDA", "NAADS", "CDO", "DDA", "MAAIF", "Rationalisation"],
      authors: [null],
      editor: "Hannington Mutabazi",
    },
    {
      title: "Man arrested over murder of schoolgirl in Mityana",
      dateCreated: "1/2/2025 7:10:13 PM",
      datePublished: "1/2/2025 9:49:33 PM",
      category: "News",
      tags: [
        "Mityana district",
        "Uganda crime rate",
        "Defilement",
        "Uganda Police",
      ],
      authors: [null],
      editor: "Hannington Mutabazi",
    },
    {
      title: "Four arrested for phone theft at music show",
      dateCreated: "1/2/2025 6:40:13 PM",
      datePublished: "1/2/2025 9:36:52 PM",
      category: "News",
      tags: ["Kampala crime", "Phone theft", "Police"],
      authors: [null],
      editor: "Hannington Mutabazi",
    },
    {
      title: "Museveni crowned Luo elder alongside Kenya's Ruto and Odinga",
      dateCreated: "1/2/2025 6:38:59 PM",
      datePublished: "1/2/2025 9:30:33 PM",
      category: "News",
      tags: [
        "Piny Luo Festival",
        "Yoweri Museveni",
        "William Ruto",
        "Raila Odinga",
        "East Africa",
        "federation",
        "unity",
        "culture",
      ],
      authors: [null],
      editor: "Joseph Kizza",
    },
    {
      title: "Teenage mother held for allegedly burying her baby alive",
      dateCreated: "1/2/2025 6:22:11 PM",
      datePublished: "1/2/2025 9:17:37 PM",
      category: "News",
      tags: [
        "Teenage pregnancy",
        "Teenage mothers",
        "Police crime",
        "Kwania district",
      ],
      authors: [null],
      editor: "Hannington Mutabazi",
    },
    {
      title: "Hoima youth receive tractor amidst chaos",
      dateCreated: "1/2/2025 6:14:44 PM",
      datePublished: "1/2/2025 9:11:05 PM",
      category: "News",
      tags: ["Hoima district", "Police", "Youth chaos"],
      authors: [null],
      editor: "Hannington Mutabazi",
    },
    {
      title:
        "Brothers of Kisubi take perpetual vows, 4 celebrate silver jubilee",
      dateCreated: "1/2/2025 3:56:24 PM",
      datePublished: "1/2/2025 6:55:27 PM",
      category: "News",
      tags: [
        "Brothers of Kisubi",
        "Silver jubilee",
        "St Mary’s College Kisubi",
      ],
      authors: [null],
      editor: "Jacquiline Nakandi",
    },
    {
      title: "Why Parliament remains busy in December",
      dateCreated: "1/2/2025 3:40:26 PM",
      datePublished: "1/2/2025 6:33:09 PM",
      category: "Blogs",
      tags: ["Parliament", "December"],
      authors: [null],
      editor: "Derrick Otim",
    },
    {
      title: "How busy is the daily schedule of a Ugandan adult?",
      dateCreated: "1/2/2025 3:29:47 PM",
      datePublished: "1/2/2025 6:17:02 PM",
      category: "Blogs",
      tags: ["Ugandan", "Productivity", "Schedule"],
      authors: [null],
      editor: "Derrick Otim",
    },
    {
      title: "From promise to power: Redefining the role of Uganda’s diaspora",
      dateCreated: "1/2/2025 3:13:43 PM",
      datePublished: "1/2/2025 6:09:23 PM",
      category: "Blogs",
      tags: ["Uganda", "Diaspora"],
      authors: [null],
      editor: "Derrick Otim",
    },
    ...Array.from({ length: 40 }, (_, i) => {
      const categories = [
        "News",
        "Blogs",
        "Business",
        "Sports",
        "Technology",
        "Culture",
      ];
      const editors = [
        "Editor A",
        "Editor B",
        "Editor C",
        "Editor D",
        "Editor E",
      ];
      const tagsPool = [
        "Economy",
        "Government",
        "Tech",
        "Culture",
        "Sports",
        "Health",
        "Education",
        "Innovation",
      ];
      return {
        title: `Sample Article ${i + 11}`,
        dateCreated: `1/${(i % 28) + 1}/2025 ${8 + (i % 12)}:${
          (i * 3) % 60
        }:00 PM`,
        datePublished: `1/${(i % 28) + 1}/2025 ${9 + (i % 12)}:${
          (i * 5) % 60
        }:00 PM`,
        category: categories[i % categories.length],
        tags: [
          tagsPool[i % tagsPool.length],
          tagsPool[(i + 1) % tagsPool.length],
        ],
        authors: [null],
        editor: editors[i % editors.length],
      };
    }),
  ],
  summary: {
    totalArticles: 50,
    articlesPerDay: {
      "2025-01-02": 10,
      "2025-01-03": 10,
      "2025-01-04": 10,
      "2025-01-05": 10,
      "2025-01-06": 10,
    },
    uniqueEditorCount: 12,
    articleByCategory: {
      News: 20,
      Blogs: 10,
      Business: 5,
      Sports: 5,
      Technology: 5,
      Culture: 5,
    },
    uniqueTagsCount: 120,
    avgPulbishDelay: 2.6,
  },
};
