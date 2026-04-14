export function generateCampaignAttributionData(count = 300) {
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
    // Randomly pick 1–3 campaigns for multi-touch
    const shuffled = campaigns.sort(() => 0.5 - Math.random());
    const numTouches = Math.floor(Math.random() * 3) + 1; // 1 to 3 touches
    const campaignsTouched = shuffled.slice(0, numTouches);

    const touchpoints = campaignsTouched.map(c => c.name);
    const channels = [...new Set(campaignsTouched.map(c => c.channel))]; // unique channels

    const createdDate = randomDateTime(startDate, endDate);

    // Determine conversion (30% chance if multi-touch, 20% if single-touch)
    const conversionProbability = numTouches > 1 ? 0.3 : 0.2;
    const isConverted = Math.random() <= conversionProbability;

    // Assign contract value if converted (randomized 1000–10000)
    const contractValue = isConverted ? parseFloat((1000 + Math.random() * 9000).toFixed(2)) : 0;

    data.push({
      Lead_ID: `L${1000 + i}`,
      Lead_Created_Date: createdDate.toISOString(),
      Touchpoints: touchpoints,
      Channels: channels,
      IsConverted: isConverted,
      ContractValue: contractValue,
    });
  }

  return data;
}
