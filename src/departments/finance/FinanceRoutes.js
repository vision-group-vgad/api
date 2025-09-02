// finance/FinanceRoutes.js
// Routes for Financial data endpoints

import express from "express";
import {
  getFinancialCloseMetrics,
  getAuditTrailAnalysis,
  getReportingAccuracy,
  getFinancialData,
  getFinancialChartData,
  getGLAccountNames,
  getDocumentTypes,
  getDiagnosticInfo,
  getRegionalPnL,
  getRegions,
} from "./FinanceController.js";
import Jwt from "../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/finance/close-metrics:
 *   get:
 *     summary: Get Enhanced Financial Close Metrics
 *     description: Returns financial close metrics with configurable granularity (daily, weekly, monthly, quarterly, yearly) and comprehensive filtering options.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: "2021-08-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: "2021-08-31"
 *       - in: query
 *         name: accountNo
 *         schema:
 *           type: string
 *         description: G/L Account Number to filter by
 *         example: "10060"
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *         description: Document type to filter by
 *         example: "Payment"
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly, quarterly, yearly]
 *           default: monthly
 *         description: Time period granularity for grouping metrics
 *         example: "monthly"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Enhanced financial close metrics retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - period: "2021-08"
 *                   granularity: "monthly"
 *                   totalAmount: 4500000.50
 *                   totalDebits: 2300000.25
 *                   totalCredits: 2200000.25
 *                   transactionCount: 1250
 *                   averageAmount: 3600.40
 *                   maxAmount: 50000.00
 *                   minAmount: 10.50
 *                   balanceAccuracy: 98.91
 *                   closeStatus: "Closed"
 *                   uniqueAccounts: 45
 *                   documentTypesCount: 3
 *                   documentTypes: ["Payment", "Invoice", "Receipt"]
 *                   debitCreditRatio: 1.05
 *                   periodStart: "2021-08-01"
 *                   periodEnd: "2021-08-31"
 *               summary:
 *                 totalPeriods: 1
 *                 granularity: "monthly"
 *                 dateRange: "2021-08-01 to 2021-08-31"
 *               filters:
 *                 startDate: "2021-08-01"
 *                 endDate: "2021-08-31"
 *                 granularity: "monthly"
 *                 limit: 1000
 */
router.get("/close-metrics", Jwt.verifyToken, getFinancialCloseMetrics);

/**
 * @swagger
 * /api/v1/finance/audit-trail:
 *   get:
 *     summary: Get Audit Trail Analysis
 *     description: Returns comprehensive audit trail analysis including transaction patterns, anomalies, and document type distribution.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *         description: Filter by document type
 *         example: "Payment"
 *       - in: query
 *         name: accountNo
 *         schema:
 *           type: string
 *         description: G/L Account Number to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Maximum number of records to analyze
 *     responses:
 *       200:
 *         description: Audit trail analysis completed successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 transactionFrequency:
 *                   - date: "2021-08-01"
 *                     transactionCount: 45
 *                 documentTypeDistribution:
 *                   - documentType: "Payment"
 *                     count: 450
 *                     percentage: 36
 */
router.get("/audit-trail", Jwt.verifyToken, getAuditTrailAnalysis);

/**
 * @swagger
 * /api/v1/finance/reporting-accuracy:
 *   get:
 *     summary: Get Reporting Accuracy Metrics
 *     description: Returns data quality and accuracy metrics for financial reporting validation.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: accountNo
 *         schema:
 *           type: string
 *         description: G/L Account Number to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10000
 *         description: Maximum number of records to analyze
 *     responses:
 *       200:
 *         description: Reporting accuracy metrics calculated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalEntries: 1250
 *                 balancedEntries: 1235
 *                 unbalancedEntries: 15
 *                 accuracyPercentage: 98.8
 *                 errorsByType:
 *                   - errorType: "Unbalanced Entry"
 *                     count: 10
 */
