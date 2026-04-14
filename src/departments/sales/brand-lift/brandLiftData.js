export function generateBrandLiftData(count = 100) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const campaigns = [
    { id: "C001", name: "Summer Promo Search", channel: "Google Ads" },
    { id: "C005", name: "Winter Sale Search", channel: "Google Ads" },
    { id: "C006", name: "Remarketing Display", channel: "Google Ads" },
    { id: "C002", name: "LinkedIn Lead Gen", channel: "LinkedIn" },
    { id: "C007", name: "LinkedIn Sponsored Content", channel: "LinkedIn" },
    { id: "C003", name: "Referral Program", channel: "Referral" },
    { id: "C008", name: "Customer Advocacy Program", channel: "Referral" },
    { id: "C004", name: "Email Outreach", channel: "Email" },
    { id: "C009", name: "Newsletter Drip Campaign", channel: "Email" },
  ];

  const data = [];

  function randomDateTime(start, end) {
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    d.setUTCHours(Math.floor(Math.random() * 24));
    d.setUTCMinutes(Math.floor(Math.random() * 60));
    d.setUTCSeconds(Math.floor(Math.random() * 60));
    return d;
  }

  for (let i = 0; i < count; i++) {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const createdDate = randomDateTime(startDate, endDate);

    // 📊 Impressions & Engagements
    const impressions = Math.floor(5000 + Math.random() * 50000); // 5k–55k
    const engagements = Math.floor(impressions * (0.01 + Math.random() * 0.1)); // 1–10%
    const engagementRate = impressions > 0 ? (engagements / impressions) * 100 : 0;

    // 🧮 Survey Score Proxy (numeric!)
    const baseScore = 40 + Math.random() * 10; // baseline awareness 40–50
    const scalingFactor = 1.5;
    const surveyScore = baseScore + (engagementRate * scalingFactor);

    data.push({
      Campaign_ID: campaign.id,
      Campaign_Name: campaign.name,
      Channel: campaign.channel,
      Date: createdDate.toISOString(),
      Impressions: impressions,
      Engagements: engagements,
      EngagementRate: engagementRate, // numeric now
      SurveyScore: surveyScore,        // numeric now
    });
  }

  return data;
}
