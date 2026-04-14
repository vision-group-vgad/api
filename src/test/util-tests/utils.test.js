import Utils from "../../utils/auth-utils/utils.js";
import {
  describe,
  it,
  expect,
  jest,
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import crypto from "crypto";
import fs from "fs";
import path, { join } from "path";
import { fileURLToPath } from "url";

describe("Utils", () => {
  let originalDateNow;

  beforeAll(() => {
    originalDateNow = Date.now;
    jest.spyOn(Date, "now").mockImplementation(() => 1234567890000);
    jest.spyOn(crypto, "randomBytes").mockReturnValue({
      toString: () => "mockedhexstring",
    });
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    globalThis.Date.now = originalDateNow;
    jest.restoreAllMocks();
  });

  it("returns a predictable session ID", () => {
    const expected = "fr5hugk0-mockedhexstring";
    const result = Utils.getSessionId();
    expect(result).toBe(expected);
  });

  it("should return true for a valid email", () => {
    expect(Utils.isValidEmail("test@example.com")).toBe(true);
  });

  it("should return false for an invalid email", () => {
    expect(Utils.isValidEmail("invalid-email")).toBe(false);
  });

  it("should return false for an empty email", () => {
    expect(Utils.isValidEmail("")).toBe(false);
  });

  it("should return false for a null email", () => {
    expect(Utils.isValidEmail(null)).toBe(false);
  });

  it("should return false for a whitespace-only email", () => {
    expect(Utils.isValidEmail("   ")).toBe(false);
  });

  describe("Utils.getImagePath", () => {
    const userEmail = "test.user@example.com";
    const cleanEmail = "test_user_example_com";

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const profileImagesPath = join(
      __dirname,
      "..",
      "..",
      "assets",
      "profile-images"
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("returns matching image path when file exists", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readdirSync").mockReturnValue([`${cleanEmail}.png`]);

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, `${cleanEmail}.png`));
    });

    it("returns default image when no match is found", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readdirSync").mockReturnValue(["another_user.png"]);

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, "profile_pic.png"));
    });

    it("returns default image when directory doesn't exist", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(false);

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, "profile_pic.png"));
    });

    it("returns default image when fs.readdirSync throws error", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readdirSync").mockImplementation(() => {
        throw new Error("Filesystem error");
      });

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, "profile_pic.png"));
    });

    it("matches original email casing and cleaned email", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest
        .spyOn(fs, "readdirSync")
        .mockReturnValue([
          "test.user@example.com.jpg",
          "Test.User@example.com.jpeg",
        ]);

      const result = Utils.getImagePath("Test.User@example.com");
      expect(result).toMatch(/\.jpg$|\.jpeg$/);
    });

    it("ignores files with unsupported extensions", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest
        .spyOn(fs, "readdirSync")
        .mockReturnValue(["test_user_example_com.txt"]);

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, "profile_pic.png"));
    });

    it("still returns default image if unknown error occurs", () => {
      jest.spyOn(fs, "existsSync").mockReturnValue(true);
      jest.spyOn(fs, "readdirSync").mockImplementation(() => {
        throw new Error("Unexpected");
      });

      const result = Utils.getImagePath(userEmail);
      expect(result).toBe(join(profileImagesPath, "profile_pic.png"));
    });
  });
});
