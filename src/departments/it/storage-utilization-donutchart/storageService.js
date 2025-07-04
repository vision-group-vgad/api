import { storageData } from "./dummyData.js";

export function getStorageUtilization(diskLabel = null) {
  const data = diskLabel
    ? storageData.filter((disk) => disk.label === diskLabel)
    : storageData;

  return data.map(({ label, totalCapacity, used }) => {
    const available = totalCapacity - used;
    const usedPercent = ((used / totalCapacity) * 100).toFixed(2);
    const availablePercent = (100 - usedPercent).toFixed(2);

    return {
      label,
      totalCapacity,
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
