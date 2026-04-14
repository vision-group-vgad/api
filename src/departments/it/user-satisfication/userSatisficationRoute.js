// routes/satisfactionRoutes.js
import express from "express";
import { generateSatisfactionFeedbackController } from "./userSatisficationController.js";
const satisfactionRouter = express.Router();

/**
 * @swagger
 * /api/v1/it/satisfaction:
 *   get:
 *     summary: Overall user satisfaction KPIs and breakdowns
 *     tags: [Analytics]
 *     parameters:
 *       - in: query
 *         name: department
 *         required: false
 *         schema:
 *           type: string
 *           description: Comma-separated list of departments
 *           enum: [Finance, HR, IT, Sales And Operations, Editorial & Content, Administrative & Support, Others]
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           description: Comma-separated list of roles
 *           enum: [Helpdesk Agent, Network Engineer, System Admin, Support Manager]
 *       - in: query
 *         name: satisfaction
 *         required: false
 *         schema:
 *           type: string
 *           description: Comma-separated satisfaction levels
 *           enum: [Unsatisfied, Neutral, Satisfied]
 *       
 *     responses:
 *       200:
 *         description: Satisfaction KPIs and breakdowns
 *       500:
 *         description: Server error
 */
satisfactionRouter.get("/", generateSatisfactionFeedbackController);

export default satisfactionRouter;
