export function generateVisitorAnalyticsData(count = 300) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T00:00:00Z");

  const visitorTypes = ["Guest", "Vendor", "Interviewee", "Delivery", "Other"];
  const departments = ["HR", "Finance", "IT", "Editorial", "Admin", "Security"];
  const purposes = ["Meeting", "Delivery", "Interview", "Consultation", "Other"];

  // Collect all weekdays (Mon-Fri) in the range
  const weekdays = [];
  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      weekdays.push(new Date(d));
    }
  }

  const data = [];
  for (let i = 0; i < count; i++) {
    // Pick a random weekday
    const visitDateObj = new Date(weekdays[Math.floor(Math.random() * weekdays.length)]);
    const visitDateStr = visitDateObj.toISOString().slice(0, 10);

    // Realistic arrival between 8am and 5pm
    const arrivalHour = 8 + Math.floor(Math.random() * 9); // 8am to 5pm
    const arrivalMinute = Math.floor(Math.random() * 60);
    const arrivalTimeObj = new Date(
      visitDateStr +
        `T${String(arrivalHour).padStart(2, "0")}:${String(arrivalMinute).padStart(2, "0")}:00Z`
    );

    // Check-in is 1-15 minutes after arrival
    const checkInDelay = Math.floor(Math.random() * 15) + 1; // 1-15 min
    const checkInTimeObj = new Date(arrivalTimeObj.getTime() + checkInDelay * 60 * 1000);

    data.push({
      Visitor_ID: `V${1000 + i}`,
      Visit_Date: visitDateStr,
      Visit_Type: visitorTypes[Math.floor(Math.random() * visitorTypes.length)],
      Arrival_Time: arrivalTimeObj.toISOString().slice(11, 19),
      Check_In_Time: checkInTimeObj.toISOString().slice(11, 19),
      Department_Visited: departments[Math.floor(Math.random() * departments.length)],
      Host_Staff_Name: `Staff ${Math.floor(Math.random() * 50) + 1}`,
      Visit_Purpose: purposes[Math.floor(Math.random() * purposes.length)],
    });
  }

  return data;
}