import metrics from "./dummy-data.js";

class InvoProMetricsController {
  constructor() {}

  #processData(data, startDate, endDate) {
    const filteredData = data.filter(
      (obj) => obj.date >= startDate && obj.date <= endDate
    );
    return {
      data: filteredData,
      summary: this.#summarizeInvoiceMetrics(filteredData),
    };
  }

  #summarizeInvoiceMetrics(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return { error: "Dataset is empty or invalid." };
    }

    let totalInvoices = 0;
    let totalProcessingTime = 0;
    let totalApprovalTime = 0;
    let totalOnTimeRate = 0;
    let totalExceptionRate = 0;
    let totalDiscountUsage = 0;
    let totalFirstPassRate = 0;

    const vendorCounts = {};

    data.forEach((item) => {
      totalInvoices += item.totalInvoices;
      totalProcessingTime += item.avgProcessingTimeDays;
      totalApprovalTime += item.approvalCycleTimeDays;
      totalOnTimeRate += item.onTimePaymentRate;
      totalExceptionRate += item.exceptionRate;
      totalDiscountUsage += item.earlyPaymentDiscountUsage;
      totalFirstPassRate += item.firstPassMatchRate;

      item.topVendorsByVolume.forEach((v) => {
        vendorCounts[v.vendor] = (vendorCounts[v.vendor] || 0) + v.invoices;
      });
    });

    const entries = data.length;
    const topVendor = Object.entries(vendorCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      dateRange: { start: data[0].date, end: data[data.length - 1].date },
      totalInvoices,
      avgProcessingTime: (totalProcessingTime / entries).toFixed(2),
      avgApprovalCycle: (totalApprovalTime / entries).toFixed(2),
      avgOnTimeRate: (totalOnTimeRate / entries).toFixed(2),
      avgExceptionRate: (totalExceptionRate / entries).toFixed(2),
      avgDiscountUsage: (totalDiscountUsage / entries).toFixed(2),
      avgFirstPassRate: (totalFirstPassRate / entries).toFixed(2),
      topVendorByInvoices: { vendor: topVendor[0], invoices: topVendor[1] },
    };
  }

  async getInRangeAnalytics(startDate, endDate) {
    const processedAnalytics = this.#processData(metrics, startDate, endDate);
    return processedAnalytics;
  }
}

export default InvoProMetricsController;
