import express from "express";
import Jwt from "../../../auth/jwt.js";
import {
  getCaseResolution,
  getComplianceBreach,
  getCaseResolutionKPIs,
  getComplianceBreachKPIs,
  getCaseTypes,
  getCaseDepartments,
  getCasePriorities,
  getCaseStatuses,
  getBreachTypes,
  getBreachDepartments,
  getSeverityLevels,
  getYears
} from "./CaseComplianceController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/cases:
 *   get:
 *     summary: Get case resolution analytics (paginated)
 *     description: Returns case resolution analytics with filters and pagination for media operations.
 *     tags: [Specialized Analytics]
 *     parameters:
 *       - in: query
 *         name: case_type
 *         schema: { type: string }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: priority
 *         schema: { type: string }
 *       - in: query
 *         name: status
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
 *         description: Case resolution analytics retrieved successfully
 */
router.get("/cases", Jwt.verifyToken, getCaseResolution);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/compliance-breaches:
 *   get:
 *     summary: Get compliance breach tracking (paginated)
 *     description: Returns compliance breach tracking with filters and pagination for media operations.
 *     tags: [Specialized Analytics]
 *     parameters:
 *       - in: query
 *         name: breach_type
 *         schema: { type: string }
 *       - in: query
 *         name: department
 *         schema: { type: string }
 *       - in: query
 *         name: severity
 *         schema: { type: string }
 *       - in: query
 *         name: resolved
 *         schema: { type: boolean }
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
 *         description: Compliance breach tracking retrieved successfully
 */
router.get("/compliance-breaches", Jwt.verifyToken, getComplianceBreach);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/cases/kpis:
 *   get:
 *     summary: Get case resolution KPIs
 *     description: Returns KPIs for case resolution analytics.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case resolution KPIs retrieved successfully
 */
router.get("/cases/kpis", Jwt.verifyToken, getCaseResolutionKPIs);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/compliance-breaches/kpis:
 *   get:
 *     summary: Get compliance breach KPIs
 *     description: Returns KPIs for compliance breach tracking.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compliance breach KPIs retrieved successfully
 */
router.get("/compliance-breaches/kpis", Jwt.verifyToken, getComplianceBreachKPIs);

// --- Filter Endpoints ---

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/case-types:
 *   get:
 *     summary: Get all case types for dropdown
 *     description: Returns all unique case types for filtering case resolution data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case types retrieved successfully
 */
router.get("/filters/case-types", Jwt.verifyToken, getCaseTypes);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/case-departments:
 *   get:
 *     summary: Get all departments for case filtering
 *     description: Returns all unique departments for filtering case resolution data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case departments retrieved successfully
 */
router.get("/filters/case-departments", Jwt.verifyToken, getCaseDepartments);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/case-priorities:
 *   get:
 *     summary: Get all case priorities for dropdown
 *     description: Returns all unique case priorities for filtering case resolution data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case priorities retrieved successfully
 */
router.get("/filters/case-priorities", Jwt.verifyToken, getCasePriorities);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/case-statuses:
 *   get:
 *     summary: Get all case statuses for dropdown
 *     description: Returns all unique case statuses for filtering case resolution data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Case statuses retrieved successfully
 */
router.get("/filters/case-statuses", Jwt.verifyToken, getCaseStatuses);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/breach-types:
 *   get:
 *     summary: Get all breach types for dropdown
 *     description: Returns all unique breach types for filtering compliance breach data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breach types retrieved successfully
 */
router.get("/filters/breach-types", Jwt.verifyToken, getBreachTypes);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/breach-departments:
 *   get:
 *     summary: Get all departments for breach filtering
 *     description: Returns all unique departments for filtering compliance breach data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breach departments retrieved successfully
 */
router.get("/filters/breach-departments", Jwt.verifyToken, getBreachDepartments);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/severity-levels:
 *   get:
 *     summary: Get all severity levels for dropdown
 *     description: Returns all unique severity levels for filtering compliance breach data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Severity levels retrieved successfully
 */
router.get("/filters/severity-levels", Jwt.verifyToken, getSeverityLevels);

/**
 * @swagger
 * /api/v1/specialized/CaseCompliance/filters/years:
 *   get:
 *     summary: Get all years for dropdown
 *     description: Returns all unique years for filtering case and breach data.
 *     tags: [Specialized Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Years retrieved successfully
 */
router.get("/filters/years", Jwt.verifyToken, getYears);

export default router;