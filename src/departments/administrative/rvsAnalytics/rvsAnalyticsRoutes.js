import express from "express";
import {
  // Resource Utilization Controllers
  getResourceKPIs,
  getResourceChartData,
  getResourceList,
  getResourceUtilizationAnalytics,
  
  // Space Optimization Controllers
  getSpaceKPIs,
  getSpaceChartData,
  getSpaceList,
  getSpaceOptimizationAnalytics,
  
  // Vendor Performance Controllers
  getVendorKPIs,
  getVendorChartData,
  getVendorList,
  getVendorPerformanceAnalytics,
  
  // Combined Analytics Controllers
  getRVSOverview,
  
  // Dropdown Filter Controllers
  getDepartments,
  getResourceTypes,
  getLocations,
  getServiceTypes,
  getVendorNames
} from "./rvsAnalyticsController.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: RVS Analytics - Overview
 *     description: Combined analytics and overview endpoints
 *   - name: RVS Analytics - Resources
 *     description: Resource utilization analytics
 *   - name: RVS Analytics - Spaces
 *     description: Space optimization analytics
 *   - name: RVS Analytics - Vendors
 *     description: Vendor performance analytics
 *   - name: RVS Analytics - Filters
 *     description: Dropdown filter endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         resource_id:
 *           type: string
 *           example: "RES001"
 *         resource_name:
 *           type: string
 *           example: "Dell Latitude 5520"
 *         resource_type:
 *           type: string
 *           example: "Laptop"
 *         department:
 *           type: string
 *           example: "Editorial"
 *         status:
 *           type: string
 *           example: "Active"
 *         hours_used:
 *           type: number
 *           example: 168
 *         capacity_hours:
 *           type: number
 *           example: 240
 *         utilization_rate:
 *           type: number
 *           example: 70
 *         last_maintenance_date:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         maintenance_cost:
 *           type: number
 *           example: 150
 *         downtime_hours:
 *           type: number
 *           example: 2
 *         power_usage:
 *           type: number
 *           example: 65
 *         energy_cost:
 *           type: number
 *           example: 25.50
 *         cost_center:
 *           type: string
 *           example: "IT Equipment"
 *         monthly_cost:
 *           type: number
 *           example: 300
 *     
 *     Space:
 *       type: object
 *       properties:
 *         space_id:
 *           type: string
 *           example: "SP001"
 *         location:
 *           type: string
 *           example: "HQ Floor 1"
 *         total_area:
 *           type: number
 *           example: 1000
 *         allocated_area:
 *           type: number
 *           example: 800
 *         vacant_area:
 *           type: number
 *           example: 200
 *         capacity:
 *           type: number
 *           example: 50
 *         current_usage:
 *           type: number
 *           example: 42
 *         occupancy_rate:
 *           type: number
 *           example: 84
 *         department_id:
 *           type: string
 *           example: "Editorial"
 *         rent_cost:
 *           type: number
 *           example: 25000
 *         utilities_cost:
 *           type: number
 *           example: 5000
 *         cost_per_sqm:
 *           type: number
 *           example: 30
 *         bookings_count:
 *           type: number
 *           example: 25
 *         avg_usage_hours:
 *           type: number
 *           example: 4
 *         idle_hours:
 *           type: number
 *           example: 60
 *     
 *     Vendor:
 *       type: object
 *       properties:
 *         vendor_id:
 *           type: string
 *           example: "VEN001"
 *         vendor_name:
 *           type: string
 *           example: "AFP News Agency"
 *         service_type:
 *           type: string
 *           example: "News Feed"
 *         contract_terms:
 *           type: string
 *           example: "Annual renewable"
 *         expected_delivery_date:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         actual_delivery_date:
 *           type: string
 *           format: date
 *           example: "2025-01-15"
 *         delay_days:
 *           type: number
 *           example: 0
 *         complaints_count:
 *           type: number
 *           example: 1
 *         service_quality_score:
 *           type: number
 *           example: 9.2
 *         regulatory_compliance:
 *           type: number
 *           example: 100
 *         contract_compliance:
 *           type: number
 *           example: 98
 *         budgeted_cost:
 *           type: number
 *           example: 50000
 *         actual_cost:
 *           type: number
 *           example: 48500
 *         variance:
 *           type: number
 *           example: -1500
 *         invoice_date:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *         payment_date:
 *           type: string
 *           format: date
 *           example: "2025-01-30"
 *         days_to_pay:
 *           type: number
 *           example: 29
 *         contract_start:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         contract_end:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *     
 *     ResourceKPIs:
 *       type: object
 *       properties:
 *         totalResources:
 *           type: integer
 *           example: 5
 *         activeResources:
 *           type: integer
 *           example: 4
 *         inactiveResources:
 *           type: integer
 *           example: 1
 *         avgUtilizationRate:
 *           type: number
 *           example: 73.4
 *         totalDowntimeHours:
 *           type: number
 *           example: 15
 *         totalMaintenanceCost:
 *           type: number
 *           example: 2080
 *         totalMonthlyCost:
 *           type: number
 *           example: 4485
 *         avgEnergyConsumption:
 *           type: number
 *           example: 100.6
 *         resourceTypes:
 *           type: integer
 *           example: 5
 *         departments:
 *           type: integer
 *           example: 4
 *     
 *     SpaceKPIs:
 *       type: object
 *       properties:
 *         totalSpaces:
 *           type: integer
 *           example: 4
 *         totalArea:
 *           type: number
 *           example: 2350
 *         allocatedArea:
 *           type: number
 *           example: 1800
 *         vacantArea:
 *           type: number
 *           example: 550
 *         spaceUtilizationRate:
 *           type: number
 *           example: 76.6
 *         avgOccupancyRate:
 *           type: number
 *           example: 74.3
 *         totalRentCost:
 *           type: number
 *           example: 53000
 *         totalUtilitiesCost:
 *           type: number
 *           example: 10000
 *         totalSpaceCost:
 *           type: number
 *           example: 63000
 *         avgCostPerSqm:
 *           type: number
 *           example: 22.9
 *         departments:
 *           type: integer
 *           example: 4
 *     
 *     VendorKPIs:
 *       type: object
 *       properties:
 *         totalVendors:
 *           type: integer
 *           example: 4
 *         activeVendors:
 *           type: integer
 *           example: 4
 *         onTimeDeliveryRate:
 *           type: number
 *           example: 75
 *         avgServiceQuality:
 *           type: number
 *           example: 8.4
 *         totalBudgetedCost:
 *           type: number
 *           example: 78000
 *         totalActualCost:
 *           type: number
 *           example: 78000
 *         totalVariance:
 *           type: number
 *           example: 0
 *         costVariancePercentage:
 *           type: number
 *           example: 0
 *         avgPaymentDays:
 *           type: number
 *           example: 33.25
 *         totalComplaints:
 *           type: integer
 *           example: 4
 *         avgComplianceRate:
 *           type: number
 *           example: 97.5
 *         serviceTypes:
 *           type: integer
 *           example: 4
 *     
 *     ChartDataItem:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           example: "Editorial"
 *         value:
 *           type: number
 *           example: 75.5
 *         count:
 *           type: integer
 *           example: 3
 *     
 *     ResourceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         resources:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Resource'
 *         totalCount:
 *           type: integer
 *           example: 5
 *     
 *     SpaceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         spaces:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Space'
 *         totalCount:
 *           type: integer
 *           example: 4
 *     
 *     VendorListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         vendors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vendor'
 *         totalCount:
 *           type: integer
 *           example: 4
 *     
 *     ResourceKPIResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/ResourceKPIs'
 *     
 *     SpaceKPIResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/SpaceKPIs'
 *     
 *     VendorKPIResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/VendorKPIs'
 *     
 *     ChartDataResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChartDataItem'
 *     
 *     FilterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Editorial", "Administration", "IT", "Operations"]
 *     
 *     OverviewResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             resources:
 *               $ref: '#/components/schemas/ResourceKPIs'
 *             spaces:
 *               $ref: '#/components/schemas/SpaceKPIs'
 *             vendors:
 *               $ref: '#/components/schemas/VendorKPIs'
 *             summary:
 *               type: object
 *               properties:
 *                 totalResources:
 *                   type: integer
 *                   example: 5
 *                 totalSpaces:
 *                   type: integer
 *                   example: 4
 *                 totalVendors:
 *                   type: integer
 *                   example: 4
 *                 avgResourceUtilization:
 *                   type: number
 *                   example: 73.4
 *                 avgSpaceOccupancy:
 *                   type: number
 *                   example: 74.3
 *                 avgVendorPerformance:
 *                   type: number
 *                   example: 8.4
 *                 totalMonthlyCost:
 *                   type: number
 *                   example: 141485
 *     
 *     ResourceAnalyticsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             kpis:
 *               $ref: '#/components/schemas/ResourceKPIs'
 *             chartData:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChartDataItem'
 *             metric:
 *               type: string
 *               example: "utilization_rate"
 *             groupBy:
 *               type: string
 *               example: "department"
 *     
 *     SpaceAnalyticsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             kpis:
 *               $ref: '#/components/schemas/SpaceKPIs'
 *             chartData:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChartDataItem'
 *             metric:
 *               type: string
 *               example: "occupancy_rate"
 *             groupBy:
 *               type: string
 *               example: "department_id"
 *     
 *     VendorAnalyticsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             kpis:
 *               $ref: '#/components/schemas/VendorKPIs'
 *             chartData:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChartDataItem'
 *             metric:
 *               type: string
 *               example: "service_quality_score"
 *             groupBy:
 *               type: string
 *               example: "service_type"
 */

