import { controlEffectivenessData } from './dummy.js';

/**
 * Calculate effectiveness score based on number of findings
 * Max score = 5, min = 1
 */
function calculateEffectivenessScore(findings) {
  let score = 5 - findings; // 1 finding = -1 point
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

/**
 * Fetch control effectiveness records with optional filters
 * @param {Object} filters - { startDate, endDate, department, status }
 */
export function getControls(filters = {}) {
  let data = [...controlEffectivenessData];

  // Filter by department
  if (filters.department) {
    data = data.filter(c => c.department.toLowerCase() === filters.department.toLowerCase());
  }

  // Filter by status
  if (filters.status) {
    data = data.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
  }

  // Filter by date range (based on lastTestedDate)
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    data = data.filter(c => {
      const tested = new Date(c.lastTestedDate);
      return tested >= start && tested <= end;
    });
  }

  // Calculate score & rating dynamically
  data = data.map(c => {
    const score = calculateEffectivenessScore(c.findings);
    return {
      ...c,
      effectivenessScore: score,
      effectivenessRating: getEffectivenessRating(score)
    };
  });

  return data.length > 0 ? data : { message: 'No records exist for the given filters.' };
}
