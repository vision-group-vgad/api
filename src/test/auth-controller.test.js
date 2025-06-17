import AuthenticationController from "../auth/auth-controller.js";
import axios from "axios";
import Utils from "../utils/utils.js";
import errorResponse from "../utils/error-response.js";
import Jwt from "../auth/jwt.js";
import {
  saveSession,
  getSession,
  deleteSession,
  createDepartment,
  createPosition,
  createUser,
} from "../config/sql.js";
import logger from "../utils/logger.js";
import { expect, jest, describe, beforeEach, it } from "@jest/globals";

jest.mock("axios");
jest.mock("../utils/utils.js");
jest.mock("../utils/error-response.js");
jest.mock("./jwt.js");
jest.mock("../config/sql.js");
jest.mock("../utils/logger.js");

describe("AuthenticationController", () => {
  let authController;

  beforeEach(() => {
    jest.clearAllMocks();
    authController = new AuthenticationController();
  });

  describe("authenticate", () => {
    it("returns error if email is invalid", async () => {
      Utils.isValidEmail.mockReturnValue(false);
      errorResponse.mockReturnValue({
        status: 400,
        message: "Invalid email format",
      });

      const result = await authController.authenticate(
        "invalidemail",
        "password"
      );

      expect(Utils.isValidEmail).toHaveBeenCalledWith("invalidemail");
      expect(errorResponse).toHaveBeenCalledWith(400, "Invalid email format");
      expect(result).toEqual({ status: 400, message: "Invalid email format" });
    });

    it("calls axios.post and returns user on successful login", async () => {
      Utils.isValidEmail.mockReturnValue(true);
      Utils.getSessionId.mockReturnValue("sess123");

      const fakeResponse = {
        status: 200,
        data: {
          sessionId: "sess123",
          username: "user@test.com",
          email: "user@test.com",
          position: "Developer",
          department: "Engineering",
          first_name: "Test",
          last_name: "User",
        },
      };

      axios.post.mockResolvedValue(fakeResponse);
      getSession.mockReturnValue("sess123");
      Jwt.generateToken.mockReturnValue("fake-token");

      // Spy on SQL utils and logger to confirm calls
      saveSession.mockImplementation(() => {});
      deleteSession.mockImplementation(() => {});
      createDepartment.mockImplementation(() => {});
      createPosition.mockImplementation(() => {});
      createUser.mockImplementation(() => {});
      logger.info.mockImplementation(() => {});
      logger.warn.mockImplementation(() => {});

      // Fix authenticate method in your class: it should be
      // return Utils.isValidEmail(username)
      //   ? this.#submitLoginInfo(username, password).then(res => this.#validateResponse(res))
      //   : errorResponse(400, "Invalid email format");

      // Run authenticate and get the result
      const result = await authController.authenticate(
        "user@test.com",
        "password"
      );

      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/api/auth/signin",
        {
          username: "user@test.com",
          password: "password",
          sessionId: "sess123",
        }
      );

      expect(saveSession).toHaveBeenCalledWith("sess123");
      expect(getSession).toHaveBeenCalledWith("sess123");
      expect(deleteSession).toHaveBeenCalledWith("sess123");

      expect(createDepartment).toHaveBeenCalledWith("Engineering");
      expect(createPosition).toHaveBeenCalledWith("Developer");
      expect(createUser).toHaveBeenCalledWith(
        "user@test.com",
        "Test",
        "User",
        "Developer",
        "Engineering"
      );

      expect(Jwt.generateToken).toHaveBeenCalledWith("user@test.com");

      expect(logger.info).toHaveBeenCalledWith(
        "[sess123] user@test.com is logging in."
      );
      expect(logger.info).toHaveBeenCalledWith("user@test.com is logged in.");

      expect(result).toEqual({
        userEmail: "user@test.com",
        position: "Developer",
        department: "Engineering",
        token: "fake-token",
      });
    });

    it("returns errorResponse for unsuccessful login status codes", async () => {
      Utils.isValidEmail.mockReturnValue(true);
      Utils.getSessionId.mockReturnValue("sess123");

      const statuses = [400, 401, 403, 404, 500];
      const messages = {
        400: "Bad request",
        401: "Invalid credentials",
        403: "Forbidden",
        404: "User not found",
        500: "Internal server error",
      };

      for (const status of statuses) {
        const response = {
          status,
          data: { sessionId: "sess123", username: "user@test.com" },
        };
        axios.post.mockResolvedValue(response);
        getSession.mockReturnValue("sess123");
        logger.warn.mockImplementation(() => {});
        errorResponse.mockImplementation((code, msg) => ({
          status: code,
          message: msg,
        }));

        const result = await authController.authenticate(
          "user@test.com",
          "password"
        );

        expect(logger.warn).toHaveBeenCalledWith(
          "[sess123] user@test.com is not logged in."
        );
        expect(errorResponse).toHaveBeenCalledWith(status, messages[status]);
        expect(result).toEqual({ status, message: messages[status] });
      }
    });
  });
});
