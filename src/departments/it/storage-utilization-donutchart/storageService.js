import { storageData } from "./dummyData.js";

export function getStorageUtilization(label = null) {
  const data = label
    ? storageData.filter((disk) => disk.label === label)
    : storageData;

  return data.map(({ label, totalCapacity, used }) => {
    const available = totalCapacity - used;

    return {
      label,
      totalCapacity,
      used,
      available,
    };
  });
}
