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

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDurationInMinutes = (created_on, published_on) => {
  if (published_on === "") return 0;

  const createdDate = new Date(created_on);
  const publishedDate = new Date(published_on);

  if (isNaN(createdDate) || isNaN(publishedDate)) {
    throw new Error("Invalid date format.");
  }

  const diffMs = publishedDate - createdDate;

  const diffMinutes = Math.floor(diffMs / 60000);

  return diffMinutes;
};

export const getDateFromTimestamp = (inputTimestamp) => {
  const date = new Date(inputTimestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isValidDate = (dateStr) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  const [year, month, day] = dateStr.split("-").map(Number);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const validateYear = (year, res) => {
  if (!year) {
    res.status(400).json({ message: "Missing required field: year." });
  }

  if (parseInt(year) != 2025) {
    res.status(404).json({
      message: "No data found for that year, only 2025 data is available.",
    });
  }
};

export const validateRange = (startDate, endDate, res) => {
  if (!startDate || !endDate) {
    return res.status(400).json({
      message: "Missing required fields: start-date and end-date.",
    });
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({
      message: "Invalid date(s) format.",
    });
  }

  if (startDate === endDate) {
    return res.status(400).json({
      message:
        "You can not fetch data for a single day. Kindly make them two (2) atleast.",
    });
  }
  if (
    extractYearFromDate(startDate) > 2025 ||
    extractYearFromDate(endDate) < 2025
  ) {
    return res.status(404).json({
      message:
        "No data found for that year. Only 2025 Jan - April, data is available.",
    });
  }
};
