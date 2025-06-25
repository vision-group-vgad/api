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

  static isValidEmail(userEmail) {
    if (!userEmail) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(userEmail.trim());
  }

  static getImagePath(userEmail) {
    if (!userEmail) return null;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const profileImagesPath = join(__dirname, "..", "assets", "profile-images");

    try {
      if (!fs.existsSync(profileImagesPath)) {
        console.warn(
          `Profile images directory not found: ${profileImagesPath}`
        );
        return join(profileImagesPath, "profile_pic.png");
      }

      const files = fs.readdirSync(profileImagesPath);

      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];

      const cleanEmail = userEmail.toLowerCase().replace(/[^a-z0-9]/g, "_");

      const matchingFile = files.find((file) => {
        const fileNameWithoutExt = file.toLowerCase().replace(/\.[^/.]+$/, "");
        const fileExt = file.toLowerCase().substring(file.lastIndexOf("."));

        return (
          imageExtensions.includes(fileExt) &&
          (fileNameWithoutExt === cleanEmail ||
            fileNameWithoutExt === userEmail.toLowerCase() ||
            file.toLowerCase() === `${userEmail.toLowerCase()}.jpg` ||
            file.toLowerCase() === `${userEmail.toLowerCase()}.png`)
        );
      });

      if (matchingFile) {
        return join(profileImagesPath, matchingFile);
      }

      return join(profileImagesPath, "profile_pic.png");
    } catch (error) {
      console.error("Error accessing profile images:", error);
      return join(profileImagesPath, "profile_pic.png");
    }
  }
}

export default Utils;
