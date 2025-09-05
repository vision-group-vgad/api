import db from "./firebase.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const rolesRef = db.ref("roles");
const collectionsRef = db.ref("collections");

const generateRoleCode = () => {
  return `ROLE-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};

export const fetchRoles = async () => {
  const snapshot = await rolesRef.once("value");
  const data = snapshot.val() || {};
  return Object.values(data);
};

export const fetchRoleByCode = async (roleCode) => {
  const snapshot = await rolesRef.once("value");
  const data = snapshot.val() || {};
  const roles = Object.values(data);
  return roles.find((role) => role.role_code === roleCode) || null;
};

export const fetchRoleByName = async (roleName) => {
  const snapshot = await rolesRef.once("value");
  const data = snapshot.val() || {};
  const roles = Object.values(data);
  return roles.find((role) => role.role_name === roleName) || null;
};

export const addRole = async (role) => {
  if (!role.role_name) throw new Error("role_name is required");

  const existingRole = await rolesRef.child(role.role_name).once("value");
  if (existingRole.exists()) {
    throw new Error(`Role "${role.role_name}" already exists`);
  }

  const newRole = {
    role_name: role.role_name,
    role_code: generateRoleCode(),
    department: role.department || "",
  };

  await rolesRef.child(role.role_name).set(newRole);
  return newRole;
};

export const updateRole = async (roleName, updates) => {
  const roleSnap = await rolesRef.child(roleName).once("value");
  if (!roleSnap.exists())
    throw new Error(`No role found with name: ${roleName}`);

  const currentRole = roleSnap.val();

  const updatedRole = {
    ...currentRole,
    role_name: updates.role_name || currentRole.role_name,
    department: updates.department || currentRole.department,
    role_code: currentRole.role_code,
  };

  if (updates.role_name && updates.role_name !== roleName) {
    await rolesRef.child(roleName).remove();
    await rolesRef.child(updatedRole.role_name).set(updatedRole);
  } else {
    await rolesRef.child(roleName).set(updatedRole);
  }

  return updatedRole;
};

export const deleteRole = async (roleName) => {
  const roleSnap = await rolesRef.child(roleName).once("value");
  if (!roleSnap.exists())
    throw new Error(`No role found with name: ${roleName}`);
  await rolesRef.child(roleName).remove();
  return roleName;
};

export const addRoleCollection = async (roles) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new Error("Roles must be a non-empty array");
  }
  const key = roles[0];
  await collectionsRef.child(key).set(roles);
  return { key, roles };
};

export const fetchAllRoleCollections = async () => {
  const snapshot = await collectionsRef.once("value");
  return snapshot.val() || {};
};

export const fetchRoleCollectionByKey = async (key) => {
  const snapshot = await collectionsRef.child(key).once("value");
  return snapshot.exists() ? snapshot.val() : null;
};

export const bulkAddRoleCollections = async (
  fileName = "roles_collections.json"
) => {
  try {
    const filePath = path.resolve(process.cwd(), fileName);
    const fileData = await fs.readFile(filePath, "utf-8");
    const collections = JSON.parse(fileData);

    for (const [key, roles] of Object.entries(collections)) {
      await collectionsRef.child(key).set(roles);
    }

    return {
      message: "Role collections uploaded successfully",
      count: Object.keys(collections).length,
    };
  } catch (error) {
    throw new Error(`Failed to upload role collections: ${error.message}`);
  }
};
