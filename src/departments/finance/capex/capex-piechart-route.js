// import express from "express";
// import CapExPieChartController from "./CapExPieChartController.js";
// import Jwt from "../../../auth/jwt.js";

// const capExPieChartRouter = express.Router();
// const capExController = new CapExPieChartController();

// // /**
// //  * @swagger
// //  * /api/v1/capex-piechart/{year}:
// //  *   get:
// //  *     summary: Get CAPEX distribution per asset category for a given year
// //  *     tags: [Capital Expenditure]
// //  *     parameters:
// //  *       - in: path
// //  *         name: year
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *         description: The year to retrieve CAPEX data for
// //  *       - in: query
// //  *         name: month
// //  *         required: false
// //  *         schema:
// //  *           type: integer
// //  *         description: Optional month filter
// //  *       - in: query
// //  *         name: date
// //  *         required: false
// //  *         schema:
// //  *           type: integer
// //  *         description: Optional specific date filter
// //  *     security:
// //  *       - bearerAuth: []
// //  *     responses:
// //  *       200:
// //  *         description: Successfully fetched CAPEX data per category
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 duration:
// //  *                   type: object
// //  *                   properties:
// //  *                     year:
// //  *                       type: integer
// //  *                     month:
// //  *                       type: integer
// //  *                     date:
// //  *                       type: integer
// //  *                 reports:
// //  *                   type: array
// //  *                   items:
// //  *                     type: object
// //  *                     properties:
// //  *                       category:
// //  *                         type: string
// //  *                       amount:
// //  *                         type: number
// //  *                       degree:
// //  *                         type: number
// //  */
// capExPieChartRouter.get("/:year", async (req, res) => {
//   const { year } = req.params;
//   const { month = null, date = null } = req.query;

//   const duration = {
//     year: parseInt(year),
//     month: month ? parseInt(month) : null,
//     date: date ? parseInt(date) : null,
//   };

//   const reports = await capExController.getCapExByCategory(duration);

//   res.json({
//     duration,
//     reports,
//   });
// });

// export default capExPieChartRouter;
