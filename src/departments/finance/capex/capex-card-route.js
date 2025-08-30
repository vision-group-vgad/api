// import CapExCardController from "./CapExCardController.js";
// import express from "express";
// import Jwt from "../../../auth/jwt.js";

// const capExCardRouter = express.Router();
// const capExCardController = new CapExCardController();

// // /**
// //  * @swagger
// //  * /api/v1/capex:
// //  *   get:
// //  *     summary: Get total capital expenditures for the current year
// //  *     tags: [Capital Expenditure]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     responses:
// //  *       200:
// //  *         description: Total CAPEX for the current year
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 year:
// //  *                   type: integer
// //  *                   example: 2025
// //  *                 total_capex:
// //  *                   type: number
// //  *                   format: float
// //  *                   example: 48500
// //  *       401:
// //  *         description: Unauthorized – missing or invalid token
// //  */

// capExCardRouter.get("/", Jwt.verifyToken, async (req, res) => {
//   res.json(await capExCardController.getCapEx());
// });

// export default capExCardRouter;
