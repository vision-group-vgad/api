const categories = ["News", "Sports", "World", "Entertainment", "Business"];
const authors = [
  { first_name: "John", last_name: "Doe" },
  { first_name: "Jane", last_name: "Smith" },
  { first_name: "Michael", last_name: "Brown" },
  { first_name: "Emily", last_name: "Johnson" },
  { first_name: "Robert", last_name: "Williams" },
];
const streams = [
  "New Vision Stream",
  "Sports Vision Stream",
  "Global Vision Stream",
  "Biz Vision Stream",
  "Entertainment Vision Stream",
];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPercent = () => `${Math.floor(Math.random() * 41) + 60}%`;
const randomDuration = () => {
  const min = String(Math.floor(Math.random() * 10)).padStart(2, "0");
  const sec = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `00:${min}:${sec}`;
};
const randomBounce = () => `${Math.floor(Math.random() * 41) + 10}%`;
const randomDate = () => {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `2025-${month}-${day}`;
};

const detailedArticles = Array.from({ length: 200 }, (_, i) => {
  const category = randomChoice(categories);
  const author = randomChoice(authors);
  return {
    externalId: `article-${i + 1}`,
    title: `${category} Headline ${i + 1}`,
    published_on: `${randomDate()}T${String(
      Math.floor(Math.random() * 24)
    ).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(
      2,
      "0"
    )}:00Z`,
    category: { name: category },
    author,
    breaking_news: Math.random() < 0.3,
  };
});

const summarizedArticles = detailedArticles.map((article) => {
  const stream = randomChoice(streams);
  return {
    pagePath: `/${article.category.name.toLowerCase()}/${article.externalId}`,
    percentScrolled: randomPercent(),
    averageDuration: randomDuration(),
    bounceRate: randomBounce(),
    pageLocation: `/${article.category.name.toLowerCase()}/${
      article.externalId
    }`,
    streamName: stream,
  };
});

const getMonthString = (isoDate) => {
  const date = new Date(isoDate);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

function processArticles(detailedArticles, summarizedArticles) {
  const processedArticles = detailedArticles.map((detailedArticle) => {
    const matchingArticle = summarizedArticles.find((sumArticle) =>
      sumArticle.pagePath.includes(detailedArticle.externalId)
    );
    return {
      title: detailedArticle.title,
      percentageScrolled: matchingArticle?.percentScrolled || "",
      avgDuration: matchingArticle?.averageDuration || "",
      bounceRate: matchingArticle?.bounceRate || "",
      publishedDate: detailedArticle.published_on.slice(0, 10),
      pageLocation: matchingArticle?.pageLocation || "",
      category: detailedArticle.category.name,
      author: `${detailedArticle.author.first_name} ${detailedArticle.author.last_name}`,
      streamName: matchingArticle?.streamName || "",
      breakingNews: detailedArticle.breaking_news,
    };
  });

  const trendingStories = processedArticles.filter(
    (article) => article.breakingNews === true
  );

  const monthlyCategoryPerformances = [];

  const articlesByMonth = processedArticles.reduce((acc, article) => {
    const month = getMonthString(article.publishedDate);
    if (!acc[month]) acc[month] = [];
    acc[month].push(article);
    return acc;
  }, {});

  Object.entries(articlesByMonth).forEach(([month, articles]) => {
    const counts = { month };
    categories.forEach((cat) => {
      counts[cat] = articles.filter((a) => a.category === cat).length;
    });
    monthlyCategoryPerformances.push(counts);
  });

  return { trendingStories, monthlyCategoryPerformances };
}

export const response = processArticles(detailedArticles, summarizedArticles);
