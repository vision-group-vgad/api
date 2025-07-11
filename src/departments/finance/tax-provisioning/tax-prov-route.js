import TaxProvController from "./TaxProvController.js";
import express from "express";
import Jwt from "../../../auth/jwt.js";

const taxProvRouter = express.Router();
const taxProvController = new TaxProvController();

/**
 * @swagger
 * /api/v1/tax-provisioning:
 *   get:
 *     summary: Track provisioned taxes
 *     description: Retrieves VAT and other tax groupings including provisioned amount, actual amount spent, and related transactions.
 *     tags: [Tax Provisioning]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the tax provisioning period (e.g. 2024-01-01)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the tax provisioning period (e.g. 2024-03-31)
 *     responses:
 *       200:
 *         description: A list of tax provisioning records grouped by tax type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   taxType:
 *                     type: string
 *                     example: VAT
 *                   provisionedAmount:
 *                     type: number
 *                     example: 500000
 *                   totalSpent:
 *                     type: number
 *                     example: 4247
 *                   transactions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: 2021-08-01
 *                         amount:
 *                           type: number
 *                           example: 4247
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required query parameters: startDate and endDate"
 *       500:
 *         description: Failed to retrieve tax provisioning data
 *         content:
 *           application/json:
 *             example:
 *               error: "Failed to fetch tax provisions."
 */
taxProvRouter.get("/", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required query parameters: startDate and endDate",
    });
  }

  try {
    const response = await taxProvController.extractTaxProvisionings(
      startDate,
      endDate
    );
    res.json(response);
  } catch (err) {
    console.log("Tax provisioning error", err);
    return { err: `Failed to fetch tax provisions.` };
  }
});

export default taxProvRouter;
