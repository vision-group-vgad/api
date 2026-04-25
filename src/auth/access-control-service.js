import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import ROLES, { getRolePatterns, matchesRolePatterns } from "./roles.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const overridesFilePath = path.join(__dirname, "role-overrides.json");
const auditFilePath = path.join(__dirname, "access-audit.json");

const ensureArray = (value) =>
  Array.isArray(value)
    ? Array.from(new Set(value.filter((item) => typeof item === "string" && item.trim()))).sort()
    : [];

async function readJsonFile(filePath, fallbackValue) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify(fallbackValue, null, 2));
      return fallbackValue;
    }
    throw error;
  }
}

async function writeJsonFile(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2));
}

export function getAllRoles() {
  return Object.keys(ROLES).sort();
}

function getBaseEndpointPatterns() {
  return Object.values(ROLES).flat();
}

function getOverridePatterns(payload) {
  const roleOverrides = payload?.roles && typeof payload.roles === "object" ? payload.roles : {};
  return Object.values(roleOverrides).flatMap((override) => [
    ...(Array.isArray(override?.grants) ? override.grants : []),
    ...(Array.isArray(override?.denies) ? override.denies : []),
  ]);
}

export async function getAvailableEndpointPatterns() {
  const payload = await readRoleOverrides();
  const merged = [...getBaseEndpointPatterns(), ...getOverridePatterns(payload)];
  return Array.from(new Set(merged.filter((pattern) => typeof pattern === "string" && pattern.trim()))).sort();
}

export async function getEndpointGroups() {
  const groups = new Map();
  const patterns = await getAvailableEndpointPatterns();

  for (const pattern of patterns) {
    const normalized = pattern === "*" ? ["Global"] : pattern.split("/").filter(Boolean);
    const groupName = normalized[2] || normalized[1] || normalized[0] || "Other";
    const bucket = groups.get(groupName) || [];
    bucket.push(pattern);
    groups.set(groupName, bucket);
  }

  return Array.from(groups.entries())
    .map(([group, patterns]) => ({ group, patterns: patterns.sort() }))
    .sort((left, right) => left.group.localeCompare(right.group));
}

export async function readRoleOverrides() {
  const payload = await readJsonFile(overridesFilePath, { roles: {} });
  return payload && typeof payload === "object" && payload.roles ? payload : { roles: {} };
}

export async function getRoleOverride(role) {
  const payload = await readRoleOverrides();
  const override = payload.roles?.[role] || {};
  return {
    grants: ensureArray(override.grants),
    denies: ensureArray(override.denies),
  };
}

export async function getEffectiveRolePatterns(role) {
  const basePatterns = getRolePatterns(role);
  const { grants, denies } = await getRoleOverride(role);
  const effective = new Set([...basePatterns, ...grants]);

  for (const denied of denies) {
    effective.delete(denied);
  }

  return Array.from(effective).sort();
}

export async function canRoleAccessWithOverrides(role, urlPath) {
  if (role === "super_admin") {
    return true;
  }

  const effectivePatterns = await getEffectiveRolePatterns(role);
  return matchesRolePatterns(effectivePatterns, urlPath);
}

export async function listRoleAccessSummaries() {
  const roles = getAllRoles();
  const summaries = [];

  for (const role of roles) {
    const basePatterns = getRolePatterns(role);
    const { grants, denies } = await getRoleOverride(role);
    const effectivePatterns = await getEffectiveRolePatterns(role);
    summaries.push({
      role,
      baseCount: basePatterns.length,
      grantCount: grants.length,
      denyCount: denies.length,
      effectiveCount: effectivePatterns.length,
    });
  }

  return summaries;
}

export async function updateRoleOverride(role, nextOverride, actor) {
  if (!ROLES[role]) {
    throw new Error(`Unknown role: ${role}`);
  }

  const catalog = new Set(await getAvailableEndpointPatterns());
  const grants = ensureArray(nextOverride.grants);
  const denies = ensureArray(nextOverride.denies);

  const invalidPatterns = [...grants, ...denies].filter((pattern) => !catalog.has(pattern));
  if (invalidPatterns.length > 0) {
    throw new Error(`Invalid endpoint patterns: ${invalidPatterns.join(", ")}`);
  }

  const payload = await readRoleOverrides();
  payload.roles[role] = { grants, denies };
  await writeJsonFile(overridesFilePath, payload);

  const auditLog = await readJsonFile(auditFilePath, []);
  auditLog.push({
    role,
    grants,
    denies,
    updatedAt: new Date().toISOString(),
    updatedBy: actor || "unknown",
  });
  await writeJsonFile(auditFilePath, auditLog);

  return {
    role,
    basePatterns: getRolePatterns(role),
    grants,
    denies,
    effectivePatterns: await getEffectiveRolePatterns(role),
  };
}

export async function getRoleAccessDetails(role) {
  if (!ROLES[role]) {
    throw new Error(`Unknown role: ${role}`);
  }

  const { grants, denies } = await getRoleOverride(role);
  return {
    role,
    basePatterns: getRolePatterns(role),
    grants,
    denies,
    effectivePatterns: await getEffectiveRolePatterns(role),
  };
}