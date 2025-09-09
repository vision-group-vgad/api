import {
  fetchRoles,
  fetchRoleByCode,
  addRole,
  updateRole,
  deleteRole,
  addRoleMapping,
  fetchAllRoleMappings,
  fetchEndpointsByRole,
  bulkAddRoleMappings,
} from "./firebase-role-service.js";
import express from "express";
import Jwt from "../../auth/jwt.js";

const firebaseRoleRouter = express.Router();

firebaseRoleRouter.get(
  "/roles/all-roles",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const roles = await fetchRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.get("/roles/by-code", Jwt.verifyToken, async (req, res) => {
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

firebaseRoleRouter.post("/roles/add", Jwt.verifyToken, async (req, res) => {
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

firebaseRoleRouter.post(
  "/roles/mappings/add",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { role_code, endpoints } = req.body;
      if (!role_code || !Array.isArray(endpoints)) {
        return res.status(400).json({
          error: "role_code and endpoints[] are required",
        });
      }

      const mapping = await addRoleMapping(role_code, endpoints);
      res.status(201).json({
        message: "Role mapping added successfully",
        mapping,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.get(
  "/roles/mappings/all",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const mappings = await fetchAllRoleMappings();
      res.status(200).json(mappings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.get(
  "/roles/mappings/by-role",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { role_code } = req.query;
      if (!role_code)
        return res.status(400).json({ error: "role_code is required" });

      const endpoints = await fetchEndpointsByRole(role_code);
      res.status(200).json({ role_code, endpoints });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.post(
  "/roles/mappings/bulk-upload",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { fileName } = req.body;
      const result = await bulkAddRoleMappings(
        fileName || "role_mappings.json"
      );
      res.status(201).json(result);
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
 *     RoleCollection:
 *       type: object
 *       additionalProperties:
 *         type: array
 *         items:
 *           type: string
 *
 * tags:
 *   name: Roles
 *   description: API for managing user roles and collections
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
 *
 * /api/v1/roles/mappings/add:
 *   post:
 *     summary: Add or update role → endpoints mapping
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_code:
 *                 type: string
 *               endpoints:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Mapping added successfully
 *
 * /api/v1/roles/mappings/all:
 *   get:
 *     summary: Get all role → endpoints mappings
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of role mappings
 *
 * /api/v1/roles/mappings/by-role:
 *   get:
 *     summary: Get endpoints for a specific role
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: role_code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role endpoints found
 */
