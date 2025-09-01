export function generateSponsorDataRaw(count = 50) {
  const sponsors = [
    "Acme Corp",
    "Globex Inc",
    "Initech",
    "Umbrella Corp",
    "Soylent Co"
  ];

  const channels = ["Email", "Social Media", "Website", "Referral", "Paid Ads"];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const sponsorName = randomChoice(sponsors);
    const date = randomDate(startDate, endDate);

    // Raw values
    const revenue = +(10000 + Math.random() * 50000).toFixed(2); // 10k–60k
    const investment = +(5000 + Math.random() * 30000).toFixed(2); // 5k–35k
    const acquisitions = Math.floor(50 + Math.random() * 500); // 50–550 leads

    // Marketing channel contribution (optional)
    const channelBreakdown = {};
    channels.forEach(ch => {
      channelBreakdown[ch] = Math.floor(Math.random() * (revenue / channels.length));
    });

    data.push({
      recordId: `SPN-${String(i + 1).padStart(4, "0")}`,
      sponsorName,
      date: date.toISOString().slice(0, 10),

      // Raw fields
      revenue,
      investment,
      acquisitions,
      marketingChannels: channelBreakdown
    });
  }

  return data;
}
