import axios from "axios";

const DEFAULT_BASE_URL = "https://cms-vgad.visiongroup.co.ug/api";

const SALES_ACCOUNT_PREFIXES = ["3"];
const SALES_ACCOUNT_KEYWORDS = [
  "sales",
  "advert",
  "revenue",
  "subscription",
  "printing",
  "radio",
  "tv",
  "digital",
  "website",
  "bukedde",
  "vision",
];

const SEGMENT_RULES = [
  { keywords: ["website", "digital", "subscription"], segment: "Digital Subscriptions" },
  { keywords: ["education"], segment: "Education Publishing" },
  { keywords: ["printing", "print"], segment: "Commercial Printing" },
  { keywords: ["tv", "broadcast"], segment: "TV Broadcast" },
  { keywords: ["radio"], segment: "Radio Broadcast" },
  { keywords: ["newspaper", "vision", "bukedde"], segment: "Print Newspaper" },
];

const REGION_RULES = [
  { keywords: ["kampala", "central", "h/o", "head office", "hq"], region: "Central Region" },
  { keywords: ["eastern", "soroti", "etop"], region: "East Region" },
  { keywords: ["western", "mbarara", "radio west"], region: "West Region" },
  { keywords: ["northern", "gulu"], region: "North Region" },
  { keywords: ["south"], region: "South Region" },
];

class SalesMarketing {
  constructor() {
    this.apiClient = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = process.env.CMC_API_BEARER_TOKEN || process.env.CMS_API_KEY;

    this.apiClient = axios.create({
      baseURL: process.env.CMC_API_BASE_URL || DEFAULT_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-api-key": apiKey,
      },
    });

