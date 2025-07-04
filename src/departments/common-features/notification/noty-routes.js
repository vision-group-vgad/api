import express from "express";
import NotyController from "./NotyController.js";
import Jwt from "../../../auth/jwt.js";

const notificationRouter = express.Router();
const notificationController = new NotyController();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management API
 */

/**
 * @swagger
 * /api/v1/notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recepient
 *               - body
 *             properties:
 *               recepient:
 *                 type: string
 *                 example: user@example.com
 *               body:
 *                 type: string
 *                 example: You have a new message.
 *     responses:
 *       200:
 *         description: Notification created
 *       400:
 *         description: Missing recepient or body
 *       500:
 *         description: Failed to create notification
 */
notificationRouter.post("/create", Jwt.verifyToken, async (req, res) => {
  const { recepient, body } = req.body;
  const result = await notificationController.createNotification(
    recepient,
    body
  );
  res.json(result);
});

/**
 * @swagger
 * /api/v1/notifications/get-notifications:
 *   get:
 *     summary: Get all notifications for a recepient
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recepient
 *         schema:
 *           type: string
 *         required: true
 *         example: user@example.com
 *     responses:
 *       200:
 *         description: List of notifications
 *       500:
 *         description: Failed to retrieve notifications
 */
notificationRouter.get(
  "/get-notifications",
  Jwt.verifyToken,
  async (req, res) => {
    const { recepient } = req.query;
    const result = await notificationController.getNotificationsByRecepient(
      recepient
    );
    res.json(result);
  }
);

/**
 * @swagger
 * /api/v1/notifications/mark-as-read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       500:
 *         description: Failed to mark as read
 */
notificationRouter.put("/mark-as-read", Jwt.verifyToken, async (req, res) => {
  const { id } = req.body;
  const result = await notificationController.markAsRead(id);
  res.json(result);
});

/**
 * @swagger
 * /api/v1/notifications/mark-as-starred:
 *   put:
 *     summary: Mark a notification as starred
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Notification marked as starred
 *       500:
 *         description: Failed to mark as starred
 */
notificationRouter.put(
  "/mark-as-starred",
  Jwt.verifyToken,
  async (req, res) => {
    const { id } = req.body;
    const result = await notificationController.markAsStarred(id);
    res.json(result);
  }
);

/**
 * @swagger
 * /api/v1/notifications/unmark:
 *   put:
 *     summary: Unmark a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Notification unmarked
 *       500:
 *         description: Failed to unmark notification
 */
notificationRouter.put("/unmark", Jwt.verifyToken, async (req, res) => {
  const { id } = req.body;
  const result = await notificationController.unmark(id);
  res.json(result);
});

/**
 * @swagger
 * /api/v1/notifications/delete:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Notification deleted
 *       500:
 *         description: Failed to delete notification
 */
notificationRouter.delete("/delete", Jwt.verifyToken, async (req, res) => {
  const { id } = req.body;
  const result = await notificationController.deleteNotification(id);
  res.json(result);
});

export default notificationRouter;
