import Utils from "../utils/auth-utils/utils.js";
import errorResponse from "../utils/auth-utils/error-response.js";
import Jwt from "./jwt.js";
import * as SQL from "./sql.js";
import logger from "../utils/auth-utils/logger.js";

class AuthenticationController {
  constructor() {
    this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
    this.sessionId = null;
    this.email = null;
    this.password = null;
  }

  async #submitLoginInfo(email, password) {
    this.email = email;
    this.password = password;
    this.sessionId = Utils.getSessionId();
    await SQL.saveSession(this.sessionId);
    logger.info(`[${this.sessionId}] ${this.email} is logging in.`);
    //Uncomment the block below in production & import axios
    // const response = await axios.post(this.VISION_GROUP_CMS_ROOT_URL + "signin", {
    //   email,
    //   password,
    //   sessionId: this.sessionId,
    // });
    const response = {
      status: 200,
      data: {
        email: "user@example.com",
        position: "Software Engineer",
        department: "Engineering",
        first_name: "Kalyango",
        last_name: "Thompson",
        sessionId: this.sessionId,
      },
    };

    return response;
  }

  async #validateSessionId(response) {
    return response.data.sessionId === (await SQL.getSession(this.sessionId));
  }

  async #validateResponse(response) {
    if (
      response.status === 200 &&
      this.#validateSessionId(response) &&
      response.data.email === this.email
    ) {
      await SQL.deleteSession(this.sessionId);
      const {
        email,
        position,
        department,
        first_name: firstName,
        last_name: lastName,
      } = response.data;
      await SQL.createDepartment(department);
      await SQL.createPosition(position);
      await SQL.createUser(email, firstName, lastName, position, department);
      const token = Jwt.generateToken(email);
      const user = {
        firstName,
        lastName,
        email,
        position,
        department,
        token,
      };
      logger.info(`${this.email} is logged in.`);
      return user;
    }
    logger.warn(`[${this.sessionId}] ${this.email} is not logged in.`);

    switch (response.status) {
      case 400:
        return errorResponse(400, "Bad request");
      case 401:
        return errorResponse(401, "Invalid credentials");
      case 403:
        return errorResponse(403, "Forbidden");
      case 404:
        return errorResponse(404, "User not found");
      default:
        return errorResponse(500, "Internal server error");
    }
  }

  async authenticate(email, password) {
    return Utils.isValidEmail(email)
      ? await this.#submitLoginInfo(email, password).then((res) =>
          this.#validateResponse(res)
        )
      : errorResponse(400, "Invalid email format");
  }
}

export default AuthenticationController;
