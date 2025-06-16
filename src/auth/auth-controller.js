import axios from "axios";
import Utils from "../utils.js";
import errorResponse from "../error-response.js";
import Jwt from "./jwt.js";
import { saveSession, getSession, deleteSession } from "../config/sql.js";

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
      const { email: userEmail, position, department } = response.data;
      const token = Jwt.generateToken(userEmail);
      const user = {
        userEmail,
        position,
        department,
        token,
      };
      return user;
    }

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
