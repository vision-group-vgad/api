import express from 'express';
import { getExpenseCategories } from './expenseCategoryController.js';

const expenseRouter = express.Router();

/**
 * @swagger
 * /api/v1/expense-category:
 *   get:
 *     summary: Get categorized expenses with budgets per account
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records from this date (inclusive)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records up to this date (inclusive)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 25000
 *         description: Maximum number of records to process
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter by expense category
 *     responses:
 *       200:
 *         description: Categorized expenses with budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       total:
 *                         type: number
 *                       accounts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             budget:
 *                               type: number
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Failed to retrieve categorized expenses
 */

expenseRouter.get('/', getExpenseCategories);

export default expenseRouter;
