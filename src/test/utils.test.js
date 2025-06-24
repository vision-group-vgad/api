import Utils from "../utils/utils.js";
import axios from "axios";
import { describe, it, expect, jest, afterAll, beforeAll } from "@jest/globals";
import crypto from "crypto";

axios.post = jest.fn();

describe("Utils", () => {
  let originalDateNow;

  beforeAll(() => {
    originalDateNow = Date.now;
    jest.spyOn(Date, "now").mockImplementation(() => 1234567890000);
    jest.spyOn(crypto, "randomBytes").mockReturnValue({
      toString: () => "mockedhexstring",
    });
  });

  afterAll(() => {
    globalThis.Date.now = originalDateNow;
    jest.restoreAllMocks();
  });

  it("should return true for a valid email", () => {
    expect(Utils.isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for an invalid email", () => {
    expect(Utils.isValidEmail("invalid-email")).toBe(false);
  });

  it("returns a predictable session ID", () => {
    const result = Utils.getSessionId();
    const expected = "fr5hugk0-mockedhexstring";
    expect(result).toBe(expected);
  });
});
