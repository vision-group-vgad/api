// import express from "express";
// import path from "path";
// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import Jwt from "../auth/jwt.js";
// import { getProfileByEmail, updateProfileImage } from "./service.js";
// import { upload } from "./multer.js";
// import prisma from "../utils/auth-utils/prisma-transport.js";

// const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //GET user account data
// router.get("/", async (req, res) => {
//   const { firstName, lastName, email, role, department } = req.user;

//   try {
//     const image = await prisma.profileImage.findUnique({
//       where: { email },
//       select: { imageUrl: true },
//     });

//     res.status(200).json({
//       firstName,
//       lastName,
//       email,
//       role,
//       department,
//       imageUrl: image?.imageUrl || null,
//     });
//   } catch (err) {
//     console.error("Failed to fetch account:", err);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// });

// // POST upload or update image
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const email = req.user?.email;
//     if (!email)
//       return res.status(401).json({ message: "Invalid token payload" });

//     if (!req.file)
//       return res.status(400).json({ message: "No image file provided" });

//     const filename = req.file.filename;
//     const publicPath = `/assets/profile_pics/${filename}`;

//     const existing = await getProfileByEmail(email);

//     // Delete old image file if exists
//     if (existing?.imageUrl) {
//       const oldPath = path.join(process.cwd(), existing.imageUrl);
//       try {
//         await fs.unlink(oldPath);
//       } catch (err) {
//         console.warn(`Old image not deleted: ${oldPath}`, err.message);
//       }
//     }

//     await updateProfileImage(email, publicPath);

//     res
//       .status(200)
//       .json({ message: "Image uploaded successfully", path: publicPath });
//   } catch (err) {
//     console.error("Image upload failed:", err);
//     if (err.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ message: "File too large" });
//     }
//     if (err.message === "Only image files are allowed") {
//       return res.status(400).json({ message: "Only image files are allowed" });
//     }
//     res.status(500).json({ message: "Image upload failed" });
//   }
// });

// export default router;
