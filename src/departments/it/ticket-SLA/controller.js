import { getSlaOverview, getSlaByPriority, getSlaByAgent } from "./service.js";

// SLA Overview
export const slaOverview = (req, res) => {
  res.json(getSlaOverview());
};

// SLA by Priority
export const slaByPriority = (req, res) => {
  res.json(getSlaByPriority());
};

// SLA by Agent
export const slaByAgent = (req, res) => {
  res.json(getSlaByAgent());
};
