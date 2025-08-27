export function generateLeadGenData(count = 300) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  // ✅ Multiple campaigns per channel
  const campaigns = [
    { id: "C001", name: "Summer Promo Search", channel: "Google Ads", spendRange: [800, 2000] },
    { id: "C005", name: "Winter Sale Search", channel: "Google Ads", spendRange: [1000, 2500] },
    { id: "C006", name: "Remarketing Display", channel: "Google Ads", spendRange: [500, 1500] },

    { id: "C002", name: "LinkedIn Lead Gen", channel: "LinkedIn", spendRange: [1000, 2500] },
    { id: "C007", name: "LinkedIn Sponsored Content", channel: "LinkedIn", spendRange: [1200, 2800] },

    { id: "C003", name: "Referral Program", channel: "Referral", spendRange: [300, 800] },
    { id: "C008", name: "Customer Advocacy Program", channel: "Referral", spendRange: [400, 900] },

    { id: "C004", name: "Email Outreach", channel: "Email", spendRange: [200, 600] },
    { id: "C009", name: "Newsletter Drip Campaign", channel: "Email", spendRange: [250, 700] },
  ];

  const stages = ["Lead", "MQL", "SQL", "Customer"];

  // 🎯 Funnel conversion probabilities (tunable)
  const stageProbabilities = {
    Lead: 1.0,       // 100% start at Lead
    MQL: 0.7,        // 70% of Leads become MQL
    SQL: 0.4,        // 40% of Leads become SQL
    Customer: 0.2    // 20% of Leads become Customers
  };

  const data = [];

  // Utility: random datetime between two
  function randomDateTime(start, end) {
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    d.setUTCHours(Math.floor(Math.random() * 24));
    d.setUTCMinutes(Math.floor(Math.random() * 60));
    d.setUTCSeconds(Math.floor(Math.random() * 60));
    return d;
  }

  for (let i = 0; i < count; i++) {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const spend = campaign.spendRange[0] + Math.random() * (campaign.spendRange[1] - campaign.spendRange[0]);

    // Lead creation datetime
    const createdDate = randomDateTime(startDate, endDate);

    // Funnel progression with probabilities
    const stageProgression = [];
    let stageDate = new Date(createdDate);

    for (let s = 0; s < stages.length; s++) {
      const stage = stages[s];
      const probability = stageProbabilities[stage];

      if (Math.random() <= probability) {
        stageProgression.push({
          stage,
          stageDate: new Date(stageDate),
        });

        // Each stage takes 1–7 days longer
        stageDate.setDate(stageDate.getDate() + Math.floor(Math.random() * 7) + 1);
        stageDate.setUTCHours(Math.floor(Math.random() * 24));
        stageDate.setUTCMinutes(Math.floor(Math.random() * 60));
        stageDate.setUTCSeconds(Math.floor(Math.random() * 60));
      } else {
        break; // stop progressing further
      }
    }

    // Qualification
    const qualifiedStage = stageProgression.find(s => s.stage === "MQL" || s.stage === "SQL");
    const qualifiedDate = qualifiedStage ? qualifiedStage.stageDate : null;
    const daysToQual =
      qualifiedDate != null
        ? Math.floor((qualifiedDate - createdDate) / (1000 * 60 * 60 * 24))
        : null;

    // Push lead data for each stage
    stageProgression.forEach(sp => {
      data.push({
        Campaign_ID: campaign.id,
        Campaign_Name: campaign.name,
        Channel: campaign.channel,
        Spend: parseFloat(spend.toFixed(2)),
        Lead_ID: `L${1000 + i}`,
        Lead_Source: campaign.channel,
        Lead_Created_Date: createdDate.toISOString(),
        Stage: sp.stage,
        Stage_Date: sp.stageDate.toISOString(),
        Qualified_Date: qualifiedDate ? qualifiedDate.toISOString() : null,
        Days_to_Qualification: daysToQual,
      });
    });
  }

  return data;
}
