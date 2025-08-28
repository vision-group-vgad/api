import SignalQualityMetricsController from "./SignalQualityMetricsController.js";
import Jwt from "../../../auth/jwt.js";
import { validateRange } from "../../../utils/common/common-functionalities.js";
import express from "express";

const sigQualityController = new SignalQualityMetricsController();
const sigQualityRouter = express.Router();

/**
 * @swagger
 * /api/v1/operations/signal-quality-metrics/in-range:
 *   get:
 *     summary: Get signal quality analytics within a date range
 *     description: >
 *       Returns signal quality analytics including:
 *         - Filtered signal quality data in the given date range
 *         - Unique cell towers
 *         - Best and worst performing towers
 *         - Average latency and packet loss
 *     tags: [Signal Quality Metrics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Successfully fetched analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Filtered signal quality records
 *                   items:
 *                     type: object
 *                     properties:
 *                       Date:
 *                         type: string
 *                       Timestamp:
 *                         type: string
 *                       Device_ID:
 *                         type: string
 *                       Cell_Tower:
 *                         type: string
 *                       Location:
 *                         type: string
 *                       RSRP_dBm:
 *                         type: number
 *                       RSRQ_dB:
 *                         type: number
 *                       SINR_dB:
 *                         type: number
 *                       RSSI_dBm:
 *                         type: number
 *                       Packet_Loss_percent:
 *                         type: number
 *                       Latency_ms:
 *                         type: number
 *                 summary:
 *                   type: object
 *                   description: Summary statistics
 *                   properties:
 *                     cell_towers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     best_performing_tower:
 *                       type: object
 *                       properties:
 *                         tower:
 *                           type: string
 *                         avgSINR:
 *                           type: number
 *                     worst_performing_tower:
 *                       type: object
 *                       properties:
 *                         tower:
 *                           type: string
 *                         avgSINR:
 *                           type: number
 *                     avg_latency:
 *                       type: number
 *                     avg_packet_loss:
 *                       type: number
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
sigQualityRouter.get("/in-range", Jwt.verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  validateRange(startDate, endDate);

  try {
    const results = await sigQualityController.getInRangeAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: `${error.message}`,
    });
  }
});

export default sigQualityRouter;
