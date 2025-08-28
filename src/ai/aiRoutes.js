import express from "express";
import Jwt from "../auth/jwt.js";
import { askAIHandler } from "./aiController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/ai/query:
 *   post:
 *     summary: Ask a question in natural language and get analytics results
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: How many vendors delivered early this month?
 *     responses:
 *       200:
 *         description: AI analytics result
 */
router.post("/query", Jwt.verifyToken, askAIHandler);

export default router;