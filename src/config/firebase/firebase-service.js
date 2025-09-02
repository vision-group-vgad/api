import db from "./firebase.js";

const rolesRef = db.ref("roles");

export const fetchRoles = async () => {
  const snapshot = await rolesRef.once("value");
  const data = snapshot.val() || {};
  return Object.values(data);
};

export const addRole = async (role) => {
  if (!role.role_name) throw new Error("role_name is required");
  await rolesRef.child(role.role_name).set(role);
  return role;
};

export const updateRole = async (roleName, updates) => {
  const roleSnap = await rolesRef.child(roleName).once("value");
  if (!roleSnap.exists())
    throw new Error(`No role found with name: ${roleName}`);
  await rolesRef.child(roleName).update(updates);
  return { role_name: roleName, ...updates };
};

export const deleteRole = async (roleName) => {
  const roleSnap = await rolesRef.child(roleName).once("value");
  if (!roleSnap.exists())
    throw new Error(`No role found with name: ${roleName}`);
  await rolesRef.child(roleName).remove();
  return roleName;
};
