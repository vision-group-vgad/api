import express from "express";
import AuthenticationController from "./auth-controller.js";
import Jwt from "./jwt.js";

const authRouter = express.Router();
const authController = new AuthenticationController();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: Kalyango
 *                 lastName:
 *                   type: string
 *                   example: Thompson
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 position:
 *                   type: string
 *                   example: Software Engineer
 *                 department:
 *                   type: string
 *                   example: Engineering
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized – invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authController.authenticate(email, password);
    res.json(response);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/v1/auth/ping:
 *   get:
 *     summary: Health check
 *     description: Returns a simple pong response to verify service is up.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: pong
 */
authRouter.get("/ping", async (req, res) => {
  res.json("pong");
});

export default authRouter;
