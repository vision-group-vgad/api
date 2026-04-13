import express from "express";
import { getAllDeliveries } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Delivery Timelines
 *   description: Delivery timeline management
 */

/**
 * @swagger
 * /api/v1/operations/delivery-timelines:
 *   get:
 *     summary: Get all delivery timelines
 *     description: Retrieve all deliveries with optional filters.
 *     tags: [Delivery Timelines]
 *     parameters:
 *       - in: query
 *         name: dispatcher
 *         schema:
 *           type: string
 *         description: Filter by dispatcher name
 *       - in: query
 *         name: depot
 *         schema:
 *           type: string
 *         description: Filter by depot
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of deliveries
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
 *                       deliveryId:
 *                         type: string
 *                       publication:
 *                         type: string
 *                       dispatcher:
 *                         type: string
 *                       route:
 *                         type: string
 *                       depot:
 *                         type: string
 *                       pickupTime:
 *                         type: string
 *                         format: date-time
 *                       expectedDeliveryTime:
 *                         type: string
 *                         format: date-time
 *                       actualDeliveryTime:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       quantity:
 *                         type: integer
 */


router.get("/", async (req, res) => {
  const { dispatcher, depot, startDate, endDate } = req.query;

  try {
    const data = await getAllDeliveries({ dispatcher, depot, startDate, endDate });

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve delivery timelines.",
    });
  }
});

export default router;