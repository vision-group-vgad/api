import * as notySql from "../../departments/common-features/notification/noty-sql.js";
import * as db from "../../config/db.js";
import { jest, describe, afterEach, it, expect } from "@jest/globals";

describe("Notification SQL queries", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNotification", () => {
    it("should insert a new notification", async () => {
      const mockRow = {
        id: 1,
        body: "Hello",
        image_url: "img.png",
        recepient: "user@example.com",
      };
      jest.spyOn(db.default, "query").mockResolvedValue({ rows: [mockRow] });

      const result = await notySql.createNotification(
        "Hello",
        "img.png",
        "user@example.com"
      );

      expect(db.default.query).toHaveBeenCalledWith(
        "INSERT INTO notifications (body, image_url, recepient) VALUES ($1, $2, $3)",
        ["Hello", "img.png", "user@example.com"]
      );
      expect(result).toEqual(mockRow);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      const mockRow = { id: 2, is_read: true };
      jest.spyOn(db.default, "query").mockResolvedValue({ rows: [mockRow] });

      const result = await notySql.markAsRead(2);

      expect(db.default.query).toHaveBeenCalledWith(
        "UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *",
        [2]
      );
      expect(result).toEqual(mockRow);
    });
  });

  describe("markAsStarred", () => {
    it("should mark notification as starred", async () => {
      const mockRow = { id: 3, is_starred: true };
      jest.spyOn(db.default, "query").mockResolvedValue({ rows: [mockRow] });

      const result = await notySql.markAsStarred(3);

      expect(db.default.query).toHaveBeenCalledWith(
        "UPDATE notifications SET is_starred = TRUE WHERE id = $1 RETURNING *",
        [3]
      );
      expect(result).toEqual(mockRow);
    });
  });

  describe("getNotificationsByRecepient", () => {
    it("should return notifications for a user", async () => {
      const mockRows = [{ id: 1 }, { id: 2 }];
      jest.spyOn(db.default, "query").mockResolvedValue({ rows: mockRows });

      const result = await notySql.getNotificationsByRecepient(
        "user@example.com"
      );

      expect(db.default.query).toHaveBeenCalledWith(
        "SELECT * FROM notifications WHERE recepient = $1 ORDER BY time DESC",
        ["user@example.com"]
      );
      expect(result).toEqual(mockRows);
    });
  });

  describe("deleteNotification", () => {
    it("should delete notification by id", async () => {
      const mockRow = { id: 4 };
      jest.spyOn(db.default, "query").mockResolvedValue({ rows: [mockRow] });

      const result = await notySql.deleteNotification(4);

      expect(db.default.query).toHaveBeenCalledWith(
        "DELETE FROM notifications WHERE id = $1 RETURNING *",
        [4]
      );
      expect(result).toEqual(mockRow);
    });
  });
});
