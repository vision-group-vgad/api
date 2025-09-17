import Jwt from "./jwt.js";
import bcrypt from "bcrypt";
import { fetchUserByEmail } from "../config/firebase/firebase-user-service.js";
import { fetchRoleByCode } from "../config/firebase/firebase-role-service.js";
import { fetchImageByEmail } from "../config/firebase/firebase-user-mgt-service.js";
const encodeKey = (email) => email.replace(/\./g, ",");
import { getUniqueName } from "../utils/common/common-functionalities.js";

class AuthenticationController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.sessionId = null;
    this.email = null;
    this.password = null;
  }

  async authenticate(email, password) {
    const encodedEmail = encodeKey(email);
    const user = await fetchUserByEmail(encodedEmail);
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const role = await fetchRoleByCode(user.role_code);
    if (!role) throw new Error("Authentication error, role not found.");

    const token = Jwt.generateToken(user.user_email, {
      department: user.department,
      position: role.role_name,
      firstName: user.user_name.split(" ")[0] || user.user_name,
      lastName: user.user_name.split(" ").slice(1).join(" ") || "",
      role_code: user.role_code,
      role_name: role.role_name,
    });

    const imageBytes = await fetchImageByEmail(user.user_email);
    const names = `${getUniqueName()}`;

    return {
      user_name: names,
      user_email: user.user_email,
      department: user.department,
      role_name: role.role_name,
      role_code: user.role_code,
      token: token,
      image_bytes: imageBytes,
    };
  }
}

export default AuthenticationController;