    this.initialized = true;
  }

  async #fetchSalesEntries(startDate, endDate, _roleCode = null) {
    this.initialize();

    const response = await this.apiClient.get('/bc-datasets');
    const rawEntries = response.data?.data || [];

    return this.transformCMCData(rawEntries).filter((entry) =>
      this.isSalesEntry(entry)
    );
  }

  normalizeDateRange(startDate, endDate) {
    const normalizedEndDate = endDate || new Date().toISOString().slice(0, 10);
    const normalizedStartDate = startDate || "2024-01-01";

    return { normalizedStartDate, normalizedEndDate };
  }

  transformCMCData(apiData) {
    if (!Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((entry) => ({
      id: entry.id,
      entryNo: entry.attributes.Entry_No,
      transactionNo: entry.attributes.Transaction_No,
      accountNo: entry.attributes.G_L_Account_No,
      accountName: entry.attributes.G_L_Account_Name,
      postingDate: entry.attributes.Posting_Date,
      documentDate: entry.attributes.Document_Date,
      documentType: entry.attributes.Document_Type,
      documentNo: entry.attributes.Document_No,
      sourceCode: entry.attributes.Source_Code,
      amount: Number.parseFloat(entry.attributes.Amount || "0"),
      debitAmount: Number.parseFloat(entry.attributes.Debit_Amount || "0"),
      creditAmount: Number.parseFloat(entry.attributes.Credit_Amount || "0"),
      businessUnitCode: entry.attributes.Business_Unit_Code,
      jobNo: entry.attributes.Job_No,
      dimensionSetId: entry.attributes.Dimension_Set_ID,
      raw: entry.attributes,
    }));
  }

  isSalesEntry(entry) {
    const accountNo = `${entry.accountNo || ""}`.trim();
    const fingerprint = this.buildFingerprint(entry);

    return (
      SALES_ACCOUNT_PREFIXES.some((prefix) => accountNo.startsWith(prefix)) ||
      SALES_ACCOUNT_KEYWORDS.some((keyword) => fingerprint.includes(keyword))
    );
  }

  buildFingerprint(entry) {
    return [
      entry.accountName,
      entry.accountNo,
      entry.sourceCode,
      entry.documentType,
      entry.documentNo,
      entry.businessUnitCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  getRevenueAmount(entry) {
    const credit = Number.isFinite(entry.creditAmount) ? entry.creditAmount : 0;
    const debit = Number.isFinite(entry.debitAmount) ? entry.debitAmount : 0;
    const amount = Number.isFinite(entry.amount) ? entry.amount : 0;

    const resolved = credit > 0 ? credit : Math.abs(amount) > 0 ? Math.abs(amount) : debit;
    return Number.parseFloat(resolved.toFixed(2));
  }

  resolveSegment(entry) {
    const label = this.buildFingerprint(entry);

    for (const rule of SEGMENT_RULES) {
      if (rule.keywords.some((keyword) => label.includes(keyword))) {
        return rule.segment;
      }
    }

    return "Other Sales";
  }

  resolveRegion(entry) {
    const label = this.buildFingerprint(entry);

    for (const rule of REGION_RULES) {
      if (rule.keywords.some((keyword) => label.includes(keyword))) {
        return rule.region;
      }
    }

    return "Central Region";
  }

  resolveChannel(entry) {
    const label = this.buildFingerprint(entry);

    if (label.includes("website") || label.includes("digital")) {
      return "Search";
    }
    if (label.includes("tv") || label.includes("broadcast")) {
      return "Display Ads";
    }
    if (label.includes("radio")) {
      return "Affiliate";
    }
    if (label.includes("subscription") || label.includes("customer")) {
      return "Email";
    }

    return "Social Media";
  }

  resolveDevice(entry) {
    const label = this.buildFingerprint(entry);
    const score = this.computeScore(label);

    if (label.includes("digital") || label.includes("website")) {
      return score > 0.66 ? "Mobile" : score > 0.33 ? "Desktop" : "Tablet";
    }

    return score > 0.5 ? "Desktop" : "Mobile";
  }

  computeScore(input) {
    const normalized = `${input || "sales"}`;
    let hash = 0;

    for (let index = 0; index < normalized.length; index += 1) {
      hash = (hash * 31 + normalized.charCodeAt(index)) % 1000003;
    }

    return (hash % 1000) / 1000;
  }

  groupBy(entries, keyBuilder) {
    return entries.reduce((groups, entry) => {
      const key = keyBuilder(entry);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(entry);
      return groups;
    }, new Map());
  }

  getWeekKey(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    const day = date.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setUTCDate(date.getUTCDate() + diff);
    return date.toISOString().slice(0, 10);
  }

  getMonthKey(dateValue) {
    const value = `${dateValue || ""}`;
    return value.length >= 7 ? value.slice(0, 7) : "unknown";
  }

  round(value, places = 2) {
    const factor = 10 ** places;
    return Math.round((Number(value || 0) + Number.EPSILON) * factor) / factor;
  }

  async getRevenueAttributionData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => this.getWeekKey(entry.postingDate));

    return Array.from(grouped.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, periodEntries]) => {
        const revenueBySegment = periodEntries.reduce((segments, entry) => {
          const segment = this.resolveSegment(entry);
          const currentAmount = segments.get(segment) || 0;
          segments.set(segment, currentAmount + this.getRevenueAmount(entry));
          return segments;
        }, new Map());

        return {
          date,
          revenue: Array.from(revenueBySegment.entries())
            .map(([segment, amount]) => ({
              segment,
              amount: Number.parseFloat(amount.toFixed(2)),
            }))
            .sort((left, right) => right.amount - left.amount),
        };
      })
      .filter((record) => record.revenue.length > 0);
  }

  async getCustomerLifetimeValueData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => {
      return entry.documentNo || entry.transactionNo || entry.sourceCode || entry.accountNo || "UNKNOWN";
    });

    return Array.from(grouped.entries())
      .map(([customerKey, customerEntries], index) => {
        const orderedEntries = [...customerEntries].sort((left, right) =>
          `${left.postingDate}`.localeCompare(`${right.postingDate}`)
        );
        const totalPurchases = orderedEntries.length;
        const totalRevenue = orderedEntries.reduce(
          (sum, entry) => sum + this.getRevenueAmount(entry),
          0
        );
        const uniqueMonths = new Set(
          orderedEntries.map((entry) => `${entry.postingDate}`.slice(0, 7))
        ).size;
        const avgPurchaseValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
        const avgPurchaseFrequency = Math.max(
          1,
          Math.round(totalPurchases / Math.max(uniqueMonths, 1))
        );
        const retentionRate = Number.parseFloat(
          Math.min(0.99, 0.55 + Math.min(uniqueMonths, 6) * 0.07).toFixed(2)
        );
        const clv = totalRevenue * (1 + retentionRate);
        const joinDate = orderedEntries[0]?.postingDate || startDate;
        const nameSeed =
          orderedEntries[0]?.sourceCode ||
          orderedEntries[0]?.accountName ||
          orderedEntries[0]?.documentType ||
          customerKey;

        return {
          customerId: `LIVE-${String(index + 1).padStart(3, "0")}`,
          name: `${nameSeed}`,
          joinDate,
          totalPurchases,
          totalRevenue: Number.parseFloat(totalRevenue.toFixed(2)),
          avgPurchaseValue: Number.parseFloat(avgPurchaseValue.toFixed(2)),
          avgPurchaseFrequency,
          retentionRate,
          clv: Number.parseFloat(clv.toFixed(2)),
        };
      })
      .sort((left, right) => right.clv - left.clv);
  }

  async getCTRAnalyticsData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => {
      return [
        entry.postingDate,
        entry.accountNo || entry.accountName,
        entry.sourceCode || entry.documentType || "sales",
      ].join("::");
    });

    return Array.from(grouped.entries())
      .map(([groupKey, campaignEntries], index) => {
        const baseEntry = campaignEntries[0];
        const totalRevenue = campaignEntries.reduce(
          (sum, entry) => sum + this.getRevenueAmount(entry),
          0
        );
        const txCount = campaignEntries.length;
        const score = this.computeScore(groupKey);
        const impressions = Math.max(txCount * 250, Math.round(totalRevenue / 25));
        const ctr = 0.018 + score * 0.05;
        const clicks = Math.max(txCount, Math.round(impressions * ctr));
        const conversions = Math.max(
          1,
          Math.min(clicks, Math.round(clicks * (0.12 + score * 0.28)))
        );
        const spend = totalRevenue * (0.08 + score * 0.07);
        const revenuePerConversion = conversions > 0 ? totalRevenue / conversions : totalRevenue;
        const clickThroughRatePercent = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const conversionRatePercent = clicks > 0 ? (conversions / clicks) * 100 : 0;
        const costPerClick = clicks > 0 ? spend / clicks : 0;
        const returnOnAdSpend = spend > 0 ? totalRevenue / spend : 0;

        return {
          campaignId: `LIVE-CAMP-${String(index + 1).padStart(3, "0")}`,
          campaignName: baseEntry.accountName || `Sales Campaign ${index + 1}`,
          channel: this.resolveChannel(baseEntry),
          device: this.resolveDevice(baseEntry),
          date: baseEntry.postingDate,
          impressions,
          clicks,
          conversions,
          spend: Number.parseFloat(spend.toFixed(2)),
          revenuePerConversion: Number.parseFloat(revenuePerConversion.toFixed(2)),
          totalRevenue: Number.parseFloat(totalRevenue.toFixed(2)),
          clickThroughRatePercent: Number.parseFloat(clickThroughRatePercent.toFixed(2)),
          conversionRatePercent: Number.parseFloat(conversionRatePercent.toFixed(2)),
          costPerClick: Number.parseFloat(costPerClick.toFixed(2)),
          returnOnAdSpend: Number.parseFloat(returnOnAdSpend.toFixed(2)),
        };
      })
      .sort((left, right) => left.date.localeCompare(right.date));
  }

  async getConversionFunnelsData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => {
      return [
        this.getWeekKey(entry.postingDate),
        entry.accountNo || entry.accountName,
        entry.sourceCode || "sales",
      ].join("::");
    });

    return Array.from(grouped.entries())
      .map(([groupKey, funnelEntries], index) => {
        const baseEntry = funnelEntries[0];
        const totalRevenue = funnelEntries.reduce(
          (sum, entry) => sum + this.getRevenueAmount(entry),
          0
        );
        const txCount = funnelEntries.length;
        const score = this.computeScore(groupKey);
        const visits = Math.max(txCount * 350, Math.round(totalRevenue / 15));
        const leads = Math.max(txCount, Math.round(visits * (0.1 + score * 0.2)));
        const opportunities = Math.max(
          1,
          Math.min(leads, Math.round(leads * (0.45 + score * 0.25)))
        );
        const conversions = Math.max(
          1,
          Math.min(opportunities, Math.round(opportunities * (0.2 + score * 0.3)))
        );

        return {
          campaign_id: index + 1,
          campaign_name: baseEntry.accountName || `Sales Funnel ${index + 1}`,
          channel: this.resolveChannel(baseEntry),
          device: this.resolveDevice(baseEntry),
          date: this.getWeekKey(baseEntry.postingDate),
          visits,
          leads,
          opportunities,
          conversions,
        };
      })
      .sort((left, right) => left.date.localeCompare(right.date));
  }

  async getTerritoryPerformanceData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => {
      return `${this.getWeekKey(entry.postingDate)}::${this.resolveRegion(entry)}`;
    });

    return Array.from(grouped.entries())
      .map(([groupKey, territoryEntries]) => {
        const [date, region] = groupKey.split("::");
        const totalRevenue = territoryEntries.reduce(
          (sum, entry) => sum + this.getRevenueAmount(entry),
          0
        );
        const totalSales = territoryEntries.length;
        const score = this.computeScore(groupKey);
        const grossProfit = totalRevenue * (0.45 + score * 0.2);
        const netProfit = grossProfit * (0.72 + score * 0.16);
        const prospectedClients = Math.max(
          totalSales,
          Math.round(totalSales * (2.2 + score * 2.4))
        );
        const salesConversionRatePercent = prospectedClients > 0
          ? (totalSales / prospectedClients) * 100
          : 0;
        const averageSaleValue = totalSales > 0 ? totalRevenue / totalSales : 0;
        const customerAcquisitionCost = prospectedClients > 0
          ? (totalRevenue * (0.1 + score * 0.05)) / prospectedClients
          : 0;
        const romiSpend = totalRevenue * (0.08 + score * 0.06);
        const returnOnMarketingInvestment = romiSpend > 0 ? totalRevenue / romiSpend : 0;

        return {
          date,
          region,
          total_revenue: Number.parseFloat(totalRevenue.toFixed(2)),
          gross_profit: Number.parseFloat(grossProfit.toFixed(2)),
          net_profit: Number.parseFloat(netProfit.toFixed(2)),
          profit_margin_percent: Number.parseFloat(
            (totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0).toFixed(2)
          ),
          total_sales: totalSales,
          prospected_clients: prospectedClients,
          sales_conversion_rate_percent: Number.parseFloat(
            salesConversionRatePercent.toFixed(2)
          ),
          average_sale_value: Number.parseFloat(averageSaleValue.toFixed(2)),
          customer_acquisition_cost: Number.parseFloat(
            customerAcquisitionCost.toFixed(2)
          ),
          return_on_marketing_investment: Number.parseFloat(
            returnOnMarketingInvestment.toFixed(2)
          ),
          sales: totalSales,
        };
      })
      .sort((left, right) => left.date.localeCompare(right.date));
  }

  async getCampaignROIData(startDate, endDate) {
    const campaigns = await this.getCTRAnalyticsData(startDate, endDate);
    const { normalizedStartDate, normalizedEndDate } = this.normalizeDateRange(
      startDate,
      endDate
    );

    return campaigns.map((campaign) => {
      const cost = this.round(campaign.spend, 2);
      const revenue = this.round(campaign.totalRevenue, 2);
      const roi = cost > 0 ? ((revenue - cost) / cost) * 100 : 0;

      return {
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
        channel: campaign.channel,
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        cost,
        revenue,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        ROI: this.round(roi, 2),
      };
    });
  }

  async getLeadEfficiencyRecords(startDate, endDate) {
    const funnels = await this.getConversionFunnelsData(startDate, endDate);

    const records = [];
    let counter = 1;

    funnels.forEach((funnel) => {
      const channel = funnel.channel;
      const campaign = funnel.campaign_name;
      const baseDate = funnel.date;
      const spend = this.round((funnel.visits / 1000) * 150000 + funnel.conversions * 5000, 2);
      const mqlCount = Math.max(1, Math.round(funnel.leads * 0.65));
      const sqlCount = Math.max(1, Math.round(funnel.opportunities * 0.75));

      for (let index = 0; index < funnel.leads; index += 1) {
        const score = this.computeScore(`${campaign}-${index}-${baseDate}`);
        const stage =
          index < funnel.conversions
            ? "Customer"
            : index < sqlCount
              ? "SQL"
              : index < mqlCount
                ? "MQL"
                : "Lead";

        records.push({
          Lead_ID: `LEAD-${String(counter).padStart(6, "0")}`,
          Campaign_Name: campaign,
          Channel: channel,
          Stage: stage,
          Lead_Created_Date: baseDate,
          Spend: spend,
          Days_to_Qualification:
            stage === "Lead" ? null : Math.max(1, Math.round(2 + score * 18)),
        });
        counter += 1;
      }
    });

    return records;
  }

  async getRateCardUtilizationData(startDate, endDate, roleCode = null) {
    const entries = await this.#fetchSalesEntries(startDate, endDate, roleCode);
    const grouped = this.groupBy(entries, (entry) => {
      return [
        this.resolveChannel(entry),
        this.getMonthKey(entry.postingDate),
        entry.accountNo || entry.accountName,
      ].join("::");
    });

    let index = 1;
    return Array.from(grouped.entries()).map(([groupKey, items]) => {
      const [channel, month] = groupKey.split("::");
      const totalRevenue = items.reduce(
        (sum, item) => sum + this.getRevenueAmount(item),
        0
      );
      const score = this.computeScore(groupKey);
      const totalImpressions = Math.max(5000, Math.round(totalRevenue / 12));
      const bookedImpressions = Math.min(
        totalImpressions,
        Math.round(totalImpressions * (0.52 + score * 0.43))
      );

      return {
        placementId: `LIVE-P${String(index++).padStart(3, "0")}`,
        placementName: items[0].accountName || "Sales Placement",
        channel,
        totalImpressions,
        bookedImpressions,
        rateUGX: this.round(totalRevenue / Math.max(items.length, 1), 2),
        month,
      };
    });
  }

  async getImpressionShareData(startDate, endDate) {
    const campaigns = await this.getCampaignROIData(startDate, endDate);

    return campaigns.map((campaign, index) => {
      const score = this.computeScore(`${campaign.campaignId}-${campaign.channel}`);
      const eligibleImpressions = Math.max(
        campaign.impressions,
        Math.round(campaign.impressions * (1.1 + score * 0.4))
      );

      return {
        advertiser: `Vision Group ${campaign.channel}`,
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        impressionsReceived: campaign.impressions,
        eligibleImpressions,
        spendUGX: campaign.cost,
        budgetUGX: this.round(campaign.cost * (1.2 + score * 0.35), 2),
        index,
      };
    });
  }

  async getABTestResultsData(startDate, endDate) {
    const campaigns = await this.getCampaignROIData(startDate, endDate);
    const tests = [];

    for (let index = 0; index < campaigns.length - 1; index += 2) {
      const variationAData = campaigns[index];
      const variationBData = campaigns[index + 1];
      const visitorsA = Math.max(1, variationAData.clicks);
      const visitorsB = Math.max(1, variationBData.clicks);
      const conversionsA = Math.max(0, variationAData.conversions);
      const conversionsB = Math.max(0, variationBData.conversions);
      const crA = conversionsA / visitorsA;
      const crB = conversionsB / visitorsB;

      tests.push({
        experimentId: `LIVE-T${String(index / 2 + 1).padStart(3, "0")}`,
        testName: `${variationAData.campaignName} vs ${variationBData.campaignName}`,
        startDate: variationAData.startDate,
        endDate: variationAData.endDate,
        variationA: {
          visitors: visitorsA,
          conversions: conversionsA,
          conversionRate: `${this.round(crA * 100)}%`,
        },
        variationB: {
          visitors: visitorsB,
          conversions: conversionsB,
          conversionRate: `${this.round(crB * 100)}%`,
        },
        results: {
          crUplift: `${this.round(crA > 0 ? ((crB - crA) / crA) * 100 : 0)}%`,
          winner: crA > crB ? "Variation A" : crB > crA ? "Variation B" : "Tie",
        },
      });
    }

    return tests;
  }

  async getCampaignAttributionData(startDate, endDate) {
    const leads = await this.getLeadEfficiencyRecords(startDate, endDate);

    return leads.map((lead, index) => {
      const score = this.computeScore(`${lead.Lead_ID}-${lead.Campaign_Name}`);
      const multiTouch = score > 0.45;
      const channel = lead.Channel;
      const secondaryChannel =
        channel === "Email" ? "Google Ads" : channel === "Search" ? "LinkedIn" : "Email";
      const touchpoints = multiTouch
        ? [lead.Campaign_Name, `${lead.Campaign_Name} Retargeting`]
        : [lead.Campaign_Name];
      const channels = multiTouch ? [channel, secondaryChannel] : [channel];
      const converted = lead.Stage === "Customer";

      return {
        Lead_ID: `ATTR-${String(index + 1).padStart(6, "0")}`,
        Lead_Created_Date: new Date(lead.Lead_Created_Date).toISOString(),
        Touchpoints: touchpoints,
        Channels: channels,
        IsConverted: converted,
        ContractValue: converted ? this.round(2500 + score * 15000, 2) : 0,
      };
    });
  }

  async getBrandLiftData(startDate, endDate) {
    const impressionData = await this.getImpressionShareData(startDate, endDate);

    return impressionData.map((campaign, index) => {
      const score = this.computeScore(`${campaign.campaignId}-${campaign.campaignName}`);
      const engagements = Math.max(1, Math.round(campaign.impressionsReceived * (0.02 + score * 0.08)));
      const engagementRate = (engagements / Math.max(campaign.impressionsReceived, 1)) * 100;
      const surveyScore = 40 + engagementRate * 1.45;

      return {
        Campaign_ID: campaign.campaignId,
        Campaign_Name: campaign.campaignName,
        Channel: campaign.advertiser.replace("Vision Group ", ""),
        Date: `${campaign.startDate}T00:00:00.000Z`,
        Impressions: campaign.impressionsReceived,
        Engagements: engagements,
        EngagementRate: this.round(engagementRate, 4),
        SurveyScore: this.round(surveyScore, 4),
        index,
      };
    });
  }

  async getContractValueTrendsData(startDate, endDate) {
    const attributionData = await this.getCampaignAttributionData(startDate, endDate);
    const converted = attributionData.filter((lead) => lead.IsConverted);
    const baselineContractValue =
      converted.length > 0
        ? this.round(
            converted.reduce((sum, lead) => sum + lead.ContractValue, 0) /
              converted.length,
            2
          )
        : 5000;

    const rows = converted.map((lead, index) => {
      const campaign = lead.Touchpoints[0] || "Sales Campaign";
      const channel = lead.Channels[0] || "Email";
      const signedDate = `${lead.Lead_Created_Date}`.slice(0, 10);

      return {
        campaignId: `LIVE-C${String(index + 1).padStart(3, "0")}`,
        campaign,
        channel,
        signedDate,
        contractValue: this.round(lead.ContractValue, 2),
        leadStage: "Converted",
        month: this.getMonthKey(signedDate),
      };
    });

    return {
      baselineContractValue,
      contractValueTrendsByChannel: rows.reduce((acc, row) => {
        if (!acc[row.channel]) {
          acc[row.channel] = [];
        }
        acc[row.channel].push(row);
        return acc;
      }, {}),
    };
  }

  async getInRangeSalesAnalytics(startDate, endDate, roleCode = null) {
    return this.#fetchSalesEntries(startDate, endDate, roleCode);
  }
}

export default SalesMarketing;
