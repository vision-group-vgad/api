import { storageData } from "./dummyData.js";
import IT from "../../../utils/common/IT.js";

const _it = new IT();

export async function getStorageUtilization(label = null) {
  let source;
  try {
    const liveData = await _it.fetchLiveData('/it/storage-utilization');
    source = Array.isArray(liveData) && liveData.length > 0 ? liveData : storageData;
  } catch (err) {
    console.warn('[StorageUtilization] Live fetch failed, using dummy:', err.message);
    source = storageData;
  }

  const data = label ? source.filter((disk) => (disk.label || disk.disk_name) === label) : source;

  return data.map((disk) => {
    const label = disk.storageName || disk.label || disk.disk_name || disk.name || 'Disk';
    const totalCapacity = disk.totalCapacityGB || disk.totalCapacity || disk.capacity_total || disk.total || 0;
    const used = disk.usedCapacityGB || disk.used || disk.capacity_used || 0;
    const available = disk.availableCapacityGB || disk.available || disk.capacity_free || (totalCapacity - used);
    return { label, totalCapacity, used, available };
  });
}
