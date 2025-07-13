import axios from "axios";

class CollectionEfficiencyController {
  constructor() {
    this.initialized = false;
    this.BC_URL = process.env.CMC_API_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.transformed = [];
    this.dummyCollectionEfficiencies = {
      annual: {
        totalReceivablesDue: 180000,
        totalCollections: 162000,
        collectionEfficiencyPercentage: 90,
      },
      quarterly: [
        {
          quarter: "Q1",
          totalReceivablesDue: 42000,
          totalCollections: 37800,
          collectionEfficiencyPercentage: 90,
        },
        {
          quarter: "Q2",
          totalReceivablesDue: 45000,
          totalCollections: 40500,
          collectionEfficiencyPercentage: 90,
        },
        {
          quarter: "Q3",
          totalReceivablesDue: 46000,
          totalCollections: 41400,
          collectionEfficiencyPercentage: 90,
        },
        {
          quarter: "Q4",
          totalReceivablesDue: 47000,
          totalCollections: 42500,
          collectionEfficiencyPercentage: 90.43,
        },
      ],
      monthly: [
        {
          month: "2021-01",
          receivablesDue: 14000,
          collections: 12600,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-02",
          receivablesDue: 13000,
          collections: 11700,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-03",
          receivablesDue: 15000,
          collections: 13500,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-04",
          receivablesDue: 16000,
          collections: 14400,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-05",
          receivablesDue: 15000,
          collections: 13500,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-06",
          receivablesDue: 14000,
          collections: 12600,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-07",
          receivablesDue: 16000,
          collections: 14400,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-08",
          receivablesDue: 15000,
          collections: 13500,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-09",
          receivablesDue: 15000,
          collections: 13500,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-10",
          receivablesDue: 16000,
          collections: 14400,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-11",
          receivablesDue: 15000,
          collections: 13500,
          collectionEfficiencyPercentage: 90,
        },
        {
          month: "2021-12",
          receivablesDue: 16000,
          collections: 15000,
          collectionEfficiencyPercentage: 93.75,
        },
      ],
    };
    this.dummyTransactionRecords = [
      {
        date: "2021-01-05",
        customer: "ABC Ltd",
        invoiceAmount: 4000,
        amountCollected: 3600,
      },
      {
        date: "2021-01-12",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },
      {
        date: "2021-01-22",
        customer: "Delta Inc",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },

      {
        date: "2021-02-03",
        customer: "ABC Ltd",
        invoiceAmount: 4000,
        amountCollected: 3600,
      },
      {
        date: "2021-02-15",
        customer: "Omega Ltd",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },
      {
        date: "2021-02-26",
        customer: "XYZ Ltd",
        invoiceAmount: 4000,
        amountCollected: 3600,
      },

      {
        date: "2021-03-02",
        customer: "Delta Inc",
        invoiceAmount: 6000,
        amountCollected: 5400,
      },
      {
        date: "2021-03-18",
        customer: "ABC Ltd",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },
      {
        date: "2021-03-25",
        customer: "XYZ Ltd",
        invoiceAmount: 4000,
        amountCollected: 3600,
      },

      {
        date: "2021-04-01",
        customer: "ABC Ltd",
        invoiceAmount: 6000,
        amountCollected: 5400,
      },
      {
        date: "2021-04-19",
        customer: "Omega Ltd",
        invoiceAmount: 6000,
        amountCollected: 5400,
      },
      {
        date: "2021-04-28",
        customer: "XYZ Ltd",
        invoiceAmount: 4000,
        amountCollected: 3600,
      },

      {
        date: "2021-05-07",
        customer: "ABC Ltd",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },
      {
        date: "2021-05-15",
        customer: "Omega Ltd",
        invoiceAmount: 4000,
        amountCollected: 3800,
      },
      {
        date: "2021-05-23",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },

      {
        date: "2021-06-04",
        customer: "Delta Inc",
        invoiceAmount: 6000,
        amountCollected: 5800,
      },
      {
        date: "2021-06-17",
        customer: "ABC Ltd",
        invoiceAmount: 4000,
        amountCollected: 3900,
      },
      {
        date: "2021-06-28",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },

      {
        date: "2021-07-06",
        customer: "ABC Ltd",
        invoiceAmount: 6000,
        amountCollected: 5700,
      },
      {
        date: "2021-07-18",
        customer: "Omega Ltd",
        invoiceAmount: 4000,
        amountCollected: 3900,
      },
      {
        date: "2021-07-27",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },

      {
        date: "2021-08-03",
        customer: "ABC Ltd",
        invoiceAmount: 5000,
        amountCollected: 4800,
      },
      {
        date: "2021-08-14",
        customer: "Omega Ltd",
        invoiceAmount: 5000,
        amountCollected: 4500,
      },
      {
        date: "2021-08-25",
        customer: "Delta Inc",
        invoiceAmount: 5000,
        amountCollected: 4600,
      },

      {
        date: "2021-09-08",
        customer: "XYZ Ltd",
        invoiceAmount: 4000,
        amountCollected: 3800,
      },
      {
        date: "2021-09-17",
        customer: "Omega Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },
      {
        date: "2021-09-29",
        customer: "ABC Ltd",
        invoiceAmount: 6000,
        amountCollected: 5700,
      },

      {
        date: "2021-10-05",
        customer: "Delta Inc",
        invoiceAmount: 6000,
        amountCollected: 5900,
      },
      {
        date: "2021-10-14",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },
      {
        date: "2021-10-26",
        customer: "Omega Ltd",
        invoiceAmount: 4000,
        amountCollected: 3900,
      },

      {
        date: "2021-11-03",
        customer: "ABC Ltd",
        invoiceAmount: 5000,
        amountCollected: 4800,
      },
      {
        date: "2021-11-16",
        customer: "XYZ Ltd",
        invoiceAmount: 6000,
        amountCollected: 5800,
      },
      {
        date: "2021-11-27",
        customer: "Delta Inc",
        invoiceAmount: 4000,
        amountCollected: 3900,
      },

      {
        date: "2021-12-05",
        customer: "ABC Ltd",
        invoiceAmount: 6000,
        amountCollected: 6000,
      },
      {
        date: "2021-12-13",
        customer: "XYZ Ltd",
        invoiceAmount: 5000,
        amountCollected: 4700,
      },
      {
        date: "2021-12-22",
        customer: "Omega Ltd",
        invoiceAmount: 5000,
        amountCollected: 4300,
      },
    ];
  }

  initialize() {
    if (this.initialized) return;

    this.apiClient = axios.create({
      baseURL: this.BC_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.BC_API_KEY}`;
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "Bad debt ratios endpoint error:",
          error.response?.data || error.message
        );
        throw error;
      }
    );

    this.initialized = true;
  }

  async #fetchData(startDate, endDate, limit = 100) {
    this.initialize();
    const url = `/bc-datasets/${startDate}/${endDate}`;

    try {
      const response = await this.apiClient.get(url);
      const allData = response.data?.data || [];
      const slicedData = allData.slice(0, limit);

      const transformed = slicedData.map((entry) => ({
        id: entry.id,
        ...entry.attributes,
      }));

      this.transformed = this.dummyCollectionEfficiencies;
      return this.transformed;
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      return { error: "Failed to fetch data for bad debt ratios" };
    }
  }
  async getAnnualData(year) {
    if (year !== "2021") return `No data for ${year}`;
    return this.dummyTransactionRecords;
  }

  async getAnnualTransactions(year) {
    if (year !== "2021") return `No data for ${year}`;
    return this.dummyTransactionRecords;
  }

  async getEfficiencyByMonth(year, month) {
    const data = this.dummyCollectionEfficiencies;
    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;

    const monthEntry = data.monthly.find(
      (entry) => entry.month === formattedMonth
    );

    if (!monthEntry) {
      return { error: `No data found for month: ${formattedMonth}` };
    }

    return {
      month: monthEntry.month,
      receivablesDue: monthEntry.receivablesDue,
      collections: monthEntry.collections,
      collectionEfficiencyPercentage: monthEntry.collectionEfficiencyPercentage,
    };
  }

  async getEfficiencyByDateRange(startDate, endDate, limit = 100) {
    const data = await this.#fetchData(startDate, endDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredMonthly = data.monthly.filter((entry) => {
      const entryDate = new Date(entry.month + "-01");
      return entryDate >= start && entryDate <= end;
    });

    const limitedFiltered = filteredMonthly.slice(0, limit);

    const totals = limitedFiltered.reduce(
      (acc, entry) => {
        acc.receivablesDue += entry.receivablesDue;
        acc.collections += entry.collections;
        return acc;
      },
      { receivablesDue: 0, collections: 0 }
    );

    const efficiency =
      totals.receivablesDue > 0
        ? (totals.collections / totals.receivablesDue) * 100
        : 0;

    return {
      filteredMonthly: limitedFiltered,
      totalReceivablesDue: totals.receivablesDue,
      totalCollections: totals.collections,
      overallCollectionEfficiencyPercentage: parseFloat(efficiency.toFixed(2)),
    };
  }
  async getTransactionsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filtered = this.dummyTransactionRecords.filter(({ date }) => {
      const txDate = new Date(date);
      return txDate >= start && txDate <= end;
    });

    return filtered;
  }

  async getTransactionsByDay(date) {
    const all = this.dummyTransactionRecords || [];
    const result = all.filter((entry) => entry.date === date);

    return {
      date,
      transactions: result,
    };
  }

  async getTransactionsByMonth(year, month) {
    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;
    const result = {
      month: formattedMonth,
      totalReceivables: 0,
      totalCollected: 0,
      transactions: [],
    };

    for (const tx of this.dummyTransactionRecords) {
      if (tx.date.startsWith(formattedMonth)) {
        result.totalReceivables += tx.invoiceAmount;
        result.totalCollected += tx.amountCollected;
        result.transactions.push(tx);
      }
    }

    if (result.transactions.length === 0) {
      return { error: `No transactions found for month: ${formattedMonth}` };
    }

    return result;
  }
}

export default CollectionEfficiencyController;
