// roiData.js
export function generateRoiData(count = 200) {
  const categories = [
    "Sales and Marketing",
    "Research and Development",
    "Operations",
    "IT and Infrastructure",
    "Human Resources",
    "Customer Support"
  ];

  const projectNames = [
    "Q1 Marketing Campaign",
    "New Product Launch",
    "Process Automation",
    "Employee Training Program",
    "System Upgrade",
    "Customer Retention Initiative"
  ];

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  const startDate = new Date("2024-01-01T00:00:00Z");
  const endDate = new Date("2025-12-31T23:59:59Z");

  const data = [];

  for (let i = 0; i < count; i++) {
    const category = randomChoice(categories);
    const projectName = randomChoice(projectNames);
    const date = randomDate(startDate, endDate);

    // Generate investment & revenue numbers
    const investment = Math.floor(5000 + Math.random() * 50000); // $5k–$50k
    const revenue = investment + Math.floor(Math.random() * 75000); // investment + up to $75k profit

    data.push({
      id: `project-${i + 1}`,
      name: projectName,
      investment,
      revenue,
      category,
      date: date.toISOString().slice(0, 10)
    });
  }

  return data;
}
