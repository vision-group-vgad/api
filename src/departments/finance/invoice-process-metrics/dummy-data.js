const metrics = [
  {
    date: "2025-01-06",
    totalInvoices: 112,
    avgProcessingTimeDays: 4.1,
    approvalCycleTimeDays: 1.6,
    onTimePaymentRate: 95.4,
    exceptionRate: 5.2,
    earlyPaymentDiscountUsage: 73.1,
    firstPassMatchRate: 87.4,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 42,
      },
      {
        vendor: "Office Essentials",
        invoices: 41,
      },
    ],
  },
  {
    date: "2025-01-13",
    totalInvoices: 192,
    avgProcessingTimeDays: 5.3,
    approvalCycleTimeDays: 1.8,
    onTimePaymentRate: 98.0,
    exceptionRate: 7.4,
    earlyPaymentDiscountUsage: 74.2,
    firstPassMatchRate: 82.4,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 23,
      },
      {
        vendor: "Global Services",
        invoices: 28,
      },
    ],
  },
  {
    date: "2025-01-20",
    totalInvoices: 141,
    avgProcessingTimeDays: 5.7,
    approvalCycleTimeDays: 2.6,
    onTimePaymentRate: 85.4,
    exceptionRate: 6.6,
    earlyPaymentDiscountUsage: 58.7,
    firstPassMatchRate: 89.5,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 47,
      },
      {
        vendor: "Office Essentials",
        invoices: 40,
      },
    ],
  },
  {
    date: "2025-01-27",
    totalInvoices: 154,
    avgProcessingTimeDays: 3.5,
    approvalCycleTimeDays: 2.1,
    onTimePaymentRate: 91.5,
    exceptionRate: 7.5,
    earlyPaymentDiscountUsage: 69.6,
    firstPassMatchRate: 91.8,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 36,
      },
      {
        vendor: "Office Essentials",
        invoices: 35,
      },
    ],
  },
  {
    date: "2025-02-03",
    totalInvoices: 95,
    avgProcessingTimeDays: 3.6,
    approvalCycleTimeDays: 2.3,
    onTimePaymentRate: 97.0,
    exceptionRate: 6.6,
    earlyPaymentDiscountUsage: 55.5,
    firstPassMatchRate: 92.1,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 45,
      },
      {
        vendor: "Prime Logistics",
        invoices: 44,
      },
    ],
  },
  {
    date: "2025-02-10",
    totalInvoices: 152,
    avgProcessingTimeDays: 5.1,
    approvalCycleTimeDays: 2.6,
    onTimePaymentRate: 97.2,
    exceptionRate: 9.3,
    earlyPaymentDiscountUsage: 51.5,
    firstPassMatchRate: 85.6,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 29,
      },
      {
        vendor: "Acme Supplies",
        invoices: 20,
      },
    ],
  },
  {
    date: "2025-02-17",
    totalInvoices: 136,
    avgProcessingTimeDays: 3.1,
    approvalCycleTimeDays: 2.5,
    onTimePaymentRate: 95.7,
    exceptionRate: 6.6,
    earlyPaymentDiscountUsage: 73.3,
    firstPassMatchRate: 81.2,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 17,
      },
      {
        vendor: "Prime Logistics",
        invoices: 44,
      },
    ],
  },
  {
    date: "2025-02-24",
    totalInvoices: 127,
    avgProcessingTimeDays: 5.2,
    approvalCycleTimeDays: 2.4,
    onTimePaymentRate: 85.2,
    exceptionRate: 4.3,
    earlyPaymentDiscountUsage: 57.7,
    firstPassMatchRate: 89.9,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 40,
      },
      {
        vendor: "Global Services",
        invoices: 22,
      },
    ],
  },
  {
    date: "2025-03-03",
    totalInvoices: 168,
    avgProcessingTimeDays: 5.6,
    approvalCycleTimeDays: 1.9,
    onTimePaymentRate: 97.3,
    exceptionRate: 3.9,
    earlyPaymentDiscountUsage: 60.4,
    firstPassMatchRate: 83.4,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 33,
      },
      {
        vendor: "Office Essentials",
        invoices: 24,
      },
    ],
  },
  {
    date: "2025-03-10",
    totalInvoices: 98,
    avgProcessingTimeDays: 3.6,
    approvalCycleTimeDays: 3.4,
    onTimePaymentRate: 89.0,
    exceptionRate: 3.2,
    earlyPaymentDiscountUsage: 68.1,
    firstPassMatchRate: 89.1,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 19,
      },
      {
        vendor: "Tech Solutions",
        invoices: 43,
      },
    ],
  },
  {
    date: "2025-03-17",
    totalInvoices: 149,
    avgProcessingTimeDays: 3.5,
    approvalCycleTimeDays: 2.7,
    onTimePaymentRate: 85.0,
    exceptionRate: 7.1,
    earlyPaymentDiscountUsage: 72.1,
    firstPassMatchRate: 88.7,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 23,
      },
      {
        vendor: "Tech Solutions",
        invoices: 27,
      },
    ],
  },
  {
    date: "2025-03-24",
    totalInvoices: 181,
    avgProcessingTimeDays: 3.1,
    approvalCycleTimeDays: 3.3,
    onTimePaymentRate: 90.9,
    exceptionRate: 4.0,
    earlyPaymentDiscountUsage: 54.5,
    firstPassMatchRate: 85.5,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 16,
      },
      {
        vendor: "Office Essentials",
        invoices: 15,
      },
    ],
  },
  {
    date: "2025-03-31",
    totalInvoices: 190,
    avgProcessingTimeDays: 3.3,
    approvalCycleTimeDays: 2.1,
    onTimePaymentRate: 87.0,
    exceptionRate: 5.8,
    earlyPaymentDiscountUsage: 64.3,
    firstPassMatchRate: 89.0,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 27,
      },
      {
        vendor: "Office Essentials",
        invoices: 39,
      },
    ],
  },
  {
    date: "2025-04-07",
    totalInvoices: 138,
    avgProcessingTimeDays: 5.8,
    approvalCycleTimeDays: 2.4,
    onTimePaymentRate: 92.3,
    exceptionRate: 4.5,
    earlyPaymentDiscountUsage: 62.4,
    firstPassMatchRate: 92.6,
    topVendorsByVolume: [
      {
        vendor: "Office Essentials",
        invoices: 41,
      },
      {
        vendor: "Global Services",
        invoices: 27,
      },
    ],
  },
  {
    date: "2025-04-14",
    totalInvoices: 92,
    avgProcessingTimeDays: 5.9,
    approvalCycleTimeDays: 3.0,
    onTimePaymentRate: 89.5,
    exceptionRate: 9.3,
    earlyPaymentDiscountUsage: 56.6,
    firstPassMatchRate: 82.3,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 24,
      },
      {
        vendor: "Prime Logistics",
        invoices: 40,
      },
    ],
  },
  {
    date: "2025-04-21",
    totalInvoices: 199,
    avgProcessingTimeDays: 3.1,
    approvalCycleTimeDays: 2.5,
    onTimePaymentRate: 97.9,
    exceptionRate: 9.7,
    earlyPaymentDiscountUsage: 69.4,
    firstPassMatchRate: 81.4,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 28,
      },
      {
        vendor: "Global Services",
        invoices: 33,
      },
    ],
  },
  {
    date: "2025-04-28",
    totalInvoices: 150,
    avgProcessingTimeDays: 5.8,
    approvalCycleTimeDays: 2.2,
    onTimePaymentRate: 88.7,
    exceptionRate: 3.9,
    earlyPaymentDiscountUsage: 56.9,
    firstPassMatchRate: 90.6,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 17,
      },
      {
        vendor: "Prime Logistics",
        invoices: 32,
      },
    ],
  },
  {
    date: "2025-05-05",
    totalInvoices: 119,
    avgProcessingTimeDays: 4.9,
    approvalCycleTimeDays: 2.6,
    onTimePaymentRate: 89.0,
    exceptionRate: 7.8,
    earlyPaymentDiscountUsage: 74.8,
    firstPassMatchRate: 85.5,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 26,
      },
      {
        vendor: "Tech Solutions",
        invoices: 42,
      },
    ],
  },
  {
    date: "2025-05-12",
    totalInvoices: 116,
    avgProcessingTimeDays: 3.4,
    approvalCycleTimeDays: 3.0,
    onTimePaymentRate: 92.0,
    exceptionRate: 5.6,
    earlyPaymentDiscountUsage: 62.3,
    firstPassMatchRate: 91.0,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 30,
      },
      {
        vendor: "Office Essentials",
        invoices: 16,
      },
    ],
  },
  {
    date: "2025-05-19",
    totalInvoices: 195,
    avgProcessingTimeDays: 6.0,
    approvalCycleTimeDays: 2.6,
    onTimePaymentRate: 86.1,
    exceptionRate: 3.6,
    earlyPaymentDiscountUsage: 73.1,
    firstPassMatchRate: 86.9,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 42,
      },
      {
        vendor: "Prime Logistics",
        invoices: 15,
      },
    ],
  },
  {
    date: "2025-05-26",
    totalInvoices: 159,
    avgProcessingTimeDays: 5.0,
    approvalCycleTimeDays: 3.3,
    onTimePaymentRate: 98.3,
    exceptionRate: 7.2,
    earlyPaymentDiscountUsage: 50.0,
    firstPassMatchRate: 81.2,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 31,
      },
      {
        vendor: "Acme Supplies",
        invoices: 29,
      },
    ],
  },
  {
    date: "2025-06-02",
    totalInvoices: 133,
    avgProcessingTimeDays: 3.8,
    approvalCycleTimeDays: 2.4,
    onTimePaymentRate: 89.7,
    exceptionRate: 9.8,
    earlyPaymentDiscountUsage: 53.2,
    firstPassMatchRate: 87.5,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 20,
      },
      {
        vendor: "Prime Logistics",
        invoices: 29,
      },
    ],
  },
  {
    date: "2025-06-09",
    totalInvoices: 107,
    avgProcessingTimeDays: 5.7,
    approvalCycleTimeDays: 1.8,
    onTimePaymentRate: 96.0,
    exceptionRate: 4.6,
    earlyPaymentDiscountUsage: 64.7,
    firstPassMatchRate: 93.5,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 48,
      },
      {
        vendor: "Acme Supplies",
        invoices: 13,
      },
    ],
  },
  {
    date: "2025-06-16",
    totalInvoices: 95,
    avgProcessingTimeDays: 3.0,
    approvalCycleTimeDays: 1.8,
    onTimePaymentRate: 87.1,
    exceptionRate: 7.6,
    earlyPaymentDiscountUsage: 52.1,
    firstPassMatchRate: 89.2,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 15,
      },
      {
        vendor: "Prime Logistics",
        invoices: 26,
      },
    ],
  },
  {
    date: "2025-06-23",
    totalInvoices: 196,
    avgProcessingTimeDays: 3.2,
    approvalCycleTimeDays: 3.4,
    onTimePaymentRate: 92.2,
    exceptionRate: 8.0,
    earlyPaymentDiscountUsage: 65.2,
    firstPassMatchRate: 80.8,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 32,
      },
      {
        vendor: "Tech Solutions",
        invoices: 45,
      },
    ],
  },
  {
    date: "2025-06-30",
    totalInvoices: 144,
    avgProcessingTimeDays: 4.4,
    approvalCycleTimeDays: 3.2,
    onTimePaymentRate: 87.5,
    exceptionRate: 4.6,
    earlyPaymentDiscountUsage: 66.7,
    firstPassMatchRate: 94.9,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 34,
      },
      {
        vendor: "Tech Solutions",
        invoices: 14,
      },
    ],
  },
  {
    date: "2025-07-07",
    totalInvoices: 147,
    avgProcessingTimeDays: 5.4,
    approvalCycleTimeDays: 2.6,
    onTimePaymentRate: 88.8,
    exceptionRate: 3.6,
    earlyPaymentDiscountUsage: 70.5,
    firstPassMatchRate: 85.8,
    topVendorsByVolume: [
      {
        vendor: "Office Essentials",
        invoices: 36,
      },
      {
        vendor: "Tech Solutions",
        invoices: 44,
      },
    ],
  },
  {
    date: "2025-07-14",
    totalInvoices: 185,
    avgProcessingTimeDays: 4.0,
    approvalCycleTimeDays: 3.4,
    onTimePaymentRate: 91.9,
    exceptionRate: 6.3,
    earlyPaymentDiscountUsage: 51.5,
    firstPassMatchRate: 91.1,
    topVendorsByVolume: [
      {
        vendor: "Office Essentials",
        invoices: 34,
      },
      {
        vendor: "Acme Supplies",
        invoices: 10,
      },
    ],
  },
  {
    date: "2025-07-21",
    totalInvoices: 191,
    avgProcessingTimeDays: 3.6,
    approvalCycleTimeDays: 1.8,
    onTimePaymentRate: 98.4,
    exceptionRate: 4.4,
    earlyPaymentDiscountUsage: 52.8,
    firstPassMatchRate: 94.9,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 37,
      },
      {
        vendor: "Global Services",
        invoices: 39,
      },
    ],
  },
  {
    date: "2025-07-28",
    totalInvoices: 186,
    avgProcessingTimeDays: 3.6,
    approvalCycleTimeDays: 3.1,
    onTimePaymentRate: 94.3,
    exceptionRate: 6.5,
    earlyPaymentDiscountUsage: 53.4,
    firstPassMatchRate: 83.6,
    topVendorsByVolume: [
      {
        vendor: "Tech Solutions",
        invoices: 43,
      },
      {
        vendor: "Acme Supplies",
        invoices: 17,
      },
    ],
  },
  {
    date: "2025-08-04",
    totalInvoices: 118,
    avgProcessingTimeDays: 5.4,
    approvalCycleTimeDays: 2.1,
    onTimePaymentRate: 94.5,
    exceptionRate: 9.7,
    earlyPaymentDiscountUsage: 63.3,
    firstPassMatchRate: 80.5,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 35,
      },
      {
        vendor: "Tech Solutions",
        invoices: 12,
      },
    ],
  },
  {
    date: "2025-08-11",
    totalInvoices: 146,
    avgProcessingTimeDays: 4.7,
    approvalCycleTimeDays: 1.7,
    onTimePaymentRate: 93.8,
    exceptionRate: 9.5,
    earlyPaymentDiscountUsage: 71.0,
    firstPassMatchRate: 89.0,
    topVendorsByVolume: [
      {
        vendor: "Global Services",
        invoices: 26,
      },
      {
        vendor: "Tech Solutions",
        invoices: 36,
      },
    ],
  },
  {
    date: "2025-08-18",
    totalInvoices: 161,
    avgProcessingTimeDays: 3.2,
    approvalCycleTimeDays: 1.9,
    onTimePaymentRate: 96.2,
    exceptionRate: 6.1,
    earlyPaymentDiscountUsage: 73.6,
    firstPassMatchRate: 88.8,
    topVendorsByVolume: [
      {
        vendor: "Acme Supplies",
        invoices: 36,
      },
      {
        vendor: "Tech Solutions",
        invoices: 25,
      },
    ],
  },
  {
    date: "2025-08-25",
    totalInvoices: 140,
    avgProcessingTimeDays: 3.6,
    approvalCycleTimeDays: 1.8,
    onTimePaymentRate: 96.3,
    exceptionRate: 9.6,
    earlyPaymentDiscountUsage: 66.9,
    firstPassMatchRate: 81.0,
    topVendorsByVolume: [
      {
        vendor: "Prime Logistics",
        invoices: 22,
      },
      {
        vendor: "Office Essentials",
        invoices: 27,
      },
    ],
  },
];

export default metrics;
