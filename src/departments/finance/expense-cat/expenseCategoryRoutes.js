import express from 'express';
import { getExpenseCategories } from './expenseCategoryController.js';

const expenseRouter = express.Router();

/**
 * @swagger
 * /api/v1/expenses/categories:
 *   get:
 *     summary: Get total expenses grouped by category (with optional filter)
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter results by specific expense category
 *         example: Utilities
 *     responses:
 *       200:
 *         description: Grouped expense totals by category
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
 *                         example: Travel
 *                       total:
 *                         type: number
 *                         example: 56000
 *                       accounts:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Server error
 */
expenseRouter.get('/', getExpenseCategories);

export default expenseRouter;
