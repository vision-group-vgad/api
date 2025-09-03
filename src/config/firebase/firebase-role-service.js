import db from "./firebase.js";
import crypto from "crypto";

const rolesRef = db.ref("roles");

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
