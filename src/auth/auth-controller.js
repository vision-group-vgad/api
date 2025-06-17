import axios from "axios";
import Utils from "../utils/utils.js";
import errorResponse from "../utils/error-response.js";
import Jwt from "./jwt.js";
import {
  saveSession,
  getSession,
  deleteSession,
  createDepartment,
  createPosition,
  createUser,
} from "../config/sql.js";
import logger from "../utils/logger.js";

class AuthenticationController {
  constructor() {
    this.API_URL = "http://localhost:8080/api/auth/";
    this.sessionId = null;
    this.username = null;
    this.password = null;
  }

  async #submitLoginInfo(username, password) {
    this.username = username;
    this.password = password;
    this.sessionId = Utils.getSessionId();
    saveSession(this.sessionId);
    logger.info(`[${this.sessionId}] ${this.username} is logging in.`);
    const response = await axios.post(this.API_URL + "signin", {
      username,
      password,
      sessionId: this.sessionId,
    });
    return response;
  }

  #validateSessionId(response) {
    return response.data.sessionId === getSession(this.sessionId);
  }

  #validateResponse(response) {
    if (
      response.status === 200 &&
      this.#validateSessionId(response) &&
      response.data.username === this.username
    ) {
      deleteSession(this.sessionId);
      const {
        email: userEmail,
        position,
        department,
        first_name: firstName,
        last_name: lastName,
      } = response.data;
      createDepartment(department);
      createPosition(position);
      createUser(userEmail, firstName, lastName, position, department);
      const token = Jwt.generateToken(userEmail);
      const user = {
        userEmail,
        position,
        department,
        token,
      };
      logger.info(`${this.username} is logged in.`);
      return user;
    }
    logger.warn(`[${this.sessionId}] ${this.username} is not logged in.`);

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

  async authenticate(username, password) {
    return Utils.isValidEmail(username)
      ? this.#submitLoginInfo(username, password).then(this.#validateResponse())
      : errorResponse(400, "Invalid email format");
  }
}

export default AuthenticationController;
