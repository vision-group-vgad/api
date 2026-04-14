import OpsProduction from "../../../utils/common/OpsProduction.js";
import logs from "./dummy-data.js";

class UpDowntimeController {
  #opsProduction;
  constructor() {
    this.#opsProduction = new OpsProduction();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );

    return {
      data: filteredData,
      summary: {
        most_failing_machine: this.#getMostFailureProneMachine(data),
        daily_average_machine_uptime: this.#getAverageUptimePerMachine(data),
        daily_average_machine_donwtime:
          this.#getAverageDowntimePerMachine(data),
      },
    };
  }

  #getMostFailureProneMachine(data) {
    const downtimePerMachine = {};

    data.forEach((record) => {
      if (!downtimePerMachine[record.machine])
        downtimePerMachine[record.machine] = 0;
      downtimePerMachine[record.machine] += record.downtime_hours || 0;
    });

    const entries = Object.entries(downtimePerMachine);
    entries.sort((a, b) => b[1] - a[1]);

    return {
      machine: entries[0][0],
      total_downtime_hours: Math.round(entries[0][1]),
    };
  }

  #getAverageDowntimePerMachine(data) {
    const downtimeByDate = {};

    data.forEach((record) => {
      if (!downtimeByDate[record.date]) downtimeByDate[record.date] = 0;
      downtimeByDate[record.date] += record.downtime_hours || 0;
    });

    const totalDays = Object.keys(downtimeByDate).length;
    const totalDowntime = Object.values(downtimeByDate).reduce(
      (sum, val) => sum + val,
      0
    );

    const avgDailyDowntime = Number((totalDowntime / totalDays).toFixed(2));

    return avgDailyDowntime;
  }

  #getAverageUptimePerMachine(data) {
    const uptimeByDate = {};

    data.forEach((record) => {
      if (!uptimeByDate[record.date]) uptimeByDate[record.date] = 0;
      uptimeByDate[record.date] += record.uptime_hours || 0;
    });

    const totalDays = Object.keys(uptimeByDate).length;
    const totalUptime = Object.values(uptimeByDate).reduce(
      (sum, val) => sum + val,
      0
    );

    const avgDailyUptime = Number((totalUptime / totalDays).toFixed(2));

    return avgDailyUptime;
  }

  async getInRangeAnalytics(startDate, endDate) {
    let data;
    try {
      const result = await this.#opsProduction.fetchModuleData('updown-time', startDate, endDate);
      data = result.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('[UpDowntime] Live data empty, falling back to dummy data');
        data = logs;
      }
    } catch (error) {
      console.warn('[UpDowntime] Live data fetch failed, using dummy data:', error.message);
      data = logs;
    }
    const processedAnalytics = this.#processData(data, startDate, endDate);
    return processedAnalytics;
  }
}

export default UpDowntimeController;
