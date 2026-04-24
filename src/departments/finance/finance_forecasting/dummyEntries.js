import dayjs from "dayjs";

const REVENUE_ACCOUNTS = [
  "Bukedde Avertising Revenue",
  "Bukedde FM Advertising Rev.",
  "Bukedde Newspaper Sales",
  "Commercial Printing Revenue",
  "Etop Radio Revenue",
  "New Vision Advertising Revenue",
  "New Vision Sales",
  "Publishing Revenue",
  "Radio Rupiny Revenue",
  "Radio west Advertising Rev.",
  "Saturday Adv. Sales",
  "Saturday Vision",
  "Scrap Sales Revenue",
  "Sunday Vision Sales",
  "Website Advertising Revenue",
  "West Television Revenue",
];

const EXPENSE_ACCOUNTS = [
  "Commission Payable",
  "Consumables used",
  "Meeting Expenses",
  "Motor Vehicle Run",
  "Office Tea",
  "Out Sourcing Expenses",
  "Travel and Transport",
  "Internet & Subscription",
];

function randomAmount(min = 5000000, max = 500000000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDummyEntries({ startYear = 2021, endYear = 2025 }) {
  const dummyEntries = [];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

      // Generate 3–6 revenue entries per month
      const revCount = Math.floor(Math.random() * 4) + 3;
      for (let i = 0; i < revCount; i++) {
        const accName =
          REVENUE_ACCOUNTS[Math.floor(Math.random() * REVENUE_ACCOUNTS.length)];
        const amount = randomAmount();
        const date = `${year}-${String(month).padStart(2, "0")}-${String(
          Math.floor(Math.random() * daysInMonth) + 1
        ).padStart(2, "0")}`;

        dummyEntries.push({
          G_L_Account_Name: accName,
          G_L_Account_No: `300${Math.floor(Math.random() * 99)
            .toString()
            .padStart(2, "0")}`,
          Amount: -amount,
          Debit_Amount: 0,
          Credit_Amount: amount,
          Document_Type: "Invoice",
          Posting_Date: date,
        });
      }

      // Generate 3–5 expense entries per month
      const expCount = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < expCount; i++) {
        const accName =
          EXPENSE_ACCOUNTS[Math.floor(Math.random() * EXPENSE_ACCOUNTS.length)];
        const amount = randomAmount(1000000, 300000000);
        const date = `${year}-${String(month).padStart(2, "0")}-${String(
          Math.floor(Math.random() * daysInMonth) + 1
        ).padStart(2, "0")}`;

        dummyEntries.push({
          G_L_Account_Name: accName,
          G_L_Account_No: `400${Math.floor(Math.random() * 99)
            .toString()
            .padStart(2, "0")}`,
          Amount: amount,
          Debit_Amount: amount,
          Credit_Amount: 0,
          Document_Type: "Payment",
          Posting_Date: date,
        });
      }
    }
  }

  return dummyEntries;
}

export default generateDummyEntries;
