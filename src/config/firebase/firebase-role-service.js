import db from "./firebase.js";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const rolesRef = db.ref("roles");
const roleMappingsRef = db.ref("codeUrlMappings");

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

export const addRoleMapping = async (roleCode, endpoints) => {
  if (!roleCode) throw new Error("roleCode is required");
  if (!Array.isArray(endpoints)) throw new Error("endpoints must be an array");

  const ref = roleMappingsRef.child(roleCode);

  const snapshot = await ref.once("value");
  const existingEndpoints = snapshot.exists() ? snapshot.val() : [];

  const updatedEndpoints = Array.from(
    new Set([...existingEndpoints, ...endpoints])
  );

  await ref.set(updatedEndpoints);

  return { roleCode, endpoints: updatedEndpoints };
};

export const fetchAllRoleMappings = async () => {
  const snapshot = await roleMappingsRef.once("value");
  return snapshot.val() || {};
};

export const fetchEndpointsByRole = async (roleCode) => {
  const snapshot = await roleMappingsRef.child(roleCode).once("value");
  return snapshot.exists() ? snapshot.val() : [];
};

export const bulkAddRoleMappings = async (fileName = "role_mappings.json") => {
  try {
    const filePath = path.resolve(process.cwd(), fileName);
    const fileData = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileData);

    const mappings = Array.isArray(parsed)
      ? Object.assign({}, ...parsed)
      : parsed;

    for (const [roleCode, endpoints] of Object.entries(mappings)) {
      if (!Array.isArray(endpoints)) {
        throw new Error(`Endpoints for ${roleCode} must be an array`);
      }
      await roleMappingsRef.child(roleCode).set(endpoints);
    }

    return {
      message: "Role mappings uploaded successfully",
      count: Object.keys(mappings).length,
    };
  } catch (error) {
    throw new Error(`Failed to upload role mappings: ${error.message}`);
  }
};

export const searchRoleEndpoints = async (roleCode) => {
  const endpoints = await fetchEndpointsByRole(roleCode);
  return {
    roleCode,
    endpoints,
  };
};
