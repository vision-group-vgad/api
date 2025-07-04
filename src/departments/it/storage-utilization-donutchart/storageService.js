import { storageData } from "./dummyData.js";

export function getStorageUtilization(diskLabel = null) {
  const data = diskLabel
    ? storageData.filter((disk) => disk.label === diskLabel)
    : storageData;

  return data.map(({ label, total, used }) => {
    const available = total - used;
    const usedPercent = ((used / total) * 100).toFixed(2);
    const availablePercent = (100 - usedPercent).toFixed(2);

    return {
      label,
      total,
      used,
      available,
      chartData: {
        labels: ["Used", "Available"],
        values: [used, available],
        percentages: [usedPercent, availablePercent],
      },
    };
  });
}
