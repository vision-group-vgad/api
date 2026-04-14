import Jwt from "./jwt.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const users = JSON.parse(readFileSync(path.join(__dirname, "users.json"), "utf8"));

class AuthenticationController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.sessionId = null;
    this.email = null;
    this.password = null;
  }

  async authenticate(email, password) {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");

    // Plain text comparison — will switch to hashed comparison on AD integration
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = Jwt.generateToken(user.email, {
      role: user.role,
      name: user.name,
      department: user.department,
    });

    return {
      user_name: user.name,
      user_email: user.email,
      department: user.department,
      role: user.role,
      token: token,
    };
  }
}

export default AuthenticationController;