router.get("/reporting-accuracy", Jwt.verifyToken, getReportingAccuracy);

/**
 * @swagger
 * /api/v1/finance/raw-data:
 *   get:
 *     summary: Get Raw Financial Data
 *     description: Returns filtered raw financial transaction data from Business Central with complete attribute mapping.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: "2021-08-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: "2021-08-31"
 *       - in: query
 *         name: accountNo
 *         schema:
 *           type: string
 *         description: G/L Account Number to filter by (use /gl-accounts endpoint for available options)
 *         example: "10060"
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *         description: Filter by document type (use /document-types endpoint for available options)
 *         example: "Payment"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Raw financial data retrieved successfully
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
 *                       id:
 *                         type: integer
 *                         description: CMC entry ID
 *                         example: 39027
 *                       entryNo:
 *                         type: string
 *                         description: Entry number
 *                         example: "19511"
 *                       transactionNo:
 *                         type: string
 *                         description: Transaction number
 *                         example: "2223"
 *                       accountNo:
 *                         type: string
 *                         description: G/L Account number
 *                         example: "10060"
 *                       accountName:
 *                         type: string
 *                         description: G/L Account name
 *                         example: "Mbarara Cash Control"
 *                       postingDate:
 *                         type: string
 *                         format: date
 *                         description: Posting date
 *                         example: "2021-08-10"
 *                       documentDate:
 *                         type: string
 *                         format: date
 *                         description: Document date
 *                         example: "2021-08-10"
 *                       documentType:
 *                         type: string
 *                         description: Document type
 *                         example: "Payment"
 *                       documentNo:
 *                         type: string
 *                         description: Document number
 *                         example: "B-SK000020RN"
 *                       sourceCode:
 *                         type: string
 *                         description: Source code
 *                         example: "CASHRECJNL"
 *                       amount:
 *                         type: string
 *                         description: Transaction amount
 *                         example: "19000"
 *                       debitAmount:
 *                         type: string
 *                         description: Debit amount
 *                         example: "19000"
 *                       creditAmount:
 *                         type: string
 *                         description: Credit amount
 *                         example: "0"
 *                       vatAmount:
 *                         type: string
 *                         description: VAT amount
 *                         example: "0"
 *                       additionalCurrencyAmount:
 *                         type: string
 *                         description: Additional currency amount
 *                         example: "0"
 *                       genPostingType:
 *                         type: string
 *                         description: General posting type
 *                         example: null
 *                       taxLiable:
 *                         type: boolean
 *                         description: Tax liable flag
 *                         example: false
 *                       dimensionSetId:
 *                         type: string
 *                         description: Dimension set ID
 *                         example: "1736"
 *                 totalRecords:
 *                   type: integer
 *                   description: Total number of records returned
 *                   example: 20000
 *                 filters:
 *                   type: object
 *                   description: Applied filters
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.get("/raw-data", Jwt.verifyToken, getFinancialData);

/**
 * @swagger
 * /api/v1/finance/chart-data:
 *   get:
 *     summary: Get Chart-Ready Financial Data
 *     description: Returns financial data formatted for line charts, bar charts, and pie charts.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: query
 *         name: chartType
 *         schema:
 *           type: string
 *           enum: [line, bar, pie]
 *           default: line
 *         description: Type of chart to format data for
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           enum: [closeMetrics, auditTrail, accuracy]
 *           default: closeMetrics
 *         description: Which metric to format for charts
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: accountNo
 *         schema:
 *           type: string
 *         description: G/L Account Number to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 1000
 *         description: Maximum number of records to process
 *     responses:
 *       200:
 *         description: Chart data formatted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 labels: ["2021-08", "2021-09", "2021-10"]
 *                 datasets:
 *                   - label: "Total Amount"
 *                     data: [4500000, 4200000, 4800000]
 *                     borderColor: "rgb(75, 192, 192)"
 *               chartType: "line"
 *               metric: "closeMetrics"
 */
