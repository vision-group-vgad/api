// routes/financeRoutes.js
import express from 'express';
import { getBudgetVariance } from './budgetVarianceController.js';
import Jwt from '../../../auth/jwt.js';

const budVarienceRouter = express.Router();

/**
 * @swagger
 * /api/v1/finance/budget-variance:
 *   get:
 *     summary: Get actual vs. budget variance for each account
 *     tags: [Finance]
 *     responses:
 *       200:
 *         description: Budget variance by account
 *         content:
 *           application/json:
 *             example:
 *               variance: [
 *                 {
 *                   G_L_Account_No: "10060",
 *                   G_L_Account_Name: "Cash Control",
 *                   actual: 32000,
 *                   budget: 50000,
 *                   variance: -18000
 *                 }
 *               ]
 *       500:
 *         description: Internal server error
 */


budVarienceRouter.get('/',Jwt.verifyToken, getBudgetVariance);

export default budVarienceRouter;
