import dayjs from "dayjs";

export const groupByMonth = (entries, valueKey) => {
  const monthly = {};

  entries.forEach((entry) => {
    const month = dayjs(entry.Posting_Date).format("YYYY-MM");
    const value = parseFloat(entry[valueKey] || "0");
    if (!monthly[month]) monthly[month] = 0;
    monthly[month] += value;
  });

  return Object.entries(monthly)
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const mergeNetIncome = (revenues, expenses) => {
  const incomeMap = new Map();

  revenues.forEach(({ month, total }) => {
    incomeMap.set(month, (incomeMap.get(month) || 0) + total);
  });

  expenses.forEach(({ month, total }) => {
    incomeMap.set(month, (incomeMap.get(month) || 0) - total);
  });

  return Array.from(incomeMap.entries())
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const groupCashFlow = (entries) => {
  const monthly = {};

  entries.forEach((entry) => {
    const month = dayjs(entry.Posting_Date).format("YYYY-MM");
    const debit = parseFloat(entry.Debit_Amount || "0");
    const credit = parseFloat(entry.Credit_Amount || "0");
    const net = debit - credit;
    if (!monthly[month]) monthly[month] = 0;
    monthly[month] += net;
  });

  return Object.entries(monthly)
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
