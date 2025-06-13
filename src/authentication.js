import axios from "axios";
import Utils from "./utils";
import errorResponse from "./error-response";

class Authentication {
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
    const response = await axios.post(this.API_URL + "signin", {
      username,
      password,
      sessionId: this.sessionId,
    });
    return response;
  }

  #validateResponse(response) {
    if (
      response.status === 200 &&
      response.data.sessionId === this.sessionId &&
      response.data.username === this.username
    ) {
      const { email: userEmail, position, department } = response.data;
      const user = {
        userEmail,
        position,
        department,
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
    return this.#submitLoginInfo(username, password).then(
      this.#validateResponse
    );
  }
}

export default Authentication;
