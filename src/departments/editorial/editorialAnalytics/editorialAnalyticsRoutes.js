import express from "express";
import {
  getEditorialSessionAnalytics,
  getEditorialKPIs,
  getEditorialChartData,
  getCrossPlatformEngagement,
  getContentROI,
  getAudienceDemographics,
  getPersonalBylinePerformance,
  getSourceEffectiveness,
  getSocialAmplification,
  getAudienceRetention,
  getPlatforms,
  getStreams,
  getSessionMediums,
  getAuthors,
  getEditors,
  getCategories,
} from "./editorialAnalyticsController.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/editorial/analytics/session-duration:
 *   get:
 *     summary: Get Editorial Session Analytics (joined)
 *     description: Returns editorial session analytics with all filters and pagination.
 *     tags: [Editorial Analytics]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: platform
 *         schema: { type: string }
 *       - in: query
 *         name: streamName
 *         schema: { type: string }
 *       - in: query
 *         name: sessionMedium
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: editor
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Editorial session analytics retrieved successfully
 */
router.get(
  "/analytics/session-duration",
  Jwt.verifyToken,
  getEditorialSessionAnalytics
);

/**
 * @swagger
 * /api/v1/editorial/analytics/kpis:
 *   get:
 *     summary: Get Editorial KPIs Summary (joined)
 *     description: Returns summary KPIs for all editorial analytics. Supports all filters including byline, editor, category.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: platform
 *         schema: { type: string }
 *       - in: query
 *         name: streamName
 *         schema: { type: string }
 *       - in: query
 *         name: sessionMedium
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: editor
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Editorial KPIs retrieved successfully
 */
router.get("/analytics/kpis", Jwt.verifyToken, getEditorialKPIs);

/**
 * @swagger
 * /api/v1/editorial/analytics/chart-data:
 *   get:
 *     summary: Get Editorial Analytics Chart Data (joined)
 *     description: Returns chart-ready data for editorial analytics (bar/line/pie). Supports grouping/filtering by platform, author, editor, category, etc.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: chartType
 *         schema: { type: string, enum: [line, bar, pie], default: bar }
 *       - in: query
 *         name: metric
 *         schema: { type: string, default: averageDuration }
 *       - in: query
 *         name: groupBy
 *         schema: { type: string, default: platform }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: platform
 *         schema: { type: string }
 *       - in: query
 *         name: streamName
 *         schema: { type: string }
 *       - in: query
 *         name: sessionMedium
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: editor
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chart data formatted successfully
 */
router.get("/analytics/chart-data", Jwt.verifyToken, getEditorialChartData);

// ----- Feature-Specific Endpoints -----

/**
 * @swagger
 * /api/v1/editorial/analytics/cross-platform-engagement:
 *   get:
 *     summary: Cross-platform engagement analytics
 *     description: Returns engagement (average duration) grouped by platform.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for cross-platform engagement
 */
router.get(
  "/analytics/cross-platform-engagement",
  Jwt.verifyToken,
  getCrossPlatformEngagement
);

/**
 * @swagger
 * /api/v1/editorial/analytics/content-roi:
 *   get:
 *     summary: Content ROI analytics
 *     description: Returns ROI (average duration) grouped by article.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for content ROI
 */
router.get("/analytics/content-roi", Jwt.verifyToken, getContentROI);

/**
 * @swagger
 * /api/v1/editorial/analytics/audience-demographics:
 *   get:
 *     summary: Audience demographics analytics
 *     description: Returns audience engagement grouped by session medium.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for audience demographics
 */
router.get(
  "/analytics/audience-demographics",
  Jwt.verifyToken,
  getAudienceDemographics
);

/**
 * @swagger
 * /api/v1/editorial/analytics/personal-byline-performance:
 *   get:
 *     summary: Personal byline performance analytics
 *     description: Returns engagement grouped by author.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for personal byline performance
 */
router.get(
  "/analytics/personal-byline-performance",
  Jwt.verifyToken,
  getPersonalBylinePerformance
);

/**
 * @swagger
 * /api/v1/editorial/analytics/source-effectiveness:
 *   get:
 *     summary: Source effectiveness analytics
 *     description: Returns engagement grouped by referrer.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for source effectiveness
 */
router.get(
  "/analytics/source-effectiveness",
  Jwt.verifyToken,
  getSourceEffectiveness
);

/**
 * @swagger
 * /api/v1/editorial/analytics/social-amplification:
 *   get:
 *     summary: Social amplification analytics
 *     description: Returns engagement for articles from social sources.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for social amplification
 */
router.get(
  "/analytics/social-amplification",
  Jwt.verifyToken,
  getSocialAmplification
);

/**
 * @swagger
 * /api/v1/editorial/analytics/audience-retention:
 *   get:
 *     summary: Audience retention analytics
 *     description: Returns retention (bounce rate) grouped by article.
 *     tags: [Editorial Analytics]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Chart data for audience retention
 */
router.get(
  "/analytics/audience-retention",
  Jwt.verifyToken,
  getAudienceRetention
);

/**
 * @swagger
 * /api/v1/editorial/analytics/platforms:
 *   get:
 *     summary: Get available platforms for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of platforms
 */
router.get("/analytics/platforms", Jwt.verifyToken, getPlatforms);

/**
 * @swagger
 * /api/v1/editorial/analytics/streams:
 *   get:
 *     summary: Get available streams for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of streams
 */
router.get("/analytics/streams", Jwt.verifyToken, getStreams);

/**
 * @swagger
 * /api/v1/editorial/analytics/session-mediums:
 *   get:
 *     summary: Get available session mediums for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of session mediums
 */
router.get("/analytics/session-mediums", Jwt.verifyToken, getSessionMediums);

/**
 * @swagger
 * /api/v1/editorial/analytics/authors:
 *   get:
 *     summary: Get available authors for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of authors
 */
router.get("/analytics/authors", Jwt.verifyToken, getAuthors);

/**
 * @swagger
 * /api/v1/editorial/analytics/editors:
 *   get:
 *     summary: Get available editors for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of editors
 */
router.get("/analytics/editors", Jwt.verifyToken, getEditors);

/**
 * @swagger
 * /api/v1/editorial/analytics/categories:
 *   get:
 *     summary: Get available categories for filtering
 *     tags: [Editorial Analytics]
 *     responses:
 *       200:
 *         description: Array of categories
 */
router.get("/analytics/categories", Jwt.verifyToken, getCategories);

export default router;
