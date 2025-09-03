import Jwt from "./jwt.js";
import bcrypt from "bcrypt";
import { fetchUserByEmail } from "../config/firebase/firebase-user-service.js";
import { fetchRoleByCode } from "../config/firebase/firebase-role-service.js";
const encodeKey = (email) => email.replace(/\./g, ",");

class AuthenticationController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.sessionId = null;
    this.email = null;
    this.password = null;
  }

  // async #submitLoginInfo(email, password) {
  //   this.email = email;
  //   this.password = password;
  //   //Uncomment the block below in production & import axios
  //   // const response = await axios.post(this.VISION_GROUP_CMS_ROOT_URL + "signin", {
  //   //   email,
  //   //   password,
  //   //   sessionId: this.sessionId,
  //   // });
  //   const response = {
  //     status: 200,
  //     data: {
  //       email: "user@example.com",
  //       position: "Software Engineer",
  //       department: "Engineering",
  //       first_name: "Kalyango",
  //       last_name: "Thompson",
  //       sessionId: this.sessionId,
  //     },
  //   };

  //   return response;
  // }

  // async #validateResponse(response) {
  //   if (response.status === 200 && response.data.email === this.email) {
  //     const {
  //       email,
  //       position,
  //       department,
  //       first_name: firstName,
  //       last_name: lastName,
  //     } = response.data;

  //     const token = Jwt.generateToken(email);
  //     const user = {
  //       firstName,
  //       lastName,
  //       email,
  //       position,
  //       department,
  //       token,
  //     };
  //     return user;
  //   }

  //   switch (response.status) {
  //     case 400:
  //       return errorResponse(400, "Bad request");
  //     case 401:
  //       return errorResponse(401, "Invalid credentials");
  //     case 403:
  //       return errorResponse(403, "Forbidden");
  //     case 404:
  //       return errorResponse(404, "User not found");
  //     default:
  //       return errorResponse(500, "Internal server error");
  //   }
  // }

  async authenticate(email, password) {
    const encodedEmail = encodeKey(email);
    const user = await fetchUserByEmail(encodedEmail);
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const role = await fetchRoleByCode(user.role_code);
    if (!role) throw new Error("Authentication error, role not found.");

    const token = Jwt.generateToken(user.user_email);

    return {
      user_name: user.user_name,
      user_email: user.user_email,
      department: user.department,
      role_name: role.role_name,
      role_code: user.role_code,
      token: token,
    };
  }
}

export default AuthenticationController;
