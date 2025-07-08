import axios from "axios";
import express from "express";

const router = express.Router();

const CMS_API_URL =
  "https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-08-01/2021-10-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      timeout: 10000, // 10 seconds max to wait
    });

    const allEntries = response.data.data;

    const depreciationEntries = allEntries.filter((entry) => {
      const name = entry.attributes.G_L_Account_Name?.toLowerCase() || "";
      return name.includes("depreciation");
    });

    const result = depreciationEntries.map((entry) => ({
      account: entry.attributes.G_L_Account_Name,
      gl_no: entry.attributes.G_L_Account_No,
      posting_date: entry.attributes.Posting_Date,
      debit: parseFloat(entry.attributes.Debit_Amount || "0"),
      credit: parseFloat(entry.attributes.Credit_Amount || "0"),
      amount: parseFloat(entry.attributes.Amount || "0"),
    }));

    res.json({ source: "live", data: result });
  } catch (error) {
    
    console.error("Fetch Error:", error.message);

    
    if (error.code === "ECONNABORTED" || error.message.includes("ETIMEDOUT")) {
      console.error("Network Timeout..API server is unreachable.");
      return res
        .status(504)
        .json({
          error:
            "Timeout CMS API is unreachable (network or firewall issue).",
        });
    }

    // Unauthorized (bad token or no token)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, Bad or missing API token.");
      return res
        .status(401)
        .json({ error: "Unauthorized, Invalid or missing API token." });
    }

    // Forbidden – Token is valid but has no permission
    if (error.response && error.response.status === 403) {
      console.error(
        "Forbidden, Token is valid but lacks access permissions."
      );
      return res
        .status(403)
        .json({
          error: "Forbidden, Token does not have access to this dataset.",
        });
    }

    // Other API errors (non-200 status codes)
    if (error.response) {
      console.error("API Error Received non-200 status code");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      return res.status(500).json({
        error: `API responded with status ${error.response.status}`,
        details: error.response.data,
      });
    }

    
    res
      .status(500)
      .json({ error: "Unknown error fetching asset depreciation entries" });
  }
});
  


router.get("/dummy", (req, res) => {
  const dummyDepreciation = [
    {
      asset_id: "VEH-2020-01",
      asset_name: "Toyota Hilux (Company Car)",
      acquisition_date: "2020-01-10",
      acquisition_cost: 120000000,
      useful_life_years: 5, // Expected life of the asset
      residual_value: 20000000, //expected value at end
      depreciation_method: "straight_line",
      accumulated_depreciation: 72000000, // UGX 72M depreciated so far
      current_value: 48000000, // value today
      schedule: [
        { year: 2020, amount: 20000000 },
        { year: 2021, amount: 20000000 },
        { year: 2022, amount: 20000000 },
        { year: 2023, amount: 12000000 }, // Partial year or custom depreciation
      ],
    },
    {
      asset_id: "EQUIP-2019-07",
      asset_name: "Office Printer X500",
      acquisition_date: "2019-07-15",
      acquisition_cost: 8000000, 
      useful_life_years: 4,
      residual_value: 500000, 
      depreciation_method: "straight_line",
      accumulated_depreciation: 6000000, // UGX 6M depreciated so far
      current_value: 2000000, //  value today
      schedule: [
        { year: 2019, amount: 1875000 },
        { year: 2020, amount: 2000000 },
        { year: 2021, amount: 2125000 },
      ],
    },
  ];

  res.json({ source: "dummy", data: dummyDepreciation });
});
  
export default router;
