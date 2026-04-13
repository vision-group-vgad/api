const abTestData = [
  {
    experimentId: "EXP001",
    testName: "Homepage Banner Color",
    variationA: { visitors: 1200, conversions: 240 },
    variationB: { visitors: 1300, conversions: 299 },
    startDate: "2025-01-03",
    endDate: "2025-01-17",
    goal: "Increase signups"
  },
  {
    experimentId: "EXP002",
    testName: "CTA Button Text",
    variationA: { visitors: 1000, conversions: 150 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-01-07",
    endDate: "2025-01-22",
    goal: "Boost newsletter subscriptions"
  },
  {
    experimentId: "EXP003",
    testName: "Popup Timing Test",
    variationA: { visitors: 1500, conversions: 300 },
    variationB: { visitors: 1600, conversions: 340 },
    startDate: "2025-01-10",
    endDate: "2025-01-24",
    goal: "Increase newsletter signups"
  },
  {
    experimentId: "EXP004",
    testName: "Pricing Page Headline",
    variationA: { visitors: 1100, conversions: 220 },
    variationB: { visitors: 1150, conversions: 265 },
    startDate: "2025-01-15",
    endDate: "2025-01-30",
    goal: "Boost purchase conversions"
  },
  {
    experimentId: "EXP005",
    testName: "CTA Button Color",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 210 },
    startDate: "2025-02-01",
    endDate: "2025-02-15",
    goal: "Increase click-throughs"
  },
  {
    experimentId: "EXP006",
    testName: "Landing Page Hero Image",
    variationA: { visitors: 1300, conversions: 260 },
    variationB: { visitors: 1350, conversions: 280 },
    startDate: "2025-02-05",
    endDate: "2025-02-19",
    goal: "Boost lead signups"
  },
  {
    experimentId: "EXP007",
    testName: "Form Length Test",
    variationA: { visitors: 800, conversions: 160 },
    variationB: { visitors: 850, conversions: 190 },
    startDate: "2025-02-10",
    endDate: "2025-02-24",
    goal: "Increase completed forms"
  },
  {
    experimentId: "EXP008",
    testName: "Pricing Page Discount Banner",
    variationA: { visitors: 1000, conversions: 200 },
    variationB: { visitors: 1050, conversions: 240 },
    startDate: "2025-02-14",
    endDate: "2025-02-28",
    goal: "Boost sales"
  },
  {
    experimentId: "EXP009",
    testName: "Exit Intent Popup",
    variationA: { visitors: 1200, conversions: 180 },
    variationB: { visitors: 1250, conversions: 225 },
    startDate: "2025-03-01",
    endDate: "2025-03-15",
    goal: "Reduce bounce rate"
  },
  {
    experimentId: "EXP010",
    testName: "Newsletter Signup Form Placement",
    variationA: { visitors: 900, conversions: 135 },
    variationB: { visitors: 950, conversions: 160 },
    startDate: "2025-03-05",
    endDate: "2025-03-19",
    goal: "Increase newsletter subscriptions"
  },
  {
    experimentId: "EXP011",
    testName: "Blog Post Title Format",
    variationA: { visitors: 1100, conversions: 210 },
    variationB: { visitors: 1150, conversions: 240 },
    startDate: "2025-03-08",
    endDate: "2025-03-22",
    goal: "Boost article clicks"
  },
  {
    experimentId: "EXP012",
    testName: "Sidebar Ad Placement",
    variationA: { visitors: 1000, conversions: 120 },
    variationB: { visitors: 1050, conversions: 160 },
    startDate: "2025-03-12",
    endDate: "2025-03-26",
    goal: "Increase ad CTR"
  },
  {
    experimentId: "EXP013",
    testName: "Newsletter Subject Line",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-03-15",
    endDate: "2025-03-29",
    goal: "Improve open rates"
  },
  {
    experimentId: "EXP014",
    testName: "Video Thumbnail Test",
    variationA: { visitors: 1200, conversions: 300 },
    variationB: { visitors: 1250, conversions: 325 },
    startDate: "2025-04-01",
    endDate: "2025-04-15",
    goal: "Increase video plays"
  },
  {
    experimentId: "EXP015",
    testName: "Article Lead Paragraph Length",
    variationA: { visitors: 1000, conversions: 200 },
    variationB: { visitors: 1020, conversions: 215 },
    startDate: "2025-04-03",
    endDate: "2025-04-17",
    goal: "Boost reading time"
  },
  {
    experimentId: "EXP016",
    testName: "CTA Placement Above Fold",
    variationA: { visitors: 950, conversions: 175 },
    variationB: { visitors: 1000, conversions: 210 },
    startDate: "2025-04-05",
    endDate: "2025-04-19",
    goal: "Increase clicks"
  },
  {
    experimentId: "EXP017",
    testName: "Header Banner Size",
    variationA: { visitors: 1100, conversions: 220 },
    variationB: { visitors: 1150, conversions: 250 },
    startDate: "2025-04-07",
    endDate: "2025-04-21",
    goal: "Improve banner engagement"
  },
  {
    experimentId: "EXP018",
    testName: "Checkout Page Testimonial",
    variationA: { visitors: 900, conversions: 180 },
    variationB: { visitors: 950, conversions: 200 },
    startDate: "2025-04-10",
    endDate: "2025-04-24",
    goal: "Boost checkout conversions"
  },
  {
    experimentId: "EXP019",
    testName: "Footer Banner CTA Text",
    variationA: { visitors: 1000, conversions: 180 },
    variationB: { visitors: 1050, conversions: 210 },
    startDate: "2025-04-12",
    endDate: "2025-04-26",
    goal: "Increase newsletter signups"
  },
  {
    experimentId: "EXP020",
    testName: "Popup Exit Message Tone",
    variationA: { visitors: 1200, conversions: 250 },
    variationB: { visitors: 1250, conversions: 280 },
    startDate: "2025-04-14",
    endDate: "2025-04-28",
    goal: "Reduce bounce rate"
  },
  {
    experimentId: "EXP021",
    testName: "Mid-Year Campaign CTA Position",
    variationA: { visitors: 1400, conversions: 266 },
    variationB: { visitors: 1450, conversions: 319 },
    startDate: "2025-07-03",
    endDate: "2025-07-17",
    goal: "Increase campaign landing conversions"
  },
  {
    experimentId: "EXP022",
    testName: "Product Card Price Highlight",
    variationA: { visitors: 1320, conversions: 238 },
    variationB: { visitors: 1360, conversions: 286 },
    startDate: "2025-07-22",
    endDate: "2025-08-05",
    goal: "Improve product detail clicks"
  },
  {
    experimentId: "EXP023",
    testName: "Checkout Urgency Banner Copy",
    variationA: { visitors: 980, conversions: 186 },
    variationB: { visitors: 1010, conversions: 232 },
    startDate: "2025-08-12",
    endDate: "2025-08-26",
    goal: "Increase checkout completion"
  },
  {
    experimentId: "EXP024",
    testName: "Newsletter Lead Magnet Wording",
    variationA: { visitors: 1250, conversions: 188 },
    variationB: { visitors: 1290, conversions: 245 },
    startDate: "2025-09-04",
    endDate: "2025-09-18",
    goal: "Grow newsletter acquisition"
  }
];

export default abTestData;
