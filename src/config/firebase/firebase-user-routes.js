import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  bulkAddUsersFromFile,
} from "./firebase-user-service.js";
import express from "express";
import Jwt from "../../auth/jwt.js";

const firebaseUserRouter = express.Router();

firebaseUserRouter.get(
  "/users/all-users",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const users = await fetchUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

firebaseUserRouter.post("/users/add", Jwt.verifyToken, async (req, res) => {
  try {
    const { user_name, user_email, password, department, role_code } = req.body;

    if (!user_email?.trim() || !user_name?.trim()) {
      return res
        .status(400)
        .json({ error: "Both user_email and user_name are required" });
    }

    await addUser({
      user_name: user_name.trim(),
      user_email: user_email.trim(),
      password: password?.trim() || "",
      department: department?.trim() || "",
      role_code: role_code?.trim() || "",
    });

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

firebaseUserRouter.put("/users/update", Jwt.verifyToken, async (req, res) => {
  try {
    const { user_email, user_name, password, department, role_code } = req.body;

    if (!user_email?.trim()) {
      return res.status(400).json({ error: "user_email is required" });
    }

    const updates = {};
    if (user_name?.trim()) updates.user_name = user_name.trim();
    if (password?.trim()) updates.password = password.trim();
    if (department?.trim()) updates.department = department.trim();
    if (role_code?.trim()) updates.role_code = role_code.trim();

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "At least one field to update is required" });
    }

    await updateUser(user_email.trim(), updates);
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

firebaseUserRouter.delete(
  "/users/delete",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { user_email } = req.query;

      if (!user_email?.trim()) {
        return res.status(400).json({ error: "user_email is required" });
      }

      await deleteUser(user_email.trim());
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

firebaseUserRouter.post(
  "/users/bulk-add",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      await bulkAddUsersFromFile("users.json");
      return res.status(201).json({ message: "Bulk user upload completed" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default firebaseUserRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *         - user_email
 *       properties:
 *         user_name:
 *           type: string
 *           description: Full name of the user
 *         user_email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: User's password
 *         department:
 *           type: string
 *           description: Department the user belongs to
 *         role_code:
 *           type: string
 *           description: Role code assigned to the user
 *
 * tags:
 *   - name: Users
 *     description: API for managing users
 *
 * /api/v1/users/all-users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/v1/users/add:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User added successfully
 *
 * /api/v1/users/update:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: user_email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *
 * /api/v1/users/bulk-add:
 *   post:
 *     summary: Add multiple users from a JSON file
 *     tags: [Users]
 *     requestBody:
 *       description: No input required; reads `users.json` from the project root
 *       required: false
 *     responses:
 *       201:
 *         description: Bulk user upload completed
 *       500:
 *         description: Server error
 */
