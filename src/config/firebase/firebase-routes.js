import {
  fetchRoles,
  addRole,
  updateRole,
  deleteRole,
} from "./firebase-service.js";
import express from "express";
import Jwt from "../../auth/jwt.js";

const firebaseRouter = express.Router();

firebaseRouter.get("/roles/all-roles", Jwt.verifyToken, async (req, res) => {
  try {
    const roles = await fetchRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRouter.post("/roles/add", Jwt.verifyToken, async (req, res) => {
  try {
    const { role_name, role_code, department } = req.body;
    if (!role_name || !role_code)
      return res
        .status(400)
        .json({ error: "role_name and role_code are required" });
    await addRole({ role_name, role_code, department: department || "" });
    res.status(201).json({ message: "Role added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRouter.put("/roles/update", Jwt.verifyToken, async (req, res) => {
  try {
    const { role_name, role_code, department } = req.body;
    if (!role_name)
      return res.status(400).json({ error: "role_name is required" });
    const updates = {};
    if (role_code) updates.role_code = role_code;
    if (department) updates.department = department;
    await updateRole(role_name, updates);
    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRouter.delete("/roles/delete", Jwt.verifyToken, async (req, res) => {
  try {
    const { role_name } = req.query;
    if (!role_name)
      return res.status(400).json({ error: "role_name is required" });
    await deleteRole(role_name);
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default firebaseRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role_name:
 *           type: string
 *         role_code:
 *           type: string
 *         department:
 *           type: string
 *
 * tags:
 *   name: Roles
 *   description: API for managing user roles
 *
 * /api/v1/roles/all-roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *
 * /api/v1/roles/add:
 *   post:
 *     summary: Add a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role added successfully
 *
 * /api/v1/roles/update:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *
 * /api/v1/roles/delete:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: role_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Role name to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
