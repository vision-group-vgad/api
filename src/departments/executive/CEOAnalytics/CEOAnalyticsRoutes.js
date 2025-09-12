import express from "express";
import Jwt from "../../../auth/jwt.js";
import {
  getGovernanceCompliance,
  getLegalExposure,
  getBoardReportingMetrics,
  getWorkforceAnalytics,
  getRetentionRates,
  getCompensationBenchmarks,
  getGovernanceComplianceKPIs,
  getLegalExposureKPIs,
  getBoardReportingKPIs,
  getWorkforceKPIs,
  getRetentionKPIs,
  getCompensationBenchmarksKPIs,
  getComplianceAreas,
  getComplianceStatuses,
  getCaseTypes,
  getRiskLevels,
  getLegalStatuses,
  getDepartments,
  getYears,
  getMonths,
  getCompensationDepartments,
  getRoleLevels,
  getRegions,
  getComplianceGaps
} from "./CEOAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/governance-compliance:
 *   get:
 *     summary: Get governance compliance analytics (paginated)
 *     description: Returns governance compliance analytics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: compliance_area
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Governance compliance analytics retrieved successfully
 */
router.get("/governance-compliance", Jwt.verifyToken, getGovernanceCompliance);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/legal-exposure:
 *   get:
 *     summary: Get legal exposure analytics (paginated)
 *     description: Returns legal exposure analytics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: case_type
 *         schema: { type: string }
 *       - in: query
 *         name: risk_level
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Legal exposure analytics retrieved successfully
 */
router.get("/legal-exposure", Jwt.verifyToken, getLegalExposure);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/board-reporting-metrics:
 *   get:
 *     summary: Get board reporting metrics (paginated)
 *     description: Returns board reporting metrics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Board reporting metrics retrieved successfully
 */
router.get("/board-reporting-metrics", Jwt.verifyToken, getBoardReportingMetrics);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/workforce-analytics:
 *   get:
 *     summary: Get workforce analytics (paginated)
 *     description: Returns workforce analytics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workforce analytics retrieved successfully
 */
router.get("/workforce-analytics", Jwt.verifyToken, getWorkforceAnalytics);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/retention-rates:
 *   get:
 *     summary: Get retention rates analytics (paginated)
 *     description: Returns retention rates analytics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *       - in: query
 *         name: month
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retention rates analytics retrieved successfully
 */
