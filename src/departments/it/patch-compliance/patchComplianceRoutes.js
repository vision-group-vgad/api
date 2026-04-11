// src/departments/it/patch-compliance/patchComplianceRouter.js
import express from 'express';
import Jwt from '../../../auth/jwt.js';
import PatchComplianceController from './patchComplianceController.js';

const router = express.Router();
const patchComplianceController = new PatchComplianceController();

/**
 * @swagger
 * tags:
 *   name: Patch Compliance
 *   description: Patch compliance metrics for systems
 */

/**
 * @swagger
 * /api/v1/patch-compliance:
 *   get:
 *     summary: Get patch compliance data by system
 *     description: Returns compliant and non-compliant percentages for each system
 *     tags: [Patch Compliance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patch compliance data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       system:
 *                         type: string
 *                         example: Windows 10
 *                       compliant:
 *                         type: number
 *                         example: 85
 *                       nonCompliant:
 *                         type: number
 *                         example: 15
 *                 message:
 *                   type: string
 *                   example: Patch compliance status retrieved successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error retrieving patch compliance data
 */
router.get('/', (req, res) =>
    patchComplianceController.getPatchComplianceStatus(req, res)
  );  

export default router;
