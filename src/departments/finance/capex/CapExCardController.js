// import axios from "axios";

// class CapExCardController {
//   constructor() {
//     this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
//     this.CMS_API_KEY = process.env.CMS_API_KEY;
//     this.date = new Date();
//     this.assets = [];
//   }

//   async #fetchData() {
//     // const response = await axios.get(
//     //   this.VISION_GROUP_CMS_ROOT_URL + "/capex",
//     //   {
//     //     params: {
//     //       duration: this.date.getFullYear(),
//     //     },
//     //     headers: {
//     //       Authorization: `Bearer ${this.CMS_API_KEY}`,
//     //     },
//     //   }
//     // );
//     this.assets = [
//       {
//         id: 1,
//         item: "New Server Rack",
//         amount: 8000,
//         category: "IT Infrastructure",
//         date: "2025-01-15",
//       },
//       {
//         id: 2,
//         item: "Office Furniture",
//         amount: 3500,
//         category: "Facilities",
//         date: "2025-03-20",
//       },
//       {
//         id: 3,
//         item: "Factory Machine",
//         amount: 25000,
//         category: "Manufacturing",
//         date: "2025-06-05",
//       },
//       {
//         id: 4,
//         item: "Building Renovation",
//         amount: 15000,
//         category: "Facilities",
//         date: "2025-12-10",
//       },
//       {
//         id: 5,
//         item: "Backup Generator",
//         amount: 6000,
//         category: "Power",
//         date: "2025-08-01",
//       },
//     ];
//   }

//   async getCapEx() {
//     await this.#fetchData();
//     const totalAnnualCapEx = this.assets
//       .map((asset) => asset.amount)
//       .reduce((acc, curr) => acc + curr, 0);
//     return {
//       year: this.date.getFullYear(),
//       total_capex: totalAnnualCapEx,
//     };
//   }
// }

// export default CapExCardController;
