import IT from "../../../utils/common/IT.js";
import dummy_data from "./system_health_jan_aug_2025.js";

class SysHealthCont {
  #it;
  constructor() {
    this.#it = new IT();
  }

  async getInRangeData(startDate, endDate) {
    try {
      const liveData = await this.#it.fetchLiveData('/it/system-health');
      if (Array.isArray(liveData) && liveData.length > 0) {
        // Group CMS records (per-system flat records) into { date, systems[] } shape
        const byDate = {};
        liveData.forEach(sys => {
          const date = sys.monitoringPeriodStart
            ? sys.monitoringPeriodStart.slice(0, 10)
            : 'unknown';
          if (!byDate[date]) byDate[date] = { date, systems: [] };
          byDate[date].systems.push({
            name: sys.systemName,
            uptimePercent: sys.availabilityPercent ?? 0,
            downtimeMinutes: sys.downtimeMinutes ?? 0,
            incidentCount: sys.errorCount ?? 0,
            slaCompliancePercent: sys.performanceScore ?? 0,
            avgLatencyMs: Math.round((sys.avgResponseTimeMs ?? 0) * 0.7),
            avgResponseTimeMs: sys.avgResponseTimeMs ?? 0,
            throughput: 0,
            errorRatePercent: sys.warningCount ?? 0,
            userSatisfactionScore: 0,
            healthScore: sys.healthScore ?? 0,
          });
        });
        const allEntries = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
        const filtered = allEntries.filter(d => !startDate || !endDate || (d.date >= startDate && d.date <= endDate));
        return { dailyData: filtered.length > 0 ? filtered : allEntries, summary: {} };
      }
    } catch (err) {
      console.warn('[SysHealthScore] Live fetch failed, using dummy:', err.message);
    }
    const filteredAnalytics = dummy_data.dailyData.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const summary = dummy_data.summary;
    return { dailyData: filteredAnalytics, summary };
  }
}

export default SysHealthCont;
