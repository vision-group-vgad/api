import { generateContractValueTrends } from "./contractTrendsData.js";
import SalesMarketing from "../../../utils/common/SalesMkting.js";

const salesMarketing = new SalesMarketing();

export async function getContractValueTrends(req, res) {
  try {
    const { campaign, channel, startDate, endDate, leadStage } = req.query;
    let rawData;

    try {
      rawData = await salesMarketing.getContractValueTrendsData(startDate, endDate);
    } catch (error) {
      console.warn("Using fallback contract-trends data:", error.message);
      rawData = generateContractValueTrends(500);
    }

    if (!rawData || !rawData.contractValueTrendsByChannel ||
      Object.keys(rawData.contractValueTrendsByChannel).length === 0) {
      rawData = generateContractValueTrends(500);
    }

    // Flatten all data into a single array
    let allData = [];
    Object.values(rawData.contractValueTrendsByChannel).forEach(arr => allData.push(...arr));

    // Apply optional filters
    if (campaign) {
      const campaignsFilter = campaign.split(",").map(c => c.trim());
      allData = allData.filter(d => campaignsFilter.includes(d.campaign));
    }
    if (channel) {
      const channelsFilter = channel.split(",").map(c => c.trim());
      allData = allData.filter(d => channelsFilter.includes(d.channel));
    }
    if (startDate) allData = allData.filter(d => d.signedDate >= startDate);
    if (endDate) allData = allData.filter(d => d.signedDate <= endDate);
    if (leadStage) allData = allData.filter(d => d.leadStage === leadStage);

    // Aggregate metrics by channel, campaign, month
    const trends = {};
    allData.forEach(item => {
      const ch = item.channel;
      const cmp = item.campaign;
      const month = item.month;

      if (!trends[ch]) trends[ch] = {};
      if (!trends[ch][cmp]) trends[ch][cmp] = {};
      if (!trends[ch][cmp][month]) trends[ch][cmp][month] = { totalContractValue: 0, dealCount: 0, contracts: [] };

      const record = trends[ch][cmp][month];
      record.totalContractValue += item.contractValue;
      record.dealCount += 1;
      record.contracts.push(item);
    });

    // Transform aggregated data into array format
    const mergedTrends = [];
    Object.keys(trends).forEach(ch => {
      Object.keys(trends[ch]).forEach(cmp => {
        Object.keys(trends[ch][cmp]).forEach(month => {
          const record = trends[ch][cmp][month];
          const avgDealSize = record.dealCount ? parseFloat((record.totalContractValue / record.dealCount).toFixed(2)) : 0;
          const liftVsBaseline = parseFloat((avgDealSize - rawData.baselineContractValue).toFixed(2));

          mergedTrends.push({
            channel: ch,
            campaign: cmp,
            month,
            totalContractValue: parseFloat(record.totalContractValue.toFixed(2)),
            dealCount: record.dealCount,
            avgDealSize,
            liftVsBaseline,
            contracts: record.contracts, // drill-down support
          });
        });
      });
    });

    res.json({
      baselineContractValue: rawData.baselineContractValue,
      mergedContractValueTrends: mergedTrends,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
