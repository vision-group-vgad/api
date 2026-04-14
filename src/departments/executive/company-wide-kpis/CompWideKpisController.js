import ExecutiveUtils from "../../../utils/common/ExecutiveUtils.js";
import wide_kpis from "./dummy-data.js";

const _execUtils = new ExecutiveUtils();

class CompWideKpisController {
  constructor() {}

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );

    return {
      data: filteredData,
      summary: this.#getHighLevelSummary(filteredData),
    };
  }

  #getHighLevelSummary(data) {
    if (!data || data.length === 0) return {};

    const firstWeek = data[0];
    const departmentKeys = Object.keys(firstWeek).filter(
      (key) => key !== "date"
    );
    const numberOfDepartments = departmentKeys.length;

    const summary = {
      total_weeks: data.length,
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

    data.forEach((week) => {
      summary.avg_employee_headcount +=
        week.administrative_support.employee_headcount;
      summary.avg_employee_engagement_percent +=
        week.administrative_support.employee_engagement_percent;
      summary.avg_revenue += week.finance.revenue;
      summary.avg_operating_costs += week.finance.operating_costs;
      summary.avg_market_share_percent +=
        week.sales_marketing.market_share_percent;

      const weekViews = week.editorial.top_content.reduce(
        (sum, content) => sum + content.views,
        0
      );
      total_content_views += weekViews;

      const uptime =
        (week.it.website_uptime_percent +
          week.it.broadcast_uptime_percent +
          week.it.internal_systems_uptime_percent) /
        3;
      total_uptime += uptime;
    });

    const n = data.length;
    summary.avg_employee_headcount = Math.round(
      summary.avg_employee_headcount / n
    );
    summary.avg_employee_engagement_percent = Math.round(
      summary.avg_employee_engagement_percent / n
    );
    summary.avg_revenue = Math.round(summary.avg_revenue / n);
    summary.avg_operating_costs = Math.round(summary.avg_operating_costs / n);
    summary.avg_market_share_percent = Math.round(
      summary.avg_market_share_percent / n
    );
    summary.avg_content_views = Math.round(total_content_views / n);
    summary.avg_system_uptime_percent = (total_uptime / n).toFixed(2);

    return summary;
  }

  async getInRangeAnalytics(startDate, endDate) {
    try {
      const cmcData = await _execUtils.getCompanyKpis();
      const rawData = cmcData?.results?.data || [];
      return this.#processData(rawData, startDate, endDate);
    } catch (err) {
      console.error("❌ [CompanyKPIs] CMC failed, using dummy:", err.message);
      return this.#processData(wide_kpis, startDate, endDate);
    }
  }
}

export default CompWideKpisController;
