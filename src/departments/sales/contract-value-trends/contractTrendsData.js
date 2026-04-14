export function generateContractValueTrends(count = 200) {
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

  // Random date generator
  function randomDateTime(start, end) {
    const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    d.setUTCHours(Math.floor(Math.random() * 24));
    d.setUTCMinutes(Math.floor(Math.random() * 60));
    d.setUTCSeconds(Math.floor(Math.random() * 60));
    return d;
  }

  // Smooth monthly variation helper
  function smoothValue(prevValue) {
    const change = (Math.random() - 0.5) * 0.3; // ±15% change
    return Math.max(1000, prevValue * (1 + change));
  }

  // Baseline contract value
  const baselineContractValue = 5000 + Math.random() * 1500; // 5000–6500

  for (const campaign of campaigns) {
    let prevContractValue = baselineContractValue;

    for (let monthOffset = 0; monthOffset <= 12; monthOffset++) {
      const currentMonth = new Date(startDate);
      currentMonth.setMonth(currentMonth.getMonth() + monthOffset);

      const dealsThisMonth = Math.floor(5 + Math.random() * 15); // number of signed deals
      for (let i = 0; i < dealsThisMonth; i++) {
        const contractValue = smoothValue(prevContractValue);
        prevContractValue = contractValue;

        data.push({
          campaignId: campaign.id,
          campaign: campaign.name,
          channel: campaign.channel,
          signedDate: randomDateTime(currentMonth, endDate).toISOString().slice(0, 10),
          contractValue: parseFloat(contractValue.toFixed(2)),
          leadStage: "Converted",
          month: currentMonth.toISOString().slice(0, 7),
        });
      }
    }
  }

  return {
    baselineContractValue: parseFloat(baselineContractValue.toFixed(2)),
    contractValueTrendsByChannel: data.reduce((acc, row) => {
      if (!acc[row.channel]) acc[row.channel] = [];
      acc[row.channel].push(row);
      return acc;
    }, {}),
  };
}
