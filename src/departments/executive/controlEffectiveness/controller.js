import express from 'express';
import { getControls } from './service.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Control Effectiveness
 *   description: API to visualise control effectiveness for the organisation
 */

/**
 * @swagger
 * /api/v1/executives/control-effectiveness:
 *   get:
 *     summary: Get control effectiveness records
 *     tags: [ Control Effectiveness ]
 *     description: Retrieve control effectiveness records with optional filters
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date to filter lastTestedDate
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date to filter lastTestedDate
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (Active/Inactive)
 *     responses:
 *       200:
 *         description: List of control effectiveness records or message
 */
router.get('/', (req, res) => {
  const { startDate, endDate, department, status } = req.query;
  const filters = { startDate, endDate, department, status };
  const data = getControls(filters);

  // If data is an object with message, return that message
  if (data.message) {
    return res.status(200).json({ message: data.message });
  }

  res.status(200).json(data);
});

export default router;
