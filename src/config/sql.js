import pool from "./db.js";
import Utils from "../utils/utils.js";

export async function saveSession(sessionId) {
  const result = await pool.query(
    "INSERT INTO sessions (session_id) VALUES ($1)",
    [sessionId]
  );
  return result.rows[0];
}

export async function getSession(sessionId) {
  const result = await pool.query(
    "SELECT * FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  return result;
}

export async function deleteSession(sessionId) {
  const result = await pool.query(
    "DELETE FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  return result;
}

export async function createDepartment(name) {
  const result = await pool.query(
    "INSERT INTO departments (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
}

export async function createPosition(name) {
  const result = await pool.query(
    "INSERT INTO position (name) VALUES ($1) RETURNING *",
    [name]
  );
  return result.rows[0];
}

export async function getPositionByName(name) {
  const result = await pool.query("SELECT * FROM position WHERE name = $1", [
    name,
  ]);
  return result.rows[0];
}

export async function getDeparmentByName(name) {
  const result = await pool.query("SELECT * FROM department WHERE name = $1", [
    name,
  ]);
  return result.rows[0];
}

export async function createUser(
  email,
  firstName,
  lastName,
  departmentName,
  positionName
) {
  const department = await getDeparmentByName(departmentName);
  const position = await getPositionByName(positionName);
  const departmentId = department?.id ?? null;
  const positionId = position?.id ?? null;
  const profilePicture = Utils.getImagePath(email);

  const result = await pool.query(
    `INSERT INTO users (email, first_name, last_name, profile_picture, department, position)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [email, firstName, lastName, profilePicture, departmentId, positionId]
  );

  return result.rows[0];
}

export async function updateUserImageByEmail(email) {
  const imageBuffer = Utils.getImagePath(email);

  const result = await pool.query(
    `UPDATE users
     SET profile_picture = $1
     WHERE email = $2
     RETURNING *`,
    [imageBuffer, email]
  );
  return result.rows[0];
}

export async function updateUser(
  userId,
  email,
  firstName,
  lastName,
  profilePicture,
  departmentId,
  positionId
) {
  const result = await pool.query(
    `UPDATE users
     SET email = $1,
         first_name = $2,
         last_name = $3,
         profile_picture = $4,
         department = $5,
         position = $6
     WHERE user_id = $7
     RETURNING *`,
    [
      email,
      firstName,
      lastName,
      profilePicture,
      departmentId,
      positionId,
      userId,
    ]
  );
  return result.rows[0];
}

export async function getUserById(userId) {
  const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result.rows[0];
}

export async function deleteUser(userId) {
  const result = await pool.query(`DELETE FROM users WHERE user_id = $1`, [
    userId,
  ]);
  return result;
}

export async function getAllUsers() {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
}
