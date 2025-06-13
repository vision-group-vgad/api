import crypto from "crypto";

class Utils {
  constructor() {}

  static getSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(16).toString("hex");
    return `${timestamp}-${randomPart}`;
  }
}

export default Utils;
