import {
  fetchRoles,
  fetchRoleByCode,
  addRole,
  updateRole,
  deleteRole,
  addRoleCollection,
  fetchAllRoleCollections,
  fetchRoleCollectionByKey,
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
  "/roles/collections/add",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { roles } = req.body;
      if (!Array.isArray(roles) || roles.length === 0)
        return res
          .status(400)
          .json({ error: "roles must be a non-empty array" });

      const newCollection = await addRoleCollection(roles);
      res.status(201).json({
        message: "Role collection added successfully",
        collection: newCollection,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.get(
  "/roles/collections/all",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const collections = await fetchAllRoleCollections();
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

firebaseRoleRouter.get(
  "/roles/collections/by-key",
  Jwt.verifyToken,
  async (req, res) => {
    try {
      const { key } = req.query;
      if (!key) return res.status(400).json({ error: "key is required" });

      const collection = await fetchRoleCollectionByKey(key);
      if (!collection)
        return res.status(404).json({ error: "Collection not found" });

      res.status(200).json(collection);
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
 * /api/v1/roles/collections/add:
 *   post:
 *     summary: Add a new role collection (first item is used as key)
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role collection added successfully
 *
 * /api/v1/roles/collections/all:
 *   get:
 *     summary: Get all role collections
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of role collections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleCollection'
 *
 * /api/v1/roles/collections/by-key:
 *   get:
 *     summary: Get a role collection by key (the first item in array)
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Key of the role collection (first role in the array)
 *     responses:
 *       200:
 *         description: Role collection found
 *       404:
 *         description: Role collection not found
 */
