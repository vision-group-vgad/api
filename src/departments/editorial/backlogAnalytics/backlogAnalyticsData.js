const categories = [
  { id: 1, name: "Sports" },
  { id: 2, name: "Politics" },
  { id: 3, name: "Technology" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Health" },
];

const authors = [
  { first_name: "John", last_name: "Doe" },
  { first_name: "Jane", last_name: "Smith" },
  { first_name: "Alice", last_name: "Johnson" },
  { first_name: "Bob", last_name: "Brown" },
  { first_name: "Carol", last_name: "Davis" },
];

const statuses = ["draft", "in-review", "ready"];
const priorities = ["low", "medium", "high"];

// Helper to get random date in April 2025
function randomDateInApril2025() {
  const day = Math.floor(Math.random() * 30) + 1;
  const hour = Math.floor(Math.random() * 12) + 1;
  const minute = Math.floor(Math.random() * 60);
  const ampm = Math.random() > 0.5 ? "AM" : "PM";
  return `7/${day}/2025 ${hour}:${minute.toString().padStart(2, "0")}:00 ${ampm}`;
}

// Fixed helper to shift date by X days with proper 12-hour formatting
function shiftDate(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour to 12-hour format
  hours = hours % 12;
  if (hours === 0) hours = 12; // 12 AM or 12 PM

  return `${date.getMonth() + 1}/${date.getDate()}/2025 ${hours}:${minutes
    .toString()
    .padStart(2, "0")}:00 ${ampm}`;
}

const mockBacklogArticles = [];

for (let i = 1; i <= 1000; i++) {
  const category = categories[i % categories.length];
  const author = authors[i % authors.length];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[i % priorities.length];
  const queueTime = `${Math.floor(Math.random() * 5) + 1} days`;

  const created_on = randomDateInApril2025();
  let published_on = null;
  let last_modified_on = created_on;

  if (status === "draft") {
    last_modified_on = shiftDate(created_on, Math.floor(Math.random() * 2) + 1); // 1-2 days after creation
  } else if (status === "in-review") {
    last_modified_on = shiftDate(created_on, Math.floor(Math.random() * 5) + 2); // 2-6 days after creation
  } else if (status === "ready") {
    published_on = shiftDate(created_on, Math.floor(Math.random() * 10) + 5); // 5-14 days after creation
    last_modified_on = shiftDate(published_on, -1); // 1 day before publish
  }

  mockBacklogArticles.push({
    id: i,
    externalId: `NV_${i}`,
    created_on,
    published_on,
    last_modified_on,
    title: `Mock Article ${i}`,
    category,
    author,
    status,
    queueTime,
    priority,
  });
}

export default mockBacklogArticles;
