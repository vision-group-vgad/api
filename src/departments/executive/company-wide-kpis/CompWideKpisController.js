import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";
import wide_kpis from "./dummy-data.js";

const _execUtils = new ExecutiveUtils();

class CompWideKpisController {
  constructor() {}

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
        const n = weeks.length;
        const avg = (vals) => vals.reduce((s, v) => s + v, 0) / n;
        const sum = (vals) => vals.reduce((s, v) => s + v, 0);

        // Aggregate top_content: sum views by title+channel, pick top 3
        const contentMap = new Map();
        for (const w of weeks) {
          for (const c of w.editorial.top_content) {
            const k = `${c.title}::${c.channel}`;
            contentMap.set(k, (contentMap.get(k) || 0) + c.views);
          }
        }
        const top_content = Array.from(contentMap.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([k, views]) => {
            const sep = k.indexOf("::");
            return { title: k.slice(0, sep), channel: k.slice(sep + 2), views };
          });

        const [year, month] = monthKey.split("-").map(Number);
        const date = `${monthKey}-01`;
        const month_label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
          "en-US",
          { month: "long", year: "numeric", timeZone: "UTC" }
        );

        return {
          date,
          month_label,
          administrative_support: {
            employee_headcount: Math.round(avg(weeks.map((w) => w.administrative_support.employee_headcount))),
            employee_turnover_percent: parseFloat(avg(weeks.map((w) => w.administrative_support.employee_turnover_percent)).toFixed(1)),
            training_hours_per_employee: parseFloat(avg(weeks.map((w) => w.administrative_support.training_hours_per_employee)).toFixed(1)),
            employee_engagement_percent: Math.round(avg(weeks.map((w) => w.administrative_support.employee_engagement_percent))),
          },
          editorial: {
            top_content,
            avg_content_production_hours: parseFloat(avg(weeks.map((w) => w.editorial.avg_content_production_hours)).toFixed(1)),
            digital_users: Math.round(avg(weeks.map((w) => w.editorial.digital_users))),
            print_circulation: Math.round(avg(weeks.map((w) => w.editorial.print_circulation))),
            broadcast_viewers: Math.round(avg(weeks.map((w) => w.editorial.broadcast_viewers))),
          },
          finance: {
            revenue: Math.round(sum(weeks.map((w) => w.finance.revenue))),
            operating_costs: Math.round(sum(weeks.map((w) => w.finance.operating_costs))),
            cash_flow_month_to_date: weeks[weeks.length - 1].finance.cash_flow_month_to_date,
            cash_flow_quarter_to_date: weeks[weeks.length - 1].finance.cash_flow_quarter_to_date,
            cash_flow_year_to_date: weeks[weeks.length - 1].finance.cash_flow_year_to_date,
            profit_margin_percent: {
              Print: parseFloat(avg(weeks.map((w) => w.finance.profit_margin_percent.Print)).toFixed(1)),
              TV: parseFloat(avg(weeks.map((w) => w.finance.profit_margin_percent.TV)).toFixed(1)),
              Digital: parseFloat(avg(weeks.map((w) => w.finance.profit_margin_percent.Digital)).toFixed(1)),
            },
          },
          it: {
            website_uptime_percent: parseFloat(avg(weeks.map((w) => w.it.website_uptime_percent)).toFixed(2)),
            broadcast_uptime_percent: parseFloat(avg(weeks.map((w) => w.it.broadcast_uptime_percent)).toFixed(2)),
            internal_systems_uptime_percent: parseFloat(avg(weeks.map((w) => w.it.internal_systems_uptime_percent)).toFixed(2)),
            cybersecurity_incidents_detected: sum(weeks.map((w) => w.it.cybersecurity_incidents_detected)),
            cybersecurity_incidents_resolved: sum(weeks.map((w) => w.it.cybersecurity_incidents_resolved)),
            avg_ticket_resolution_hours: parseFloat(avg(weeks.map((w) => w.it.avg_ticket_resolution_hours)).toFixed(1)),
          },
          operations_production: {
            print_pages_per_hour: Math.round(avg(weeks.map((w) => w.operations_production.print_pages_per_hour))),
            broadcast_segments_per_day: Math.round(avg(weeks.map((w) => w.operations_production.broadcast_segments_per_day))),
            distribution_on_time_percent: Math.round(avg(weeks.map((w) => w.operations_production.distribution_on_time_percent))),
            printing_press_utilization_percent: Math.round(avg(weeks.map((w) => w.operations_production.printing_press_utilization_percent))),
            broadcast_equipment_utilization_percent: Math.round(avg(weeks.map((w) => w.operations_production.broadcast_equipment_utilization_percent))),
          },
          sales_marketing: {
            ad_revenue_growth_percent: {
              Print: parseFloat(avg(weeks.map((w) => w.sales_marketing.ad_revenue_growth_percent.Print)).toFixed(1)),
              TV: parseFloat(avg(weeks.map((w) => w.sales_marketing.ad_revenue_growth_percent.TV)).toFixed(1)),
              Digital: parseFloat(avg(weeks.map((w) => w.sales_marketing.ad_revenue_growth_percent.Digital)).toFixed(1)),
            },
            CAC: Math.round(avg(weeks.map((w) => w.sales_marketing.CAC))),
            CLV: Math.round(avg(weeks.map((w) => w.sales_marketing.CLV))),
            market_share_percent: parseFloat(avg(weeks.map((w) => w.sales_marketing.market_share_percent)).toFixed(1)),
          },
        };
      });
  }

  #processData(data, startDate, endDate) {
    const filtered = data.filter((obj) => obj.date >= startDate && obj.date <= endDate);
    const monthlyData = this.#aggregateToMonthly(filtered);

    return {
      data: monthlyData,
      summary: this.#getHighLevelSummary(monthlyData),
    };
  }

  #getHighLevelSummary(data) {
    if (!data || data.length === 0) return {};

    const departmentKeys = Object.keys(data[0]).filter(
      (key) => key !== "date" && key !== "month_label"
    );
    const numberOfDepartments = departmentKeys.length;

    const summary = {
      total_months: data.length,
      number_of_departments: numberOfDepartments,
      avg_employee_headcount: 0,
      avg_employee_engagement_percent: 0,
      avg_revenue: 0,
      avg_operating_costs: 0,
      avg_market_share_percent: 0,
      avg_content_views: 0,
      avg_system_uptime_percent: 0,
    };

    let total_content_views = 0;
    let total_uptime = 0;

    data.forEach((month) => {
      summary.avg_employee_headcount += month.administrative_support.employee_headcount;
      summary.avg_employee_engagement_percent += month.administrative_support.employee_engagement_percent;
      summary.avg_revenue += month.finance.revenue;
      summary.avg_operating_costs += month.finance.operating_costs;
      summary.avg_market_share_percent += month.sales_marketing.market_share_percent;

      const monthViews = month.editorial.top_content.reduce(
        (sum, content) => sum + content.views,
        0
      );
      total_content_views += monthViews;

      const uptime =
        (month.it.website_uptime_percent +
          month.it.broadcast_uptime_percent +
          month.it.internal_systems_uptime_percent) /
        3;
      total_uptime += uptime;
    });

    const n = data.length;
    summary.avg_employee_headcount = Math.round(summary.avg_employee_headcount / n);
    summary.avg_employee_engagement_percent = Math.round(summary.avg_employee_engagement_percent / n);
    summary.avg_revenue = Math.round(summary.avg_revenue / n);
    summary.avg_operating_costs = Math.round(summary.avg_operating_costs / n);
    summary.avg_market_share_percent = Math.round(summary.avg_market_share_percent / n);
    summary.avg_content_views = Math.round(total_content_views / n);
    summary.avg_system_uptime_percent = (total_uptime / n).toFixed(2);

    return summary;
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const cmcData = await _execUtils.getCompanyKpis();
      const rawData = cmcData?.results?.data || [];
      const liveResult = this.#processData(rawData, startDate, endDate);
      if (liveResult.data.length > 0) return liveResult;
      // Live data exists but none falls in the requested range — use dummy
      console.warn("⚠️ [CompanyKPIs] Live data outside requested range, using dummy");
      return this.#processData(wide_kpis, startDate, endDate);
    } catch (err) {
      console.error("❌ [CompanyKPIs] CMC failed, using dummy:", err.message);
      return this.#processData(wide_kpis, startDate, endDate);
    }
  }
}

export default CompWideKpisController;