// ======================
// OVERVIEW ENDPOINTS
// ======================

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/overview:
 *   get:
 *     summary: Get complete RVS analytics overview
 *     description: Returns combined KPIs for resources, spaces, and vendors with summary metrics.
 *     tags: [RVS Analytics - Overview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: Combined RVS analytics overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OverviewResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 *       500:
 *         description: Server error
 */
router.get("/overview", Jwt.verifyToken, getRVSOverview);

// ======================
// RESOURCE UTILIZATION ENDPOINTS
// ======================

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/analytics:
 *   get:
 *     summary: Get resource utilization analytics (KPIs + Charts)
 *     description: Returns resource utilization KPIs and chart data with filtering options.
 *     tags: [RVS Analytics - Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *         description: Filter by resource type
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           default: utilization_rate
 *           enum: [utilization_rate, monthly_cost, downtime_hours, power_usage]
 *         description: Metric for chart data
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           default: department
 *           enum: [department, resource_type, status]
 *         description: Group chart data by field
 *     responses:
 *       200:
 *         description: Resource utilization analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceAnalyticsResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/resources/analytics", Jwt.verifyToken, getResourceUtilizationAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/kpis:
 *   get:
 *     summary: Get resource utilization KPIs
 *     description: Returns key performance indicators for resource utilization.
 *     tags: [RVS Analytics - Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resource KPIs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceKPIResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/resources/kpis", Jwt.verifyToken, getResourceKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/chart:
 *   get:
 *     summary: Get resource chart data
 *     description: Returns chart-ready data for resource metrics.
 *     tags: [RVS Analytics - Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [utilization_rate, monthly_cost, downtime_hours, power_usage]
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [department, resource_type, status]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Chart data for resources
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartDataResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/resources/chart", Jwt.verifyToken, getResourceChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/resources/list:
 *   get:
 *     summary: Get paginated list of resources
 *     description: Returns a paginated list of resources with filtering options.
 *     tags: [RVS Analytics - Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated resource list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResourceListResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/resources/list", Jwt.verifyToken, getResourceList);

// ======================
// SPACE OPTIMIZATION ENDPOINTS
// ======================

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/analytics:
 *   get:
 *     summary: Get space optimization analytics (KPIs + Charts)
 *     description: Returns space optimization KPIs and chart data with filtering options.
 *     tags: [RVS Analytics - Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           default: occupancy_rate
 *           enum: [occupancy_rate, total_area, cost_per_sqm, vacant_area]
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           default: department_id
 *           enum: [department_id, location, space_id]
 *     responses:
 *       200:
 *         description: Space optimization analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpaceAnalyticsResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/spaces/analytics", Jwt.verifyToken, getSpaceOptimizationAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/kpis:
 *   get:
 *     summary: Get space optimization KPIs
 *     description: Returns key performance indicators for space optimization.
 *     tags: [RVS Analytics - Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Space KPIs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpaceKPIResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/spaces/kpis", Jwt.verifyToken, getSpaceKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/chart:
 *   get:
 *     summary: Get space chart data
 *     description: Returns chart-ready data for space metrics.
 *     tags: [RVS Analytics - Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [occupancy_rate, total_area, cost_per_sqm, vacant_area]
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [department_id, location, space_id]
 *     responses:
 *       200:
 *         description: Chart data for spaces
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartDataResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/spaces/chart", Jwt.verifyToken, getSpaceChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/spaces/list:
 *   get:
 *     summary: Get paginated list of spaces
 *     description: Returns a paginated list of spaces with filtering options.
 *     tags: [RVS Analytics - Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated space list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpaceListResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/spaces/list", Jwt.verifyToken, getSpaceList);

// ======================
// VENDOR PERFORMANCE ENDPOINTS
// ======================

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/analytics:
 *   get:
 *     summary: Get vendor performance analytics (KPIs + Charts)
 *     description: Returns vendor performance KPIs and chart data with filtering options.
 *     tags: [RVS Analytics - Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *           default: service_quality_score
 *           enum: [service_quality_score, delay_days, actual_cost, days_to_pay, contract_compliance]
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           default: service_type
 *           enum: [service_type, vendor_name, contract_terms]
 *     responses:
 *       200:
 *         description: Vendor performance analytics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorAnalyticsResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/vendors/analytics", Jwt.verifyToken, getVendorPerformanceAnalytics);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/kpis:
 *   get:
 *     summary: Get vendor performance KPIs
 *     description: Returns key performance indicators for vendor performance.
 *     tags: [RVS Analytics - Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vendor KPIs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorKPIResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/vendors/kpis", Jwt.verifyToken, getVendorKPIs);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/chart:
 *   get:
 *     summary: Get vendor chart data
 *     description: Returns chart-ready data for vendor metrics.
 *     tags: [RVS Analytics - Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *           enum: [service_quality_score, delay_days, actual_cost, days_to_pay, contract_compliance]
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [service_type, vendor_name, contract_terms]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Chart data for vendors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChartDataResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/vendors/chart", Jwt.verifyToken, getVendorChartData);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/vendors/list:
 *   get:
 *     summary: Get paginated list of vendors
 *     description: Returns a paginated list of vendors with filtering options.
 *     tags: [RVS Analytics - Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated vendor list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorListResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/vendors/list", Jwt.verifyToken, getVendorList);

// ======================
// DROPDOWN FILTER ENDPOINTS
// ======================

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/departments:
 *   get:
 *     summary: Get list of departments for filters
 *     description: Returns available departments for filtering RVS analytics.
 *     tags: [RVS Analytics - Filters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/filters/departments", Jwt.verifyToken, getDepartments);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/resource-types:
 *   get:
 *     summary: Get list of resource types for filters
 *     description: Returns available resource types for filtering.
 *     tags: [RVS Analytics - Filters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resource types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/filters/resource-types", Jwt.verifyToken, getResourceTypes);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/locations:
 *   get:
 *     summary: Get list of locations for filters
 *     description: Returns available locations for filtering spaces.
 *     tags: [RVS Analytics - Filters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/filters/locations", Jwt.verifyToken, getLocations);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/service-types:
 *   get:
 *     summary: Get list of service types for filters
 *     description: Returns available service types for filtering vendors.
 *     tags: [RVS Analytics - Filters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/filters/service-types", Jwt.verifyToken, getServiceTypes);

/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/filters/vendor-names:
 *   get:
 *     summary: Get list of vendor names for filters
 *     description: Returns available vendor names for filtering.
 *     tags: [RVS Analytics - Filters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor names
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FilterResponse'
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/filters/vendor-names", Jwt.verifyToken, getVendorNames);

// Test endpoint
/**
 * @swagger
 * /api/v1/administrative/rvsAnalytics/test:
 *   get:
 *     summary: Test endpoint to verify RVS Analytics is working
 *     description: Returns a simple test response to verify the service is operational.
 *     tags: [RVS Analytics - Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "RVS Analytics routes working"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-20T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid JWT token
 */
router.get("/test", Jwt.verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    message: "RVS Analytics routes working",
    timestamp: new Date().toISOString()
  });
});

export default router;