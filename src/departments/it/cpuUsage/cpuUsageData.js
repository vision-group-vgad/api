export function generateNetworkEvents(count = 300) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const errorTypes = ["Packet Loss", "High Latency", "Connection Drop", "Hardware Failure", "Other"];

  // Collect all days (Mon–Sun)
  const allDays = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDays.push(new Date(d));
  }

  const data = [];

  for (let i = 0; i < count; i++) {
    // Pick a random day
    const eventDateObj = new Date(allDays[Math.floor(Math.random() * allDays.length)]);
    const eventDateStr = eventDateObj.toISOString().slice(0, 10);

    // Pick a random time during the day
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    const dateTime = new Date(
      `${eventDateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}:${String(second).padStart(2, "0")}Z`
    );

    // Generate realistic usage + downtime
    const cpuUsage = Math.floor(Math.random() * 101); // 0–100%
    const memoryUsage = Math.floor(Math.random() * 101); // 0–100%
    const downtime = Math.floor(Math.random() * 121); // 0–120 mins

    // Determine severity
    let severityLevel = "Low";

    const cpuSeverity =
      cpuUsage > 90 ? "Critical" : cpuUsage > 70 ? "High" : cpuUsage > 50 ? "Medium" : "Low";
    const memSeverity =
      memoryUsage > 90 ? "Critical" : memoryUsage > 70 ? "High" : memoryUsage > 50 ? "Medium" : "Low";
    const downtimeSeverity =
      downtime > 60 ? "Critical" : downtime > 30 ? "High" : downtime > 10 ? "Medium" : "Low";

    const severityOrder = ["Low", "Medium", "High", "Critical"];
    severityLevel = [cpuSeverity, memSeverity, downtimeSeverity].reduce((max, current) =>
      severityOrder.indexOf(current) > severityOrder.indexOf(max) ? current : max
    , "Low");

    data.push({
      Event_ID: `E${1000 + i}`,
      Host_Name: `Server-${Math.floor(Math.random() * 20) + 1}`,
      Date: eventDateStr,
      Time: dateTime.toISOString().slice(11, 19),
      cpuUsage,
      memoryUsage,
      downtime,
      severity: severityLevel,
      errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
    });
  }

  return data;
}
