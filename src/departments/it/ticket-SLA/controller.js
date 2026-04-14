import { getSlaOverview, getSlaByPriority, getSlaByAgent } from "./service.js";

export const slaOverview = async (req, res) => {
  res.json(await getSlaOverview());
};

export const slaByPriority = async (req, res) => {
  res.json(await getSlaByPriority());
};

export const slaByAgent = async (req, res) => {
  res.json(await getSlaByAgent());
};
