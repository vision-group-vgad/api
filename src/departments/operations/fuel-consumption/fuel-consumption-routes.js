import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";
import FuelConsumptionController from "./FuelConsumptionController.js";

const fuelConsController = new FuelConsumptionController();
const fuelConsRouter = express.Router();

/**
 * @swagger
 * /api/v1/operations/fuel-consumption/in-range:
 *   get:
 *     summary: Get fuel consumption analytics for a date range
 *     description: Returns filtered fuel consumption analytics including machines, operators, and average daily liters within a specified date range.
 *     tags: [Fuel Consumption]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Analytics successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered fuel consumption records
 *                 summary:
 *                   type: object
 *                   properties:
 *                     machines:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of unique machine names
 *                     most_fuel_cons_driver:
 *                       type: string
 *                       description: Driver who consumed the most fuel
 *                     least_fuel_cons_driver:
 *                       type: string
 *                       description: Driver who consumed the least fuel
 *                     most_fuel_cons_machine:
 *                       type: string
 *                       description: Machine that consumed the most fuel
 *                     least_fuel_cons_machine:
 *                       type: string
 *                       description: Machine that consumed the least fuel
 *                     avg_daily_liters:
 *                       type: number
 *                       description: Average liters consumed per day
 *       400:
 *         description: Invalid date range or missing parameters
 *       500:
 *         description: Internal server error
 */
fuelConsRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await fuelConsController.getInRangeAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default fuelConsRouter;
