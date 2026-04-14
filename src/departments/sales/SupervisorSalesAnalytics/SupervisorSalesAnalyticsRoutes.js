import express from "express";
import {
  getSupervisorAnalyticsOverview,
  getPipelineVelocity,
  getPipelineVelocityKPIs,
  getQuotaAttainment,
  getQuotaAttainmentKPIs,
  getAccountPenetration,
  getAccountPenetrationKPIs,
  getCorporateAccountHealth,
  getCorporateAccountHealthKPIs
} from "./SupervisorSalesAnalyticsController.js";

const router = express.Router();

router.get("/", getSupervisorAnalyticsOverview);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity:
 *   get:
 *     summary: Get pipeline velocity analytics (paginated)
 *     description: Returns pipeline velocity analytics with filters and pagination.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: stage
 *         schema: { type: string }
 *       - in: query
 *         name: owner
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: product
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
 *         description: Pipeline velocity analytics retrieved successfully
 */
router.get(
  "/pipeline-velocity",
  getPipelineVelocity
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/pipeline-velocity/kpis:
 *   get:
 *     summary: Get pipeline velocity KPIs
 *     description: Returns KPIs for pipeline velocity analytics.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: stage
 *         schema: { type: string }
 *       - in: query
 *         name: owner
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: product
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pipeline velocity KPIs retrieved successfully
 */
router.get(
  "/pipeline-velocity/kpis",
  getPipelineVelocityKPIs
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/quota-attainment:
 *   get:
 *     summary: Get quota attainment analytics (paginated)
 *     description: Returns quota attainment analytics with filters and pagination.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: rep_id
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: period
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
 *         description: Quota attainment analytics retrieved successfully
 */
router.get(
  "/quota-attainment",
  getQuotaAttainment
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/quota-attainment/kpis:
 *   get:
 *     summary: Get quota attainment KPIs
 *     description: Returns KPIs for quota attainment analytics.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: rep_id
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: period
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quota attainment KPIs retrieved successfully
 */
router.get(
  "/quota-attainment/kpis",
  getQuotaAttainmentKPIs
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/account-penetration:
 *   get:
 *     summary: Get account penetration analytics (paginated)
 *     description: Returns account penetration analytics with filters and pagination.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: account_size
 *         schema: { type: integer }
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
 *         description: Account penetration analytics retrieved successfully
 */
router.get(
  "/account-penetration",
  getAccountPenetration
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/account-penetration/kpis:
 *   get:
 *     summary: Get account penetration KPIs
 *     description: Returns KPIs for account penetration analytics.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: account_size
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account penetration KPIs retrieved successfully
 */
router.get(
  "/account-penetration/kpis",
  getAccountPenetrationKPIs
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/corporate-account-health:
 *   get:
 *     summary: Get corporate account health analytics (paginated)
 *     description: Returns corporate account health analytics with filters and pagination.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: account_manager
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: account_size
 *         schema: { type: integer }
 *       - in: query
 *         name: health_status
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
 *         description: Corporate account health analytics retrieved successfully
 */
router.get(
  "/corporate-account-health",
  getCorporateAccountHealth
);

/**
 * @swagger
 * /api/v1/sales/SupervisorSalesAnalytics/corporate-account-health/kpis:
 *   get:
 *     summary: Get corporate account health KPIs
 *     description: Returns KPIs for corporate account health analytics.
 *     tags: [Sales Supervisor Analytics]
 *     parameters:
 *       - in: query
 *         name: account_manager
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: account_size
 *         schema: { type: integer }
 *       - in: query
 *         name: health_status
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Corporate account health KPIs retrieved successfully
 */
router.get(
  "/corporate-account-health/kpis",
  getCorporateAccountHealthKPIs
);

export default router;