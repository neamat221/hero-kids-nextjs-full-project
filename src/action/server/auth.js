import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { dbconnect, collection } from "@/lib/dbconnect";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export const USER_ROLES = ["user", "admin"];
export const DEFAULT_ROLE = "user";

const normalizeRole = (role) =>
  USER_ROLES.includes(role) ? role : DEFAULT_ROLE;

export async function findUserByEmail(email) {
  const users = await dbconnect(collection.USER);
  return users.findOne({ kind: "account", email: normalizeEmail(email) });
}

export async function createUser({ name, email, password, role }) {
  const users = await dbconnect(collection.USER);
  const passwordHash = await bcrypt.hash(password, 10);

  const doc = {
    kind: "account",
    name: String(name).trim(),
    email: normalizeEmail(email),
    passwordHash,
    role: normalizeRole(role),
    createdAt: new Date(),
  };

  const result = await users.insertOne(doc);
  return {
    _id: result.insertedId,
    name: doc.name,
    email: doc.email,
    role: doc.role,
  };
}

export async function upsertGoogleUser({ name, email, role }) {
  const users = await dbconnect(collection.USER);
  const normalized = normalizeEmail(email);

  await users.updateOne(
    { kind: "account", email: normalized },
    {
      $setOnInsert: {
        kind: "account",
        name: name ?? normalized,
        email: normalized,
        provider: "google",
        role: normalizeRole(role),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return users.findOne({ kind: "account", email: normalized });
}

export async function setUserRole(email, role) {
  if (!USER_ROLES.includes(role)) {
    throw new Error(`Invalid role "${role}". Expected one of: ${USER_ROLES.join(", ")}`);
  }

  const users = await dbconnect(collection.USER);
  const result = await users.updateOne(
    { kind: "account", email: normalizeEmail(email) },
    { $set: { role } },
  );

  return result.matchedCount > 0;
}

export async function backfillUserRoles() {
  const users = await dbconnect(collection.USER);
  const result = await users.updateMany(
    { kind: "account", role: { $exists: false } },
    { $set: { role: DEFAULT_ROLE } },
  );

  return { matched: result.matchedCount, modified: result.modifiedCount };
}

export async function recordLogin({ userId, name, email, userAgent }) {
  const logins = await dbconnect(collection.USER);
  const doc = {
    kind: "login",
    userId: userId ? String(userId) : null,
    name: name ?? null,
    email: normalizeEmail(email),
    userAgent: userAgent ?? null,
    loggedInAt: new Date(),
  };
  const result = await logins.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function getAccountById(userId) {
  if (!userId || !ObjectId.isValid(String(userId))) return null;
  try {
    const user = await dbconnect(collection.USER);
    return await user.findOne(
      { kind: "account", _id: new ObjectId(String(userId)) },
      { projection: { passwordHash: 0 } },
    );
  } catch {
    return null;
  }
}

export async function getRecentLogins(limit = 5) {
  try {
    const user = await dbconnect(collection.USER);
    return await user
      .find({ kind: "login" })
      .sort({ loggedInAt: -1 })
      .limit(limit)
      .toArray();
  } catch {
    return [];
  }
}

export async function countAccounts() {
  try {
    const user = await dbconnect(collection.USER);
    return await user.countDocuments({ kind: "account" });
  } catch {
    return 0;
  }
}
