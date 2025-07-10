import axios from "axios";

class GLRecoController {
  constructor() {
    this.BC_URL = process.env.BUSINESS_CENTRAL_BASE_URL;
    this.BC_API_KEY = process.env.CMS_API_KEY;
    this.subLedgerBlcs = [];
    this.generalLedgerBlc = 0;
  }

  async fetchData(startDate, endDate) {
    try {
      const results = await axios.get(
        `${this.BC_URL}/bc-datasets/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${this.BC_API_KEY}`,
          },
        }
      );
      console.log("Response", results.data.data);
      return results.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Failed to fetch GL reconciliation data" };
    }
  }
}
export default GLRecoController;
