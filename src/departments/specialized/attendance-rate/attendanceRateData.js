export function generateAttendanceDataRaw(count = 200) {
    
  const events = [
    "Leadership Summit",
    "Finance Workshop",
    "Tech Expo",
    "Marketing Bootcamp",
    "Investor Meetup"
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
    const eventName = randomChoice(events);
    const date = randomDate(startDate, endDate);

    // Raw values only
    const totalRegistrations = Math.floor(50 + Math.random() * 450); // 50–500
    const totalAttendees = Math.floor(totalRegistrations * (0.7 + Math.random() * 0.25)); // 70–95% turnout
    const totalSeats = Math.floor(totalRegistrations * (1.1 + Math.random() * 0.3)); // 10–40% buffer

    // Channel breakdown (simple split, not forced exact sum)
    const channelBreakdown = {};
    channels.forEach(ch => {
      channelBreakdown[ch] = Math.floor(Math.random() * (totalRegistrations / channels.length) * 2);
    });

    data.push({
      recordId: `ATT-${String(i + 1).padStart(4, "0")}`,
      eventName,
      date: date.toISOString().slice(0, 10),

      // Raw fields only
      totalRegistrations,
      totalAttendees,
      totalSeats,
      marketingChannels: channelBreakdown
    });
  }

  return data;
}
