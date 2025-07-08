import axios from "axios";

const CMS_API_URL ="https://cms-vgad.visiongroup.co.ug/api/bc-datasets/2021-08-01/2021-10-31";
const BEARER_TOKEN = process.env.CMS_API_KEY;

/**
 * Get Total Asset Value from data
 */
export const getTotalAssetValue = async (req, res) => {
  try {
    const response = await axios.get(CMS_API_URL, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const allData = response.data.data;

    // Filter for asset accounts (assumes G_L_Account_Category or flag exists)
    const assetEntries = allData.filter((entry) => {
      const attrs = entry.attributes;
      return (
        attrs?.G_L_Account_Category === "Asset" ||
        attrs?.Is_Asset_Account === true
      );
    });

    // Calculate total asset value 
    let totalAssetValue = 0;
    assetEntries.forEach((entry) => {
      const debit = parseFloat(entry.attributes.Debit_Amount || "0");
      const credit = parseFloat(entry.attributes.Credit_Amount || "0");
      totalAssetValue += debit - credit;
    });

    res.json({
      success: true,
      totalAssetValue,
      totalRecords: assetEntries.length,
    });
  } catch (error) {
    console.error("Asset Value Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to compute total asset value",
    });
  }
};
