import abTestData from "./dummy.js";

export const calculateABTestResults = () => {
  return abTestData.map(test => {
    const { experimentId, testName, variationA, variationB, startDate, endDate } = test;

    // Conversion rates
    const crA = variationA.conversions / variationA.visitors;
    const crB = variationB.conversions / variationB.visitors;

    // Uplift calculation
    const crUplift = ((crB - crA) / crA) * 100;

    return {
      experimentId,
      testName,
      startDate,
      endDate,
      variationA: {
        visitors: variationA.visitors,
        conversions: variationA.conversions,
        conversionRate: (crA * 100).toFixed(2) + "%"
      },
      variationB: {
        visitors: variationB.visitors,
        conversions: variationB.conversions,
        conversionRate: (crB * 100).toFixed(2) + "%"
      },
      results: {
        crUplift: crUplift.toFixed(2) + "%",
        winner: crA > crB ? "Variation A" : crB > crA ? "Variation B" : "Tie"
      }
    };
  });
};
