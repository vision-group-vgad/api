import express from 'express';
import { getBudgetVariance } from './budgetVarianceController.js';
import Jwt from '../../../auth/jwt.js';

const budVarienceRouter = express.Router();

/**
 * @swagger
 * /api/v1/budget-variance:
 *   get:
 *     summary: Get actual vs. budget variance for each account
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the dataset (YYYY-MM-DD)
 *         example: 2021-08-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the dataset (YYYY-MM-DD)
 *         example: 2021-10-31
 *       
 *       - in: query
 *         name: accountName
 *         schema:
 *           type: string
 *         description: Optional filter for account name (partial, case-insensitive)
 *         example: H/O Cash Receipts Cont
 *     responses:
 *       200:
 *         description: Budget variance by account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 variance:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       G_L_Account_No:
 *                         type: string
 *                         example: "10060"
 *                       G_L_Account_Name:
 *                         type: string
 *                         example: "Mbarara Cash Control"
 *                       actual:
 *                         type: number
 *                         example: 32000000
 *                       budget:
 *                         type: number
 *                         example: 50000000
 *                       variance:
 *                         type: number
 *                         example: 18000000
 *       500:
 *         description: Internal server error
 */

budVarienceRouter.get('/', getBudgetVariance);

export default budVarienceRouter;
