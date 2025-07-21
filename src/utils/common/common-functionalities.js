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
