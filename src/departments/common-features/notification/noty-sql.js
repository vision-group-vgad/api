import pool from "../../../config/db.js";
import { sendNotification } from "./noty-socket.js";

async function createNotification(body, image_url, recepient) {
  const result = await pool.query(
    `INSERT INTO notifications (body, image_url, recepient)
     VALUES ($1, $2, $3)
     RETURNING id, body, time, image_url, recepient, is_starred, is_read`,
    [body, image_url, recepient]
  );
  sendNotification(result.rows[0]);
  return result.rows[0];
}

async function markAsRead(id) {
  const result = await pool.query(
    "UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function markAsStarred(id) {
  const result = await pool.query(
    "UPDATE notifications SET is_starred = TRUE WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function unStarNotification(id) {
  const result = await pool.query(
    "UPDATE notifications SET is_starred = FALSE WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function getNotificationsByRecepient(recepient) {
  const result = await pool.query(
    "SELECT * FROM notifications WHERE recepient = $1 ORDER BY time DESC",
    [recepient]
  );
  return result.rows;
}

async function deleteNotification(id) {
  const result = await pool.query(
    "DELETE FROM notifications WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

export {
  createNotification,
  markAsRead,
  markAsStarred,
  getNotificationsByRecepient,
  deleteNotification,
  unStarNotification,
};
