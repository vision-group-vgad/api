import express from "express";
import Jwt from "../../../auth/jwt.js";
import {
  getProductionYield,
  getProductionYieldKPIs,
  getMachineOEE,
  getMachineOEEKPIs,
  getMaterialWaste,
  getMaterialWasteKPIs
} from "./OperationsProductionAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/production-yield:
 *   get:
 *     summary: Get production yield analytics (paginated)
 *     description: Returns production yield analytics with filters and pagination.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *       - in: query
 *         name: shift
 *         schema: { type: string }
 *       - in: query
 *         name: machine
 *         schema: { type: string }
 *       - in: query
 *         name: operator
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Production yield analytics retrieved successfully
 */
router.get(
  "/production-yield",
  Jwt.verifyToken,
  getProductionYield
);

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/production-yield/kpis:
 *   get:
 *     summary: Get production yield KPIs
 *     description: Returns KPIs for production yield analytics.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *       - in: query
 *         name: shift
 *         schema: { type: string }
 *       - in: query
 *         name: machine
 *         schema: { type: string }
 *       - in: query
 *         name: operator
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Production yield KPIs retrieved successfully
 */
router.get(
  "/production-yield/kpis",
  Jwt.verifyToken,
  getProductionYieldKPIs
);

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/machine-oee:
 *   get:
 *     summary: Get machine OEE analytics (paginated)
 *     description: Returns machine OEE analytics with filters and pagination.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *       - in: query
 *         name: machine
 *         schema: { type: string }
 *       - in: query
 *         name: line
 *         schema: { type: string }
 *       - in: query
 *         name: shift
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Machine OEE analytics retrieved successfully
 */
router.get(
  "/machine-oee",
  Jwt.verifyToken,
  getMachineOEE
);

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/machine-oee/kpis:
 *   get:
 *     summary: Get machine OEE KPIs
 *     description: Returns KPIs for machine OEE analytics.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: machine
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Machine OEE KPIs retrieved successfully
 */
router.get(
  "/machine-oee/kpis",
  Jwt.verifyToken,
  getMachineOEEKPIs
);

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/material-waste:
 *   get:
 *     summary: Get material waste analytics (paginated)
 *     description: Returns material waste analytics with filters and pagination.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema: { type: string }
 *       - in: query
 *         name: material
 *         schema: { type: string }
 *       - in: query
 *         name: machine
 *         schema: { type: string }
 *       - in: query
 *         name: waste_reason
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Material waste analytics retrieved successfully
 */
router.get(
  "/material-waste",
  Jwt.verifyToken,
  getMaterialWaste
);

/**
 * @swagger
 * /api/v1/operations/OperationsProductionAnalytics/material-waste/kpis:
 *   get:
 *     summary: Get material waste KPIs
 *     description: Returns KPIs for material waste analytics.
 *     tags: [Operations & Production Analytics]
 *     parameters:
 *       - in: query
 *         name: material
 *         schema: { type: string }
 *       - in: query
 *         name: waste_reason
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Material waste KPIs retrieved successfully
 */
router.get(
  "/material-waste/kpis",
  Jwt.verifyToken,
  getMaterialWasteKPIs
);

export default router;