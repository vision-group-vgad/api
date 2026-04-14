// import multer from "multer";
// import fs from "fs/promises";
// import path from "path";

// const uploadDir = path.join(process.cwd(), "assets", "profile_pics");

// await fs.mkdir(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function (_, __, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (_, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"), false);
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });
