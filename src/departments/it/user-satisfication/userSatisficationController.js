import { generateSatisfactionFeedback } from "./userSatisficationData.js";

const satisfactionLevels = ["Unsatisfied", "Neutral", "Satisfied"];

export const generateSatisfactionFeedbackController = (req, res) => {
  try {
    const data = generateSatisfactionFeedback(300);

    // --- Apply filters ---
    let filtered = data;
    const { department, role, satisfaction } = req.query;

    if (department) {
      const departmentsArray = department.split(",");
      filtered = filtered.filter(d =>
        departmentsArray.includes(d.Department)
      );
    }
    if (role) {
      const rolesArray = role.split(",");
      filtered = filtered.filter(d => rolesArray.includes(d.Role));
    }
    if (satisfaction) {
      const satisfactionArray = satisfaction.split(",");
      filtered = filtered.filter(d =>
        satisfactionArray.includes(d.Satisfaction_Score)
      );
    }

    // --- KPI Calculations ---
    const totalFeedback = filtered.length;

    // Overall satisfaction distribution (only non-zero)
    const satisfactionDistribution = satisfactionLevels
      .map(level => {
        const count = filtered.filter(d => d.Satisfaction_Score === level).length;
        return count > 0
          ? {
              level,
              count,
              percentage: ((count / totalFeedback) * 100).toFixed(2)
            }
          : null;
      })
      .filter(Boolean); // remove nulls

    // Department-level breakdown
    const deptStats = {};
    filtered.forEach(d => {
      if (!deptStats[d.Department]) {
        deptStats[d.Department] = { total: 0, counts: {} };
        satisfactionLevels.forEach(l => (deptStats[d.Department].counts[l] = 0));
      }
      deptStats[d.Department].total++;
      deptStats[d.Department].counts[d.Satisfaction_Score]++;
    });

    const departmentBreakdown = Object.entries(deptStats).map(([dept, stats]) => {
      const dist = {};
      const counts = {};
      satisfactionLevels.forEach(level => {
        if (stats.counts[level] > 0) {
          dist[level] = ((stats.counts[level] / stats.total) * 100).toFixed(2);
          counts[level] = stats.counts[level];
        }
      });
      return { department: dept, distribution: dist, counts };
    });

    // Role-level breakdown
    const roleStats = {};
    filtered.forEach(d => {
      if (!roleStats[d.Role]) {
        roleStats[d.Role] = { total: 0, counts: {} };
        satisfactionLevels.forEach(l => (roleStats[d.Role].counts[l] = 0));
      }
      roleStats[d.Role].total++;
      roleStats[d.Role].counts[d.Satisfaction_Score]++;
    });

    const roleBreakdown = Object.entries(roleStats).map(([role, stats]) => {
      const dist = {};
      const counts = {};
      satisfactionLevels.forEach(level => {
        if (stats.counts[level] > 0) {
          dist[level] = ((stats.counts[level] / stats.total) * 100).toFixed(2);
          counts[level] = stats.counts[level];
        }
      });
      return { role, distribution: dist, counts };
    });

    // Feedback Text distribution (counts + percentages + level, only non-zero)
    const feedbackStats = {};
    filtered.forEach(d => {
      if (!feedbackStats[d.Feedback_Text]) {
        feedbackStats[d.Feedback_Text] = {
          count: 0,
          level: d.Satisfaction_Score
        };
      }
      feedbackStats[d.Feedback_Text].count++;
    });

    const feedbackDistribution = Object.entries(feedbackStats).map(
      ([text, stats]) => ({
        feedback: text,
        level: stats.level,
        count: stats.count,
        percentage: ((stats.count / totalFeedback) * 100).toFixed(2)
      })
    );

    // --- Response ---
    res.json({
      totalFeedback,
      satisfactionDistribution,
      departmentBreakdown,
      roleBreakdown,
      feedbackDistribution,
      feedbackData: filtered
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
