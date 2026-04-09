import dotenv from "dotenv";
dotenv.config();

import buildVGADUrl from "../../../config/url_builder.js";

// Generic fetch function
const fetchFromAPI = async (query = {}) => {
  try {
    const url = buildVGADUrl("executive/ceo-analytics", query);

    const response = await fetch(url, {
      headers: {
        Accept: process.env.VGAD_ACCEPT || "application/json",
        "x-api-key": process.env.VGAD_API_KEY,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API ${response.status}: ${text}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching CEO Analytics:", error);
    throw error;
  }
};

// Analytics (no type filter)
export const fetchAnalytics = (query) => fetchFromAPI(query);

// KPIs
export const fetchKPIs = (query) => fetchFromAPI({ ...query, kpis: true });

// Filters
export const fetchFilters = (query) => fetchFromAPI({ ...query });