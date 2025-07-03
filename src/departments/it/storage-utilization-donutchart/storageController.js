import express from "express";
import { getStorageUtilization } from "./storageService.js";
import Jwt from "../../../auth/jwt.js";

const router = express.Router();

// GET storage utilization data
router.get("/", Jwt.verifyToken, (req, res) => {
  try {
    const { label } = req.query;
    const data = getStorageUtilization(label);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Storage utilization error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
