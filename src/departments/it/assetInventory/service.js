import IT from "../../../utils/common/IT.js";
import dummyAssets from "./dummy.js";

const _it = new IT();

export const getAssetInventory = async (filters = {}) => {
  let results;
  try {
    const liveData = await _it.fetchLiveData('/it/asset-inventory');
    results = Array.isArray(liveData) && liveData.length > 0 ? [...liveData] : [...dummyAssets];
  } catch (err) {
    console.warn('[AssetInventory] Live fetch failed, using dummy:', err.message);
    results = [...dummyAssets];
  }


  if (filters.startDate && filters.endDate) {
    results = results.filter(a => {
      const d = new Date(a.purchaseDate);
      return d >= new Date(filters.startDate) && d <= new Date(filters.endDate);
    });
  }

  return results;
};
