import express from "express";
import {
  getResourceKPIs,
  getResourceChartData,
  getResourceList,
  getResourceUtilizationAnalytics,
  getSpaceKPIs,
  getSpaceChartData,
  getSpaceList,
  getSpaceOptimizationAnalytics,
  getVendorKPIs,
  getVendorChartData,
  getVendorList,
  getVendorPerformanceAnalytics,
  getRVSOverview,
  getDepartments,
  getResourceTypes,
  getLocations,
  getServiceTypes,
  getVendorNames
} from "./rvsAnalyticsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/overview:
 *   get:
 *     summary: Get complete RVS analytics overview
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Combined RVS analytics overview
 */
router.get("/overview", getRVSOverview);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/analytics:
 *   get:
 *     summary: Get resource utilization analytics (KPIs + Charts)
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resource utilization analytics
 */
router.get("/resources/analytics", getResourceUtilizationAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/kpis:
 *   get:
 *     summary: Get resource utilization KPIs
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resource KPIs
 */
router.get("/resources/kpis", getResourceKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/chart:
 *   get:
 *     summary: Get resource chart data
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chart data for resources
 */
router.get("/resources/chart", getResourceChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/list:
 *   get:
 *     summary: Get paginated list of resources
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated resource list
 */
router.get("/resources/list", getResourceList);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/analytics:
 *   get:
 *     summary: Get space optimization analytics (KPIs + Charts)
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Space optimization analytics
 */
router.get("/spaces/analytics", getSpaceOptimizationAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/kpis:
 *   get:
 *     summary: Get space optimization KPIs
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Space KPIs
 */
router.get("/spaces/kpis", getSpaceKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/chart:
 *   get:
 *     summary: Get space chart data
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chart data for spaces
 */
router.get("/spaces/chart", getSpaceChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/list:
 *   get:
 *     summary: Get paginated list of spaces
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated space list
 */
router.get("/spaces/list", getSpaceList);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/analytics:
 *   get:
 *     summary: Get vendor performance analytics (KPIs + Charts)
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor performance analytics
 */
router.get("/vendors/analytics", getVendorPerformanceAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/kpis:
 *   get:
 *     summary: Get vendor performance KPIs
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor KPIs
 */
router.get("/vendors/kpis", getVendorKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/chart:
 *   get:
 *     summary: Get vendor chart data
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chart data for vendors
 */
router.get("/vendors/chart", getVendorChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/list:
 *   get:
 *     summary: Get paginated list of vendors
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated vendor list
 */
router.get("/vendors/list", getVendorList);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/departments:
 *   get:
 *     summary: Get list of departments for filters
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get("/filters/departments", getDepartments);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/resource-types:
 *   get:
 *     summary: Get list of resource types for filters
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resource types
 */
router.get("/filters/resource-types", getResourceTypes);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/locations:
 *   get:
 *     summary: Get list of locations for filters
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations
 */
router.get("/filters/locations", getLocations);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/service-types:
 *   get:
 *     summary: Get list of service types for filters
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service types
 */
router.get("/filters/service-types", getServiceTypes);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/vendor-names:
 *   get:
 *     summary: Get list of vendor names for filters
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor names
 */
router.get("/filters/vendor-names", getVendorNames);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/test:
 *   get:
 *     summary: Test endpoint to verify RVS Analytics is working
 *     tags: [RVS Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test response
 */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "RVS Analytics routes working",
    timestamp: new Date().toISOString()
  });
});

export default router;