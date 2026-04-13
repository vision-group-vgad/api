import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";
import { controlEffectivenessData as dummyData } from './dummy.js';

const execUtils = new ExecutiveUtils();

function calculateEffectivenessScore(findings) {
  let score = 5 - findings;
  if (score < 1) score = 1;
  if (score > 5) score = 5;
  return score;
}

function getEffectivenessRating(score) {
  if (score === 5) return 'Excellent';
  if (score === 4) return 'Good';
  if (score === 3) return 'Fair';
  if (score === 2) return 'Poor';
  return 'Very Poor';
}

function applyFilters(data, filters = {}) {
  if (filters.department) {
    data = data.filter(c => c.department.toLowerCase() === filters.department.toLowerCase());
  }
  if (filters.status) {
    data = data.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
  }
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    data = data.filter(c => {
      const tested = new Date(c.lastTestedDate);
      return tested >= start && tested <= end;
    });
  }
  return data.map(c => ({
    ...c,
    effectivenessScore: c.effectivenessScore != null ? c.effectivenessScore : calculateEffectivenessScore(c.findings),
    effectivenessRating: c.effectivenessRating || getEffectivenessRating(c.effectivenessScore ?? calculateEffectivenessScore(c.findings)),
  }));
}

export async function getControls(filters = {}) {
  try {
    const response = await execUtils.getControlEffectiveness();
    const data = response?.data || [];
    const filtered = applyFilters(data, filters);
    return filtered.length > 0 ? filtered : { message: 'No records exist for the given filters.' };
  } catch (err) {
    console.error('❌ [ControlEff] CMC failed, using dummy:', err.message);
    const filtered = applyFilters([...dummyData], filters);
    return filtered.length > 0 ? filtered : { message: 'No records exist for the given filters.' };
  }
}