router.get("/retention-rates", Jwt.verifyToken, getRetentionRates);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/compensation-benchmarks:
 *   get:
 *     summary: Get compensation benchmarks analytics (paginated)
 *     description: Returns compensation benchmarks analytics with filters and pagination.
 *     tags: [CEO Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *         description: Filter by department
 *       - in: query
 *         name: roleLevel
 *         schema: { type: string }
 *         description: Filter by role level
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *         description: Filter by region
 *       - in: query
 *         name: complianceGap
 *         schema: { type: string }
 *         description: Filter by compliance gap (High, Medium, Low)
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: Filter by year
 *       - in: query
 *         name: month
 *         schema: { type: string }
 *         description: Filter by month
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compensation benchmarks analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 filters:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       year:
 *                         type: integer
 *                       month:
 *                         type: string
 *                       department:
 *                         type: string
 *                       role_level:
 *                         type: string
 *                       region:
 *                         type: string
 *                       avg_salary:
 *                         type: integer
 *                       market_benchmark:
 *                         type: integer
 *                       percent_difference:
 *                         type: number
 *                       currency:
 *                         type: string
 *                       sample_size:
 *                         type: integer
 *                       compliance_gap:
 *                         type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/compensation-benchmarks", Jwt.verifyToken, getCompensationBenchmarks);

// --- KPI Endpoints ---
// ...existing imports...


// ...main analytics endpoints...

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/governance-compliance/kpis:
 *   get:
 *     summary: Get governance compliance KPIs
 *     description: Returns KPIs for governance compliance analytics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Governance compliance KPIs retrieved successfully
 */
router.get("/governance-compliance/kpis", Jwt.verifyToken, getGovernanceComplianceKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/legal-exposure/kpis:
 *   get:
 *     summary: Get legal exposure KPIs
 *     description: Returns KPIs for legal exposure analytics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Legal exposure KPIs retrieved successfully
 */
router.get("/legal-exposure/kpis", Jwt.verifyToken, getLegalExposureKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/board-reporting-metrics/kpis:
 *   get:
 *     summary: Get board reporting metrics KPIs
 *     description: Returns KPIs for board reporting metrics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Board reporting metrics KPIs retrieved successfully
 */
router.get("/board-reporting-metrics/kpis", Jwt.verifyToken, getBoardReportingKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/workforce-analytics/kpis:
 *   get:
 *     summary: Get workforce analytics KPIs
 *     description: Returns KPIs for workforce analytics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workforce analytics KPIs retrieved successfully
 */
router.get("/workforce-analytics/kpis", Jwt.verifyToken, getWorkforceKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/retention-rates/kpis:
 *   get:
 *     summary: Get retention rates KPIs
 *     description: Returns KPIs for retention rates analytics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retention rates KPIs retrieved successfully
 */
router.get("/retention-rates/kpis", Jwt.verifyToken, getRetentionKPIs);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/compensation-benchmarks/kpis:
 *   get:
 *     summary: Get compensation benchmarks KPIs
 *     description: Returns KPIs for compensation benchmarks analytics.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compensation benchmarks KPIs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalPositions:
 *                   type: integer
 *                 aboveBenchmark:
 *                   type: integer
 *                 belowBenchmark:
 *                   type: integer
 *                 highRiskGaps:
 *                   type: integer
 *                 avgDifference:
 *                   type: number
 *                 complianceRate:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get("/compensation-benchmarks/kpis", Jwt.verifyToken, getCompensationBenchmarksKPIs);

// --- Filter Dropdown Endpoints ---

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/compliance-areas:
 *   get:
 *     summary: Get all compliance areas for dropdown
 *     description: Returns all unique compliance areas for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compliance areas retrieved successfully
 */
router.get("/filters/compliance-areas", Jwt.verifyToken, getComplianceAreas);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/compliance-statuses:
 *   get:
 *     summary: Get all compliance statuses for dropdown
 *     description: Returns all unique compliance statuses for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compliance statuses retrieved successfully
 */
router.get("/filters/compliance-statuses", Jwt.verifyToken, getComplianceStatuses);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/case-types:
 *   get:
 *     summary: Get all case types for dropdown
 *     description: Returns all unique case types for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case types retrieved successfully
 */
router.get("/filters/case-types", Jwt.verifyToken, getCaseTypes);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/risk-levels:
 *   get:
 *     summary: Get all risk levels for dropdown
 *     description: Returns all unique risk levels for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Risk levels retrieved successfully
 */
router.get("/filters/risk-levels", Jwt.verifyToken, getRiskLevels);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/legal-statuses:
 *   get:
 *     summary: Get all legal statuses for dropdown
 *     description: Returns all unique legal statuses for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Legal statuses retrieved successfully
 */
router.get("/filters/legal-statuses", Jwt.verifyToken, getLegalStatuses);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/departments:
 *   get:
 *     summary: Get all departments for dropdown
 *     description: Returns all unique departments for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 */
router.get("/filters/departments", Jwt.verifyToken, getDepartments);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/years:
 *   get:
 *     summary: Get all years for dropdown
 *     description: Returns all unique years for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Years retrieved successfully
 */
router.get("/filters/years", Jwt.verifyToken, getYears);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/months:
 *   get:
 *     summary: Get all months for dropdown
 *     description: Returns all unique months for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Months retrieved successfully
 */
router.get("/filters/months", Jwt.verifyToken, getMonths);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/compensation-departments:
 *   get:
 *     summary: Get all departments for compensation filtering
 *     description: Returns all unique departments for compensation benchmarks filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compensation departments retrieved successfully
 */
router.get("/filters/compensation-departments", Jwt.verifyToken, getCompensationDepartments);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/role-levels:
 *   get:
 *     summary: Get all role levels for filtering
 *     description: Returns all unique role levels for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role levels retrieved successfully
 */
router.get("/filters/role-levels", Jwt.verifyToken, getRoleLevels);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/regions:
 *   get:
 *     summary: Get all regions for filtering
 *     description: Returns all unique regions for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regions retrieved successfully
 */
router.get("/filters/regions", Jwt.verifyToken, getRegions);

/**
 * @swagger
 * /api/v1/executive/CEOAnalytics/filters/compliance-gaps:
 *   get:
 *     summary: Get all compliance gaps for filtering
 *     description: Returns all unique compliance gaps for filtering.
 *     tags: [CEO Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compliance gaps retrieved successfully
 */
router.get("/filters/compliance-gaps", Jwt.verifyToken, getComplianceGaps);


export default router;