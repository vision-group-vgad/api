import crypto from "crypto";

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
}

export default Utils;
