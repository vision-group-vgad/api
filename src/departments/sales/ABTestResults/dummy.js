const abTestData = [
  {
    experimentId: "EXP001",
    testName: "Homepage Banner Color",
    variationA: { visitors: 1200, conversions: 240 },
    variationB: { visitors: 1300, conversions: 299 },
    startDate: "2025-08-01",
    endDate: "2025-08-15",
    goal: "Increase signups"
  },
  {
    experimentId: "EXP002",
    testName: "CTA Button Text",
    variationA: { visitors: 1000, conversions: 150 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-08-05",
    endDate: "2025-08-20",
    goal: "Boost newsletter subscriptions"
  },
  {
    experimentId: "EXP003",
    testName: "Popup Timing Test",
    variationA: { visitors: 1500, conversions: 300 },
    variationB: { visitors: 1600, conversions: 340 },
    startDate: "2025-08-02",
    endDate: "2025-08-12",
    goal: "Increase newsletter signups"
  },
  {
    experimentId: "EXP004",
    testName: "Pricing Page Headline",
    variationA: { visitors: 1100, conversions: 220 },
    variationB: { visitors: 1150, conversions: 265 },
    startDate: "2025-08-03",
    endDate: "2025-08-18",
    goal: "Boost purchase conversions"
  },
  {
    experimentId: "EXP005",
    testName: "CTA Button Color",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 210 },
    startDate: "2025-08-07",
    endDate: "2025-08-21",
    goal: "Increase click-throughs"
  },
  {
    experimentId: "EXP006",
    testName: "Landing Page Hero Image",
    variationA: { visitors: 1300, conversions: 260 },
    variationB: { visitors: 1350, conversions: 280 },
    startDate: "2025-08-10",
    endDate: "2025-08-25",
    goal: "Boost lead signups"
  },
  {
    experimentId: "EXP007",
    testName: "Form Length Test",
    variationA: { visitors: 800, conversions: 160 },
    variationB: { visitors: 850, conversions: 190 },
    startDate: "2025-08-12",
    endDate: "2025-08-22",
    goal: "Increase completed forms"
  },
  {
    experimentId: "EXP008",
    testName: "Pricing Page Discount Banner",
    variationA: { visitors: 1000, conversions: 200 },
    variationB: { visitors: 1050, conversions: 240 },
    startDate: "2025-08-05",
    endDate: "2025-08-19",
    goal: "Boost sales"
  },
  {
    experimentId: "EXP009",
    testName: "Exit Intent Popup",
    variationA: { visitors: 1200, conversions: 180 },
    variationB: { visitors: 1250, conversions: 225 },
    startDate: "2025-08-08",
    endDate: "2025-08-23",
    goal: "Reduce bounce rate"
  },
  {
    experimentId: "EXP010",
    testName: "Newsletter Signup Form Placement",
    variationA: { visitors: 900, conversions: 135 },
    variationB: { visitors: 950, conversions: 160 },
    startDate: "2025-08-01",
    endDate: "2025-08-15",
    goal: "Increase newsletter subscriptions"
  },
  {
    experimentId: "EXP011",
    testName: "Blog Post Title Format",
    variationA: { visitors: 1100, conversions: 210 },
    variationB: { visitors: 1150, conversions: 240 },
    startDate: "2025-08-04",
    endDate: "2025-08-18",
    goal: "Boost article clicks"
  },
  {
    experimentId: "EXP012",
    testName: "Sidebar Ad Placement",
    variationA: { visitors: 1000, conversions: 120 },
    variationB: { visitors: 1050, conversions: 160 },
    startDate: "2025-08-06",
    endDate: "2025-08-20",
    goal: "Increase ad CTR"
  },
  {
    experimentId: "EXP013",
    testName: "Newsletter Subject Line",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-08-07",
    endDate: "2025-08-21",
    goal: "Improve open rates"
  },
  {
    experimentId: "EXP014",
    testName: "Video Thumbnail Test",
    variationA: { visitors: 1200, conversions: 300 },
    variationB: { visitors: 1250, conversions: 325 },
    startDate: "2025-08-09",
    endDate: "2025-08-24",
    goal: "Increase video plays"
  },
  {
    experimentId: "EXP015",
    testName: "Article Lead Paragraph Length",
    variationA: { visitors: 1000, conversions: 200 },
    variationB: { visitors: 1020, conversions: 215 },
    startDate: "2025-08-10",
    endDate: "2025-08-25",
    goal: "Boost reading time"
  },
  {
    experimentId: "EXP016",
    testName: "CTA Placement Above Fold",
    variationA: { visitors: 950, conversions: 175 },
    variationB: { visitors: 1000, conversions: 210 },
    startDate: "2025-08-11",
    endDate: "2025-08-26",
    goal: "Increase clicks"
  },
  {
    experimentId: "EXP017",
    testName: "Header Banner Size",
    variationA: { visitors: 1100, conversions: 220 },
    variationB: { visitors: 1150, conversions: 250 },
    startDate: "2025-08-12",
    endDate: "2025-08-27",
    goal: "Improve banner engagement"
  },
  {
    experimentId: "EXP018",
    testName: "Checkout Page Testimonial",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-08-13",
    endDate: "2025-08-28",
    goal: "Boost checkout conversions"
  },
  {
    experimentId: "EXP019",
    testName: "Footer Banner CTA Text",
    variationA: { visitors: 1000, conversions: 180 },
    variationB: { visitors: 1050, conversions: 210 },
    startDate: "2025-08-14",
    endDate: "2025-08-29",
    goal: "Increase newsletter signups"
  },
  {
    experimentId: "EXP020",
    testName: "Popup Exit Message Tone",
    variationA: { visitors: 1200, conversions: 250 },
    variationB: { visitors: 1250, conversions: 280 },
    startDate: "2025-08-15",
    endDate: "2025-08-30",
    goal: "Reduce bounce rate"
  }
];

export default abTestData;
