export function generateMaintenanceTickets(count = 200) {
  const startDate = new Date("2024-07-01T00:00:00Z");
  const endDate = new Date("2025-07-31T23:59:59Z");

  const technicians = [
    { id: "T001", name: "Alice Johnson" },
    { id: "T002", name: "Bob Smith" },
    { id: "T003", name: "Charlie Lee" },
    { id: "T004", name: "Diana Garcia" },
    { id: "T005", name: "Ethan Patel" },
  ];

  const ticketTypes = ["Electrical", "HVAC", "Plumbing", "IT Support", "General Maintenance"];
  const priorities = ["Low", "Medium", "High", "Critical"];

  const data = [];

  function randomDateTime(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  for (let i = 0; i < count; i++) {
    const ticketId = `TK-${String(i + 1).padStart(4, "0")}`;
    const technician = randomChoice(technicians);
    const ticketType = randomChoice(ticketTypes);
    const priority = randomChoice(priorities);

    const createdAt = randomDateTime(startDate, endDate);

    // Simulate realistic resolution time in hours (0.5 hrs to 10 days ~ 240 hours)
    let resolutionHours = parseFloat((Math.random() * 240 + 0.5).toFixed(1));

    // Determine status based on probabilities
    // 70% resolved, 20% in progress, 10% open
    let rand = Math.random();
    let status, resolvedAtValue, resolutionTimeValue;

    if (rand < 0.7) {
      status = "Resolved";
      resolvedAtValue = new Date(createdAt.getTime() + resolutionHours * 60 * 60 * 1000).toISOString();
      resolutionTimeValue = resolutionHours;
    } else if (rand < 0.9) {
      status = "In Progress";
      resolvedAtValue = "In Progress";
      resolutionTimeValue = "Not resolved";
    } else {
      status = "Open";
      resolvedAtValue = "Open";
      resolutionTimeValue = "Not Opened";
    }

    data.push({
      ticketId,
      technicianId: technician.id,
      technicianName: technician.name,
      createdAt: createdAt.toISOString(),
      resolvedAt: resolvedAtValue,
      resolutionTime: resolutionTimeValue,
      ticketType,
      priority,
      status,
    });
  }

  return data;
}
