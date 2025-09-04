import {
  fetchRoles,
  fetchRoleByCode,
  addRole,
  updateRole,
  deleteRole,
} from "./firebase-role-service.js";
import express from "express";
import Jwt from "../../auth/jwt.js";

const firebaseRoleRouter = express.Router();

firebaseRoleRouter.get("/roles/all-roles", async (req, res) => {
  try {
    const roles = await fetchRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRoleRouter.get("/roles/by-code", async (req, res) => {
  try {
    const { role_code } = req.query;
    if (!role_code)
      return res.status(400).json({ error: "role_code is required" });

    const role = await fetchRoleByCode(role_code);
    if (!role) return res.status(404).json({ error: "Role not found" });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRoleRouter.post("/roles/add", async (req, res) => {
  try {
    const { role_name, department } = req.body;
    if (!role_name)
      return res.status(400).json({ error: "role_name is required" });

    const newRole = await addRole({ role_name, department: department || "" });
    res.status(201).json({
      message: "Role added successfully",
      role: newRole,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRoleRouter.put("/roles/update", Jwt.verifyToken, async (req, res) => {
  try {
    const { role_name, department, new_role_name } = req.body;
    if (!role_name)
      return res.status(400).json({ error: "role_name is required" });

    const updates = {};
    if (new_role_name) updates.role_name = new_role_name;
    if (department) updates.department = department;

    const updatedRole = await updateRole(role_name, updates);
    res.status(200).json({
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

firebaseRoleRouter.delete(
  "/roles/delete",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { role_name } = req.query;
      if (!role_name)
        return res.status(400).json({ error: "role_name is required" });

      await deleteRole(role_name);
      res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default firebaseRoleRouter;

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
 * /api/v1/roles/by-code:
 *   get:
 *     summary: Get a role by role_code
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: role_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Role code to search
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 *
 * /api/v1/roles/add:
 *   post:
 *     summary: Add a new role (auto-generates role_code)
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role added successfully
 *
 * /api/v1/roles/update:
 *   put:
 *     summary: Update a role (role_code stays unchanged)
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *               new_role_name:
 *                 type: string
 *               department:
 *                 type: string
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
