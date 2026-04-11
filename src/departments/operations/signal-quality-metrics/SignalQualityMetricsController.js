import OpsProduction from "../../../utils/common/OpsProduction.js";
import towers from "./dummy-data.js";

class SignalQualityMetricsController {
  #opsProduction;
  constructor() {
    this.#opsProduction = new OpsProduction();
  }

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.Date >= startDate && obj.Date <= endDate
    );
    const towerPerofmance = this.#getTowerPerformance(data);
    const avgMetrics = this.#getAverageMetrics(data);

    return {
      data: filteredData,
      summary: {
        cell_towers: this.#getUniqueCellTowers(data),
        best_performing_tower: towerPerofmance.bestTower,
        worst_performing_tower: towerPerofmance.worstTower,
        avg_latency: avgMetrics.avgLatency,
        avg_packet_loss: avgMetrics.avgPacketLoss,
      },
    };
  }

  #getUniqueCellTowers(data) {
    return [...new Set(data.map((record) => record.Cell_Tower))];
  }

  #getAverageMetrics(data) {
    const total = data.length;

    const avgLatency = data.reduce((sum, r) => sum + r.Latency_ms, 0) / total;
    const avgPacketLoss =
      data.reduce((sum, r) => sum + r.Packet_Loss_percent, 0) / total;

    return {
      avgLatency: Number(avgLatency.toFixed(2)),
      avgPacketLoss: Number(avgPacketLoss.toFixed(2)),
    };
  }

  #getTowerPerformance(data) {
    const towerStats = {};
    data.forEach((record) => {
      const tower = record.Cell_Tower;
      if (!towerStats[tower]) {
        towerStats[tower] = { totalSINR: 0, count: 0 };
      }
      towerStats[tower].totalSINR += record.SINR_dB;
      towerStats[tower].count++;
    });

    const towerAverages = Object.entries(towerStats).map(([tower, stats]) => ({
      tower,
      avgSINR: stats.totalSINR / stats.count,
    }));

    towerAverages.sort((a, b) => b.avgSINR - a.avgSINR);

    return {
      bestTower: towerAverages[0],
      worstTower: towerAverages[towerAverages.length - 1],
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    let data;
    try {
      const result = await this.#opsProduction.fetchModuleData('signal-quality', startDate, endDate);
      data = result.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn('[SignalQuality] Live data empty, falling back to dummy data');
        data = towers;
      }
    } catch (error) {
      console.warn('[SignalQuality] Live data fetch failed, using dummy data:', error.message);
      data = towers;
    }
    const processedAnalytics = this.#processData(data, startDate, endDate);
    return processedAnalytics;
  }
}

export default SignalQualityMetricsController;
