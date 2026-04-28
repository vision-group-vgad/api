import SalesMarketing from "../../../utils/common/SalesMkting.js";
import revenueData from "./dummy-data.js";

class RevenueAttributionController {
  #salesMkt;
  constructor() {
    this.#salesMkt = new SalesMarketing();
  }

  #aggregateToMonthly(weeklyData) {
    const months = new Map();
    for (const row of weeklyData) {
      const key = row.date.slice(0, 7); // YYYY-MM
      if (!months.has(key)) months.set(key, []);
      months.get(key).push(row);
    }

    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, weeks]) => {
        const [year, month] = monthKey.split("-").map(Number);
        const date = `${monthKey}-01`;
        const month_label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
          "en-US",
          { month: "long", year: "numeric", timeZone: "UTC" }
        );

        const segmentMap = new Map();
        for (const w of weeks) {
          for (const s of w.revenue) {
            segmentMap.set(s.segment, (segmentMap.get(s.segment) || 0) + s.amount);
          }
        }

        const revenue = Array.from(segmentMap.entries())
          .map(([segment, amount]) => ({ segment, amount: parseFloat(amount.toFixed(2)) }))
          .sort((a, b) => b.amount - a.amount);

        return { date, month_label, revenue };
      });
  }

  #processData(data, startDate, endDate) {
    const rangeFiltered = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    const source = rangeFiltered.length > 0 ? rangeFiltered : data;

    // Live data arrives already monthly (month_label present); dummy data is weekly.
    const isAlreadyMonthly = source.length > 0 && "month_label" in source[0];
    const monthlyData = isAlreadyMonthly ? source : this.#aggregateToMonthly(source);

    const totalRevenue = monthlyData.reduce((total, month) => {
      const monthTotal = month.revenue.reduce(
        (sum, segment) => sum + segment.amount,
        0
      );
      return total + monthTotal;
    }, 0);

    return {
      data: monthlyData,
      summary: {
        total_revenue: totalRevenue,
        revenue_sources: monthlyData[0]?.revenue?.length ?? 0,
      },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const liveData = await this.#salesMkt.getRevenueAttributionData(
        startDate,
        endDate
      );

      if (liveData.length > 0) {
        return this.#processData(liveData, startDate, endDate);
      }
    } catch (error) {
      console.warn(
        "Using fallback revenue attribution data due to live fetch error:",
        error.message
      );
    }

    return this.#processData(revenueData, startDate, endDate);
  }
}

export default RevenueAttributionController;
