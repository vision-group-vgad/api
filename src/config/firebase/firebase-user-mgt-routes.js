import express from "express";
import multer from "multer";
import {
  uploadImageByEmail,
  fetchImageByEmail,
} from "./firebase-user-mgt-service.js";

const userMgtRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Image upload and fetch operations by email
 */

/**
 * @swagger
 * /api/v1/user-mgt/upload-image:
 *   post:
 *     summary: Upload or update user image by email
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - image
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: Email or image missing
 *       500:
 *         description: Upload failed
 */
userMgtRouter.post(
  "/upload-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !req.file) {
        return res
          .status(400)
          .json({ message: "Email and image are required" });
      }
      const result = await uploadImageByEmail(email, req.file);
      res.json({ message: `Uploaded image for ${email}`, ...result });
    } catch (err) {
      console.error(err);
      res
        .status(err.message === "NOT_FOUND" ? 404 : 500)
        .json({ message: "Upload failed" });
    }
  }
);

/**
 * @swagger
 * /api/v1/user-mgt/fetch-image:
 *   get:
 *     summary: Fetch user image by email
 *     tags: [User Management]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User email to fetch the image for
 *     responses:
 *       200:
 *         description: Returns image bytes
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *       500:
 *         description: Fetch failed
 */
userMgtRouter.get("/fetch-image", async (req, res) => {
  const { email } = req.query;
  try {
    const bytes = await fetchImageByEmail(email);
    res.setHeader("Content-Type", "image/*");
    res.send(bytes);
  } catch (err) {
    console.error(err);
    res
      .status(err.message === "NOT_FOUND" ? 404 : 500)
      .json({ message: "Fetch failed" });
  }
});

export default userMgtRouter;
