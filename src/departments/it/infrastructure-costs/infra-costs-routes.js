import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";
import InfraCostsController from "./InfraCostsController.js";

const infraCostsRouter = express.Router();
const infraCostsController = new InfraCostsController();

/**
 * @swagger
 * /api/v1/it/infra-costs/in-range:
 *   get:
 *     summary: Get infrastructure costs in a date range
 *     description: Returns infrastructure cost data filtered between the given start and end dates.
 *     tags:
 *       - Infrastructure Costs
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response with infrastructure cost data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: Compute
 *                   service:
 *                     type: string
 *                     example: EC2 Instances
 *                   cost:
 *                     type: number
 *                     example: 1270000
 *                   unit:
 *                     type: string
 *                     example: UGX
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2025-06-03
 *       400:
 *         description: Invalid date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date range"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
infraCostsRouter.get("/in-range", async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate, res);

  try {
    const results = await infraCostsController.getInRangeData(
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

export default infraCostsRouter;
