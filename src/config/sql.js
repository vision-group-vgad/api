import pool from "./db.js";

async function saveSession(sessionId) {
  const result = await pool.query(
    "INSERT INTO sessions (session_id) VALUES ($1)",
    [sessionId]
  );
  return result.rows[0];
}

async function getSession(sessionId) {
  const result = await pool.query(
    "SELECT * FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  return result;
}

async function deleteSession(sessionId) {
  const result = await pool.query(
    "DELETE FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  return result;
}

async function createUser(department, position) {
  const result = await pool.query(
    `INSERT INTO users (department, position) VALUES ($1, $2) RETURNING *`,
    [department, position]
  );
  return result.rows[0];
}

async function getUserById(userId) {
  const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result.rows[0];
}

async function updateUser(userId, department, position) {
  const result = await pool.query(
    `UPDATE users SET department = $1, position = $2 WHERE user_id = $3 RETURNING *`,
    [department, position, userId]
  );
  return result.rows[0];
}

async function deleteUser(userId) {
  const result = await pool.query(`DELETE FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
}

async function getAllUsers() {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
}

export {
  saveSession,
  getSession,
  deleteSession,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
