import express from 'express';
import { getExpenseCategories } from './expenseCategoryController.js';
import Jwt from '../../../auth/jwt.js';

const expenseRouter = express.Router();

/**
 * @swagger
 * /api/v1/expense-category:
 *   get:
 *     summary: Get categorized expenses, total amount, and transaction breakdown
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the data range (e.g., 2021-01-01)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the data range (e.g., 2021-11-01)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 25000
 *         description: Maximum number of records to return
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional filter by expense category
 *     responses:
 *       200:
 *         description: Returns categorized expenses and full transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                   example: 2290329118
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Cash Control
 *                       total:
 *                         type: number
 *                         example: 1112443942
 *                       accounts:
 *                         type: array
 *                         items:
 *                           type: string
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       entryNo:
 *                         type: string
 *                         example: "19511"
 *                       transactionNo:
 *                         type: string
 *                         example: "2223"
 *                       postingDate:
 *                         type: string
 *                         format: date
 *                         example: "2021-08-10"
 *                       documentDate:
 *                         type: string
 *                         format: date
 *                         example: "2021-08-10"
 *                       documentType:
 *                         type: string
 *                         example: "Payment"
 *                       documentNo:
 *                         type: string
 *                         example: "B-SK000020RN"
 *                       sourceCode:
 *                         type: string
 *                         example: "CASHRECJNL"
 *                       amount:
 *                         type: number
 *                         example: 19000
 *                       accountName:
 *                         type: string
 *                         example: "Mbarara Cash Control"
 *                       accountNo:
 *                         type: string
 *                         example: "10060"
 *                       category:
 *                         type: string
 *                         example: "Cash Control"
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Failed to retrieve categorized expenses
 */

expenseRouter.get('/', Jwt.verifyToken, getExpenseCategories);

export default expenseRouter;
