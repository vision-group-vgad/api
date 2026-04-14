import express from "express";
import { getSetupTimeOptimization } from "./service.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/operations/setup-time:
 *   get:
 *     summary: Get setup time records with calculated durations
 *     tags: [SetupTimeOptimization]
 *     parameters:
 *       - in: query
 *         name: machine
 *         schema:
 *           type: string
 *           enum: [Heidelberg Speedmaster, Goss Magnum, Komori Lithrone]  # dropdown in Swagger UI
 *         required: false
 *         description: Filter by machine (optional)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for filtering records (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for filtering records (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of setup time records with optimization details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobId:
 *                         type: string
 *                       machine:
 *                         type: string
 *                       operator:
 *                         type: string
 *                       operatorExperienceLevel:
 *                         type: string
 *                         description: Experience level of the operator (Junior, Intermediate, Senior)
 *                       service:
 *                         type: string
 *                       setupDate:
 *                         type: string
 *                         format: date
 *                       setupStartTime:
 *                         type: string
 *                         format: time
 *                       setupEndTime:
 *                         type: string
 *                         format: time
 *                       setupDurationMinutes:
 *                         type: number
 *                       expectedSetupDurationMinutes:
 *                         type: number
 *                         description: Target setup duration for optimization
 *                       changeoverType:
 *                         type: string
 *                         description: Type of setup/changeover (Tooling, Cleaning, Calibration, etc.)
 *                       jobPriority:
 *                         type: string
 *                         description: Priority of the job (High, Medium, Low)
 *                       shift:
 *                         type: string
 *                         description: Shift during which the setup occurred (Morning, Afternoon, Night)
 *                       comments:
 *                         type: string
 *                         description: Optional notes about the setup
 */



router.get("/", async (req, res) => {
  try {
    const { machine, startDate, endDate } = req.query;

    const data = await getSetupTimeOptimization({ machine, startDate, endDate });

    res.status(200).json({
      success: true,
      data,
      message: data.length ? "Setup time records retrieved successfully." : "No records found.",
    });
  } catch {
    
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching setup time records.",
    });
  }
});


export default router;
