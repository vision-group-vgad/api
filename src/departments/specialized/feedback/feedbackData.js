export function generateFeedbackDataRaw(count = 200) {
  const events = [
    "Leadership Summit",
    "Finance Workshop",
    "Tech Expo",
    "Marketing Bootcamp",
    "Investor Meetup"
  ];

  const sessions = [
    "Keynote: Future of Leadership",
    "Workshop: AI in Finance",
    "Panel: Startup Growth Hacks",
    "Breakout: Marketing Automation",
    "Networking: Investor Speed Dating"
  ];

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
    const sessionTitle = randomChoice(sessions);
    const date = randomDate(startDate, endDate);

    // Attendance and feedback logic
    const attended = Math.random() < 0.85; // 85% chance they attended
    const gaveFeedback = attended && Math.random() < 0.75; // 60% of attendees give feedback
    const rating = gaveFeedback ? Math.floor(1 + Math.random() * 5) : null; // Only valid if feedback given

    data.push({
      recordId: `FBK-${String(i + 1).padStart(4, "0")}`,
      eventName,
      sessionTitle,
      date: date.toISOString().slice(0, 10),

      // Raw feedback fields
      attended,
      gaveFeedback,
      rating
    });
  }

  return data;
}
