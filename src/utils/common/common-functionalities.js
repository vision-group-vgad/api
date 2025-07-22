import { uniqueNamesGenerator, names, countries } from "unique-names-generator";

export const getRandomDate = () => {
  const start = new Date("2025-01-01");
  const end = new Date("2025-04-30");

  const startTime = start.getTime();
  const endTime = end.getTime();

  const randomTime =
    Math.floor(Math.random() * (endTime - startTime + 1)) + startTime;

  const randomDate = new Date(randomTime);

  const formattedDate = randomDate.toISOString().split("T")[0];

  return `${formattedDate}`;
};

export const getMonthFromDate = (date) => {
  return parseInt(new Date(date).getMonth() + 1);
};

export const getDayFromDate = (date) => {
  return parseInt(new Date(date).getDay() + 1);
};

export const getRandomNumInRange = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1)) + start;
};

export const extractYearFromDate = (date) => {
  return parseInt(new Date(date).getFullYear());
};

export const getUniqueName = () => {
  const config = {
    dictionaries: [names],
  };

  return `${uniqueNamesGenerator(config)} ${uniqueNamesGenerator(config)}`;
};

export const getPlaceNames = (count) => {
  const config = {
    dictionaries: [countries],
    length: 1,
    style: "capital",
  };

  const names = [];

  for (let i = 0; i < count; i++) {
    const placeName = uniqueNamesGenerator(config);
    names.push(placeName);
  }

  return names;
};

export const getDaysBetweenDates = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error("One or both dates are invalid");
  }

  const diffTime = Math.abs(d2 - d1);

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
};

export const getMostFrequentElement = (arr) => {
  const frequency = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
};

export const truncateToDecimals = (num, decimals) => {
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};
