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

export const getRandomNumber0to5 = () => {
  return Math.floor(Math.random() * 6);
};
