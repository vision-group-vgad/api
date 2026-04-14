import abTestData from "./dummy.js";
import SalesMarketing from "../../../utils/common/SalesMkting.js";

const salesMarketing = new SalesMarketing();

export const calculateABTestResults = async (startDate, endDate) => {
  let source = abTestData;

  try {
    const liveData = await salesMarketing.getABTestResultsData(startDate, endDate);
    if (Array.isArray(liveData) && liveData.length > 0) {
      return liveData;
    }
  } catch (error) {
    console.warn("Using fallback AB-test data:", error.message);
  }

  return source.map(test => {
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
