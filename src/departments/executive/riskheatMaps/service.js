import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";
import { dummyRiskData } from "./dummy.js";

const execUtils = new ExecutiveUtils();

function applyFilters(risks, filters = {}) {
  let results = risks.map((r) => ({
    ...r,
    riskScore: r.riskScore != null ? r.riskScore : r.likelihood * r.impact,
  }));

  if (filters.status) {
    results = results.filter((r) => r.status === filters.status);
  }

  if (filters.department) {
    results = results.filter((r) => r.department === filters.department);
  }

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    results = results.filter((r) => {
      const review = new Date(r.reviewDate);
      return review >= start && review <= end;
    });
  }

  return results;
}

export async function getRisks(filters = {}) {
  try {
    const data = await execUtils.getRiskHeatmap();
    const risks = Array.isArray(data) ? data : [];
    return applyFilters(risks, filters);
  } catch (err) {
    console.error("❌ [RiskHeatmap] CMC failed, using dummy:", err.message);
    return applyFilters(dummyRiskData, filters);
  }
}

