import { generateSponsorDataRaw } from "./sponsorRoiData.js";

export const getSponsorAnalysis = (req, res) => {
  try {
    const data = generateSponsorDataRaw(200);
    const { sponsor, year, startDate, endDate } = req.query;

    let filteredData = data;

    // Filter by sponsor(s)
    if (sponsor) {
      const sponsorsFilter = sponsor.split(",");
      filteredData = filteredData.filter(d => d?.sponsorName && sponsorsFilter.includes(d.sponsorName));
    }

    // Filter by year
    if (year) {
      filteredData = filteredData.filter(d => new Date(d.date).getFullYear() === +year);
    }

    // Filter by date range
    const start = startDate ? new Date(startDate) : new Date("2024-01-01");
    const end = endDate ? new Date(endDate) : new Date("2025-12-31");

    filteredData = filteredData.filter(d => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate >= start && dDate <= end;
    });

    // Add per-record metrics
    const dataWithMetrics = filteredData.map(d => {
      const ROI = d.investment ? +(((d.revenue - d.investment) / d.investment) * 100).toFixed(2) : 0;
      const CPA = d.acquisitions ? +(d.investment / d.acquisitions).toFixed(2) : 0;

      return {
        ...d,
        ROI,
        CPA
      };
    });

    // Summary metrics (aggregated)
    const totalRevenue = filteredData.reduce((a, d) => a + d.revenue, 0);
    const totalInvestment = filteredData.reduce((a, d) => a + d.investment, 0);
    const totalAcquisitions = filteredData.reduce((a, d) => a + d.acquisitions, 0);

    const summary = {
      total: filteredData.length,
      totalSponsors: new Set(filteredData.map(d => d.sponsorName)).size,
      totalRevenue,
      totalInvestment,
      totalAcquisitions,
      ROI: totalInvestment ? +(((totalRevenue - totalInvestment) / totalInvestment) * 100).toFixed(2) : 0,
      CPA: totalAcquisitions ? +(totalInvestment / totalAcquisitions).toFixed(2) : 0
    };

    // Monthly metrics per sponsor
    const monthlyMap = {};
    filteredData.forEach(d => {
      const month = d.date.slice(0, 7); // YYYY-MM
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          totalSponsors: new Set(),
          totalRevenue: 0,
          totalInvestment: 0,
          totalAcquisitions: 0
        };
      }
      monthlyMap[month].totalSponsors.add(d.sponsorName);
      monthlyMap[month].totalRevenue += d.revenue;
      monthlyMap[month].totalInvestment += d.investment;
      monthlyMap[month].totalAcquisitions += d.acquisitions;
    });

    const monthlyTrends = Object.entries(monthlyMap)
      .map(([month, vals]) => {
        const ROI = vals.totalInvestment ? +(((vals.totalRevenue - vals.totalInvestment) / vals.totalInvestment) * 100).toFixed(2) : 0;
        const CPA = vals.totalAcquisitions ? +(vals.totalInvestment / vals.totalAcquisitions).toFixed(2) : 0;

        return {
          month,
          totalSponsors: vals.totalSponsors.size,
          totalRevenue: vals.totalRevenue,
          totalInvestment: vals.totalInvestment,
          totalAcquisitions: vals.totalAcquisitions,
          ROI,
          CPA
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    res.json({ summary, monthlyTrends, data: dataWithMetrics });

  } catch (error) {
    console.error("Error fetching sponsor analysis:", error);
    res.status(500).json({
      message: "Failed to fetch sponsor analysis",
      error: error.message
    });
  }
};
