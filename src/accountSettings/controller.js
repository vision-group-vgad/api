import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getProfileByEmail, updateProfileImage } from "./service.js";
import Jwt from "../auth/jwt.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "assets",
  "profile_pics"
);


await fs.mkdir(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


/**
 * @swagger
 * tags:
 *   name: Account Settings
 *   description: User profile operations
 */

/**
 * @swagger
 * /api/v1/accountSettings:
 *   get:
 *     summary: Get user profile by email
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                   example: John
 *                 last_name:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: john.doe@example.com
 *                 profile_picture:
 *                   type: string
 *                   example: assets/profile_pics/john.png
 *                 department:
 *                   type: string
 *                   example: IT
 *                 position:
 *                   type: string
 *                   example: Software Engineer
 *       401:
 *         description: Invalid token payload
 *       500:
 *         description: Failed to fetch profile
 */

// GET account details
router.get("/", Jwt.verifyToken, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email)
      return res.status(401).json({ message: "Invalid token payload" });

    const profile = await getProfileByEmail(email);
    res.json(profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});


/**
 * @swagger
 * /api/v1/accountSettings:
 *   post:
 *     summary: Upload a new profile picture
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
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
 *                   example: Image uploaded successfully
 *                 path:
 *                   type: string
 *                   example: assets/profile_pics/john.png
 *       400:
 *         description: No image file provided / File too large / Only image files are allowed
 *       401:
 *         description: Invalid token payload
 *       500:
 *         description: Image upload failed
 */

// POST profile image upload
router.post("/", Jwt.verifyToken, upload.single("image"), async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email)
      return res.status(401).json({ message: "Invalid token payload" });

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const newPath = req.file.path.replace(/\\/g, "/");

    // Get current profile
    const currentProfile = await getProfileByEmail(email);
    const oldImagePath = currentProfile?.profile_picture;

    // Delete old image if it exists
    if (oldImagePath) {
      const fullOldPath = path.join(__dirname, "..", "..", "..", oldImagePath);
      try {
        await fs.unlink(fullOldPath);
        console.log(`Deleted old image: ${fullOldPath}`);
      } catch (err) {
        console.warn(`Failed to delete old image: ${fullOldPath}`, err.message);
      }
    }

    // Save new image path in DB
    await updateProfileImage(email, newPath);

    res.json({ message: "Image uploaded successfully", path: newPath });
  } catch (error) {
    console.error("Image upload failed:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large" });
    }

    if (error.message === "Only image files are allowed") {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