router.get("/chart-data", Jwt.verifyToken, getFinancialChartData);

/**
 * @swagger
 * /api/v1/finance/gl-accounts:
 *   get:
 *     summary: Get G/L Account Names for Dropdown Filters
 *     description: Returns a list of unique G/L account numbers and names from the CMC system for use in dropdown filters.
 *     tags:
 *       - Finance
 *     responses:
 *       200:
 *         description: Successfully retrieved G/L account names
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
 *                       accountNo:
 *                         type: string
 *                         description: G/L Account Number
 *                         example: "10060"
 *                       accountName:
 *                         type: string
 *                         description: G/L Account Name
 *                         example: "Mbarara Cash Control"
 *                       displayName:
 *                         type: string
 *                         description: Combined display name for dropdown
 *                         example: "10060 - Mbarara Cash Control"
 *                 totalAccounts:
 *                   type: integer
 *                   description: Total number of unique accounts
 *                   example: 156
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.get("/gl-accounts", Jwt.verifyToken, getGLAccountNames);

/**
 * @swagger
 * /api/v1/finance/document-types:
 *   get:
 *     summary: Get Document Types for Dropdown Filters
 *     description: Returns a list of unique document types from the CMC system for use in dropdown filters.
 *     tags:
 *       - Finance
 *     responses:
 *       200:
 *         description: Successfully retrieved document types
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
 *                       value:
 *                         type: string
 *                         description: Document type value
 *                         example: "Invoice"
 *                       label:
 *                         type: string
 *                         description: Document type label
 *                         example: "Invoice"
 *                       displayName:
 *                         type: string
 *                         description: Display name for dropdown
 *                         example: "Invoice"
 *                 totalTypes:
 *                   type: integer
 *                   description: Total number of unique document types
 *                   example: 8
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
router.get("/document-types", Jwt.verifyToken, getDocumentTypes);

/**
 * @swagger
 * /api/v1/finance/regional-pnl:
 *   get:
 *     summary: Get Regional P&L Analysis
 *     description: Returns P&L analysis by region using dimension mapping with comprehensive metrics
 *     tags: [Finance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         description: End date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *         description: Specific region filter
 *       - in: query
 *         name: dimensionSetId
 *         schema: { type: string }
 *         description: Dimension Set ID filter
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10000 }
 *         description: Maximum number of records to process
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regional P&L analysis retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       region:
 *                         type: string
 *                       totalRevenue:
 *                         type: number
 *                       grossProfit:
 *                         type: number
 *                       netProfit:
 *                         type: number
 *                       netMargin:
 *                         type: number
 *                       regionRank:
 *                         type: integer
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalRegions:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     profitableRegions:
 *                       type: integer
 */
router.get('/regional-pnl', Jwt.verifyToken, getRegionalPnL);

/**
 * @swagger
 * /api/v1/finance/regions:
 *   get:
 *     summary: Get available regions for filtering
 *     description: Returns all available regions mapped from dimension data for dropdown filters
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Regions retrieved successfully
 */
router.get('/regions', Jwt.verifyToken, getRegions);



/**
 * @swagger
 * /api/v1/finance/diagnostics:
 *   get:
 *     summary: Get Environment Diagnostic Information
 *     description: Returns diagnostic information about the environment configuration for troubleshooting API connectivity issues.
 *     tags:
 *       - Finance
 *     responses:
 *       200:
 *         description: Diagnostic information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 diagnostics:
 *                   type: object
 *                   properties:
 *                     hasApiUrl:
 *                       type: boolean
 *                     hasApiToken:
 *                       type: boolean
 *                     apiUrlValue:
 *                       type: string
 *                     tokenLength:
 *                       type: number
 *                     nodeEnv:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Server error
 */
router.get("/diagnostics", Jwt.verifyToken, getDiagnosticInfo);

export default router;
