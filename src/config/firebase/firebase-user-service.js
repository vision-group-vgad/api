import db from "./firebase.js";
import bcrypt from "bcrypt";
import fs from "fs/promises";

const usersRef = db.ref("users");

const encodeKey = (email) => email.replace(/\./g, ",");

export const addUser = async (user) => {
  if (!user.user_email) throw new Error("user_email is required");

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const userToSave = {
    ...user,
    password: hashedPassword,
  };

  await usersRef.child(encodeKey(user.user_email)).set(userToSave);
  return { ...userToSave, password: undefined };
};

export const updateUser = async (userEmail, updates) => {
  const encodedEmail = encodeKey(userEmail);

  const userSnap = await usersRef.child(encodedEmail).once("value");
  if (!userSnap.exists())
    throw new Error(`No user found with email: ${encodedEmail}`);

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  await usersRef.child(encodedEmail).update(updates);
  return { user_email: userEmail, ...updates, password: undefined };
};

export const deleteUser = async (userEmail) => {
  const encodedEmail = encodeKey(userEmail);
  const userSnap = await usersRef.child(encodedEmail).once("value");
  if (!userSnap.exists())
    throw new Error(`No user found with email: ${encodedEmail}`);

  await usersRef.child(encodedEmail).remove();
  return userEmail;
};

export const fetchUsers = async () => {
  const snapshot = await usersRef.once("value");
  const data = snapshot.val() || {};
  return Object.entries(data).map(([key, value]) => ({
    user_email: key,
    ...value,
    password: "*****",
  }));
};

export const fetchUserByEmail = async (email) => {
  const snapshot = await usersRef.child(encodeKey(email)).once("value");
  if (!snapshot.exists()) return null;
  const user = snapshot.val();
  return { user_email: email, ...user };
};

export const bulkAddUsersFromFile = async () => {
  try {
    const data = await fs.readFile("./users.json", "utf-8");
    const users = JSON.parse(data);

    for (const user of users) {
      await addUser(user);
    }
    console.log("Bulk upload completed");
  } catch (err) {
    console.error("Error reading users.json:", err.message);
    throw err;
  }
};
