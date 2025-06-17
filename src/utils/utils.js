import crypto from "crypto";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

class Utils {
  constructor() {}

  static getSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(16).toString("hex");
    return `${timestamp}-${randomPart}`;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  static getImageBuffer(imagePath = "./assets/profile_pic.png") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const imageBuffer = fs.readFileSync(join(__dirname, imagePath));
    return imageBuffer;
  }
}

export default Utils;
