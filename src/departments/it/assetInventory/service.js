import dummyAssets from "./dummy.js";

export const getAssetInventory = (filters = {}) => {
  let results = [...dummyAssets];


  if (filters.startDate && filters.endDate) {
    results = results.filter(a => {
      const d = new Date(a.purchaseDate);
      return d >= new Date(filters.startDate) && d <= new Date(filters.endDate);
    });
  }

  return results;
};
