import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const db = admin.database();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const encodeKey = (email) => email.replace(/\./g, ",");

export async function uploadImageByEmail(email, file) {
  if (!email || !file?.buffer) {
    throw new Error("Email and file buffer are required");
  }

  const base64Data = file.buffer.toString("base64");
  await db
    .ref(`profileImages/${encodeURIComponent(encodeKey(email))}`)
    .set(base64Data);

  return { key: email, message: "Image uploaded successfully" };
}

export async function fetchImageByEmail(email) {
  const snapshot = await db
    .ref(`profileImages/${encodeURIComponent(encodeKey(email))}`)
    .get();

  if (!snapshot.exists()) {
    const fallbackPath = path.join(
      __dirname,
      "../../assets",
      "profile_pic.png"
    );
    if (!fs.existsSync(fallbackPath))
      throw new Error("Fallback image not found");
    return fs.readFileSync(fallbackPath);
  }

  const base64Data = snapshot.val();
  return Buffer.from(base64Data, "base64");
}
