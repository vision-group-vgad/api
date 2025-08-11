const generateArticles = (count) => {
  const editors = [
    "Douglas Mubiru",
    "Maurice Okore",
    "Jane Doe",
    "John Smith",
    "Mary Johnson",
  ];
  const titles = [
    "Bunyoro bishop condemns alcoholism",
    "Bamasaba cultural leader drops PM in cabinet reshuffle",
    "Uganda's sports scene set for thrills in 2025",
    "One shot dead as policeman confronts 'rowdy' group in Apac",
    "Ivory Coast president says French forces to withdraw in January",
    "South Korea investigators vow to execute Yoon arrest warrant",
    "MMC vs. FMU: Mbarara Rally goes to MPU for third year",
    "Uganda's swimmers set multiple records in 2024",
    "Cavs top Lakers in LeBron's first game at 40, Celtics crush Raptors",
    "Navarro stunned by wildcard as Djokovic-Kyrgios doubles run ends",
  ];

  return Array.from({ length: count }, (_, i) => {
    const title = `${titles[i % titles.length]} #${i + 1}`;
    const editor = editors[i % editors.length];
    const updatesCount = Math.floor(Math.random() * 6);
    const updateLogs = Array.from({ length: updatesCount }, () => {
      const year = 2025;
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      return `${year}-${month}-${day}`;
    });

    return {
      pageTitle: title,
      author: "null null",
      streamName: "New Vision Website",
      platform: "web",
      averageDuration: "00:10:21",
      percentageScrolled: 10,
      bounceRate: 1,
      createdOn: `1/${(i % 28) + 1}/2025 4:${(i * 7) % 60}:00 PM`,
      publishedOn: `1/${(i % 28) + 1}/2025 7:${(i * 3) % 60}:00 PM`,
      editingDuration: Math.floor(Math.random() * 20) + 165,
      editor,
      updatesCount,
      updateLogs,
    };
  });
};

export const articles = {
  averageUpdates: 3,
  articleCount: 100,
  articles: generateArticles(100),
};
