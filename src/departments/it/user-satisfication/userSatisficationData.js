export function generateSatisfactionFeedback(count = 300) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const roles = ["Helpdesk Agent", "Network Engineer", "System Admin", "Support Manager"];
  const satisfactionLevels = ["Unsatisfied", "Neutral", "Satisfied"];
  const departments = [
    "Finance",
    "HR",
    "IT",
    "Sales And Operations",
    "Editorial & Content",
    "Administrative & Support",
    "Others",
  ];

  const feedbackTexts = {
    Unsatisfied: [
      "The issue was not resolved.",
      "Too much delay in response.",
      "Unhelpful support experience.",
      "Problem keeps recurring.",
      "Not satisfied with the service."
    ],
    Neutral: [
      "The issue was partially resolved.",
      "Response time was average.",
      "Experience was okay but can be better.",
      "Support was neither good nor bad.",
      "Service was acceptable."
    ],
    Satisfied: [
      "Quick and effective resolution!",
      "Very helpful support staff.",
      "Great experience overall.",
      "The problem was resolved smoothly.",
      "Excellent service."
    ]
  };

  // Collect all days in range
  const allDays = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDays.push(new Date(d));
  }

  const data = [];

  for (let i = 0; i < count; i++) {
    // Pick a random date
    const eventDateObj = new Date(allDays[Math.floor(Math.random() * allDays.length)]);
    const eventDateStr = eventDateObj.toISOString().slice(0, 10);

    // Random time
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const dateTime = new Date(
      `${eventDateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:${String(second).padStart(2, "0")}Z`
    );

    // Random role, department, satisfaction
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const satisfaction = satisfactionLevels[Math.floor(Math.random() * satisfactionLevels.length)];

    // Pick a feedback text from correct satisfaction pool
    const feedbackTextPool = feedbackTexts[satisfaction];
    const feedbackText = feedbackTextPool[Math.floor(Math.random() * feedbackTextPool.length)];

    data.push({
      Feedback_ID: `F${1000 + i}`,
      Department: department,
      Role: role,
      Date: eventDateStr,
      Time: dateTime.toISOString().slice(11, 19),
      Satisfaction_Score: satisfaction,
      Feedback_Text: feedbackText
    });
  }

  return data;
}
